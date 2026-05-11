package edu.cit.ycoy.orderflow.cart;

import edu.cit.ycoy.orderflow.menu.FoodItem;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ERD MATCH: cart_id (FK to carts)
    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonIgnore
    private Cart cart;

    // ERD MATCH: product_id (FK to products, which we named FoodItem)
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private FoodItem foodItem;

    // ERD MATCH: quantity
    @Column(nullable = false)
    private Integer quantity = 1;

    public CartItem() {}

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }

    public FoodItem getFoodItem() { return foodItem; }
    public void setFoodItem(FoodItem foodItem) { this.foodItem = foodItem; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}