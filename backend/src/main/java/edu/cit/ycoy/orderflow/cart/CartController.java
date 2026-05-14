package edu.cit.ycoy.orderflow.cart;

import edu.cit.ycoy.orderflow.auth.User;
import edu.cit.ycoy.orderflow.auth.UserRepository;
import edu.cit.ycoy.orderflow.menu.FoodItem;
import edu.cit.ycoy.orderflow.menu.FoodItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
public class CartController {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final FoodItemRepository foodItemRepository;

    public CartController(CartRepository cartRepository, CartItemRepository cartItemRepository,
            UserRepository userRepository, FoodItemRepository foodItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.foodItemRepository = foodItemRepository;
    }

    @GetMapping("/{buyerId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long buyerId) {
        // Fetch all items from active carts for this buyer
        List<CartItem> items = cartItemRepository.findByCartBuyerIdAndCartStatus(buyerId, "active");
        return ResponseEntity.ok(items);
    }

    @PostMapping("/{buyerId}/add/{foodItemId}")
    public ResponseEntity<?> addToCart(@PathVariable Long buyerId, @PathVariable Long foodItemId) {
        try {
            User buyer = userRepository.findById(buyerId).orElseThrow(() -> new RuntimeException("Buyer not found"));
            FoodItem food = foodItemRepository.findById(foodItemId)
                    .orElseThrow(() -> new RuntimeException("Food not found"));
            User seller = food.getSeller();

            // 1. Find the Cart, or make a new one
            Cart cart = cartRepository.findByBuyerIdAndSellerIdAndStatus(buyerId, seller.getId(), "active")
                    .orElseGet(() -> {
                        Cart newCart = new Cart();
                        newCart.setBuyer(buyer);
                        newCart.setSeller(seller);
                        newCart.setStatus("active");
                        return cartRepository.save(newCart);
                    });

            // 2. Add item to the Cart
            Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndFoodItemId(cart.getId(), foodItemId);

            if (existingItem.isPresent()) {
                CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + 1);
                return ResponseEntity.ok(cartItemRepository.save(item));
            }

            CartItem newItem = new CartItem();
            newItem.setCart(cart); // <-- THIS is what fixes the error!
            newItem.setFoodItem(food);
            newItem.setQuantity(1);

            return ResponseEntity.ok(cartItemRepository.save(newItem));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId) {
        if (cartItemRepository.existsById(cartItemId)) {
            cartItemRepository.deleteById(cartItemId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}