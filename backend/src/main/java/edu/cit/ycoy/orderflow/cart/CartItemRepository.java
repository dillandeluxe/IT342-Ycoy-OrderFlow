package edu.cit.ycoy.orderflow.cart;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    // Find all items inside a specific cart
    List<CartItem> findByCartId(Long cartId);
    
    // Check if a specific food item is already inside a specific cart
    Optional<CartItem> findByCartIdAndFoodItemId(Long cartId, Long foodItemId);

    // Find all active cart items for a buyer
    List<CartItem> findByCartBuyerIdAndCartStatus(Long buyerId, String status);
}