package edu.cit.ycoy.orderflow.transaction;

import edu.cit.ycoy.orderflow.cart.Cart;
import edu.cit.ycoy.orderflow.cart.CartItem;
import edu.cit.ycoy.orderflow.cart.CartRepository;
import edu.cit.ycoy.orderflow.cart.CartItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public TransactionController(OrderRepository orderRepository, OrderItemRepository orderItemRepository, PaymentRepository paymentRepository, CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @PostMapping("/checkout/{buyerId}")
    @Transactional 
    public ResponseEntity<?> processCheckout(@PathVariable Long buyerId, @RequestParam(defaultValue = "CASH") String paymentMethod) {
        
        // 1. Find the user's active cart safely
        List<Cart> activeCarts = cartRepository.findAll().stream()
                .filter(c -> c.getBuyer() != null && c.getBuyer().getId().equals(buyerId))
                .filter(c -> c.getStatus() == null || c.getStatus().equalsIgnoreCase("active"))
                .toList();

        if (activeCarts.isEmpty()) {
            return ResponseEntity.badRequest().body("No active cart found for checkout.");
        }

        // 1b. Among all active carts, find the one that actually has items.
        //     (There may be stale empty carts left from previous sessions.)
        Cart cart = null;
        List<CartItem> cartItems = new ArrayList<>();

        for (Cart activeCart : activeCarts) {
            List<CartItem> items = cartItemRepository.findByCartId(activeCart.getId());
            if (!items.isEmpty()) {
                cart = activeCart;
                cartItems = items;
            } else {
                // Clean up stale empty carts so this doesn't pile up
                cartRepository.delete(activeCart);
            }
        }

        if (cart == null || cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty. Please add items before checking out.");
        }

        // 2. Calculate Total Amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            BigDecimal itemTotal = item.getFoodItem().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        // 3. Create the Order Header
        Order newOrder = new Order();
        newOrder.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        newOrder.setUser(cart.getBuyer());
        newOrder.setTotalAmount(totalAmount);
        newOrder.setStatus("COMPLETED"); 
        newOrder.setShippingAddress("Pick-up at Store"); 
        newOrder = orderRepository.save(newOrder);

        // 4. Move Cart Items to permanent Order Items
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(newOrder);
            orderItem.setFoodItem(cartItem.getFoodItem());
            orderItem.setProductName(cartItem.getFoodItem().getName());
            orderItem.setPrice(cartItem.getFoodItem().getPrice()); // already a BigDecimal
            orderItem.setQuantity(cartItem.getQuantity());
            orderItemRepository.save(orderItem);
        }

        // 5. Create the Mock Payment
        Payment payment = new Payment();
        payment.setOrder(newOrder);
        payment.setAmount(totalAmount);
        payment.setStatus("SUCCESS");
        payment.setStripePaymentId(paymentMethod.equals("STRIPE") ? "mock_stripe_" + UUID.randomUUID().toString().substring(0, 8) : "CASH_ON_DELIVERY");
        paymentRepository.save(payment);

        // 6. Clear the Cart safely!
        // DO NOT delete items manually. Let Hibernate cascade the delete automatically, or it crashes!
        cartRepository.delete(cart);

        // 7. Return EXACTLY what Android expects to stop JSON infinite loop crashes!
        return ResponseEntity.ok(Map.of(
                "id", newOrder.getId(),
                "orderNumber", newOrder.getOrderNumber(),
                "totalAmount", newOrder.getTotalAmount(),
                "status", newOrder.getStatus()
        ));
    }
}