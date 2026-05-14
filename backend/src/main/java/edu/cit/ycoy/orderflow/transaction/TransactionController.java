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
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public TransactionController(OrderRepository orderRepository,
                                 OrderItemRepository orderItemRepository,
                                 PaymentRepository paymentRepository,
                                 CartRepository cartRepository,
                                 CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    // ── POST /checkout/{buyerId} ──────────────────────────────────────────────
    @PostMapping("/checkout/{buyerId}")
    @Transactional
    public ResponseEntity<?> processCheckout(
            @PathVariable Long buyerId,
            @RequestParam(defaultValue = "CASH") String paymentMethod) {

        // 1. Find the user's active cart(s)
        List<Cart> activeCarts = cartRepository.findAll().stream()
                .filter(c -> c.getBuyer() != null && c.getBuyer().getId().equals(buyerId))
                .filter(c -> c.getStatus() == null || c.getStatus().equalsIgnoreCase("active"))
                .toList();

        if (activeCarts.isEmpty()) {
            return ResponseEntity.badRequest().body("No active cart found for checkout.");
        }

        // 1b. Find the cart that actually has items; delete stale empty ones
        Cart cart = null;
        List<CartItem> cartItems = new ArrayList<>();
        for (Cart activeCart : activeCarts) {
            List<CartItem> items = cartItemRepository.findByCartId(activeCart.getId());
            if (!items.isEmpty()) {
                cart = activeCart;
                cartItems = items;
            } else {
                cartRepository.delete(activeCart);
            }
        }

        if (cart == null || cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty. Please add items before checking out.");
        }

        // 2. Calculate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            BigDecimal itemTotal = item.getFoodItem().getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        // 3. Create the Order — start as PENDING so sellers can see & action it
        Order newOrder = new Order();
        newOrder.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        newOrder.setUser(cart.getBuyer());
        newOrder.setTotalAmount(totalAmount);
        newOrder.setStatus("PENDING");
        newOrder.setShippingAddress("Pick-up at Store");
        newOrder = orderRepository.save(newOrder);

        // 4. Move cart items → permanent order items
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(newOrder);
            orderItem.setFoodItem(cartItem.getFoodItem());
            orderItem.setProductName(cartItem.getFoodItem().getName());
            orderItem.setPrice(cartItem.getFoodItem().getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItemRepository.save(orderItem);
        }

        // 5. Create the payment record
        Payment payment = new Payment();
        payment.setOrder(newOrder);
        payment.setAmount(totalAmount);
        payment.setStatus("PENDING");
        payment.setStripePaymentId(paymentMethod.equals("STRIPE")
                ? "mock_stripe_" + UUID.randomUUID().toString().substring(0, 8)
                : "CASH_ON_DELIVERY");
        paymentRepository.save(payment);

        // 6. Clear the cart
        cartRepository.delete(cart);

        // 7. Return a flat DTO (no entity serialization to avoid Jackson loops)
        return ResponseEntity.ok(Map.of(
                "id",          newOrder.getId(),
                "orderNumber", newOrder.getOrderNumber(),
                "totalAmount", newOrder.getTotalAmount(),
                "status",      newOrder.getStatus()
        ));
    }

    // ── GET /buyer/{buyerId} — buyer's own order history ──────────────────────
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<?> getOrdersByBuyer(@PathVariable Long buyerId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(buyerId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Order order : orders) {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

            List<Map<String, Object>> itemDtos = items.stream().map(oi -> Map.<String, Object>of(
                    "productName", oi.getProductName(),
                    "quantity",    oi.getQuantity(),
                    "price",       oi.getPrice()
            )).toList();

            result.add(Map.of(
                    "id",             order.getId(),
                    "orderNumber",    order.getOrderNumber(),
                    "totalAmount",    order.getTotalAmount(),
                    "status",         order.getStatus(),
                    "shippingAddress", order.getShippingAddress() != null
                                        ? order.getShippingAddress() : "Pick-up at Store",
                    "createdAt",      order.getCreatedAt() != null
                                        ? order.getCreatedAt().toString() : "",
                    "orderItems",     itemDtos
            ));
        }
        return ResponseEntity.ok(result);
    }

    // ── GET /seller/{sellerId} — all orders that contain this seller's items ──
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<?> getOrdersBySeller(@PathVariable Long sellerId) {
        List<Order> allOrders = orderRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Order order : allOrders) {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

            // Only include orders that have at least one item from this seller
            boolean belongsToSeller = items.stream().anyMatch(oi ->
                    oi.getFoodItem() != null &&
                    oi.getFoodItem().getSeller() != null &&
                    oi.getFoodItem().getSeller().getId().equals(sellerId));

            if (!belongsToSeller) continue;

            // Build flat item DTOs
            List<Map<String, Object>> itemDtos = items.stream()
                    .filter(oi -> oi.getFoodItem() != null &&
                                  oi.getFoodItem().getSeller() != null &&
                                  oi.getFoodItem().getSeller().getId().equals(sellerId))
                    .map(oi -> Map.<String, Object>of(
                            "productName", oi.getProductName(),
                            "quantity",    oi.getQuantity(),
                            "price",       oi.getPrice()
                    ))
                    .toList();

            result.add(Map.of(
                    "id",             order.getId(),
                    "orderNumber",    order.getOrderNumber(),
                    "totalAmount",    order.getTotalAmount(),
                    "status",         order.getStatus(),
                    "shippingAddress", order.getShippingAddress() != null
                                        ? order.getShippingAddress() : "Pick-up at Store",
                    "createdAt",      order.getCreatedAt() != null
                                        ? order.getCreatedAt().toString() : "",
                    "orderItems",     itemDtos
            ));
        }

        // Sort: newest (highest id) first
        result.sort((a, b) -> Long.compare((Long) b.get("id"), (Long) a.get("id")));
        return ResponseEntity.ok(result);
    }

    // ── PUT /{orderId}/status — seller marks order Complete or Cancelled ──────
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {

        return orderRepository.findById(orderId).map(order -> {
            order.setStatus(status.toUpperCase());
            orderRepository.save(order);
            return ResponseEntity.<Object>ok(Map.of(
                    "id",     order.getId(),
                    "status", order.getStatus()
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}