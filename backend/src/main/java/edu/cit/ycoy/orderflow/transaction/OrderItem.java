package edu.cit.ycoy.orderflow.transaction;

import edu.cit.ycoy.orderflow.menu.FoodItem;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ERD MATCH: order_id
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // ERD MATCH: product_id
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private FoodItem foodItem;

    // ERD MATCH: product_name
    @Column(name = "product_name", nullable = false)
    private String productName;

    // ERD MATCH: quantity
    @Column(nullable = false)
    private Integer quantity;

    // ERD MATCH: price (decimal)
    @Column(nullable = false)
    private BigDecimal price;

    public OrderItem() {}

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public FoodItem getFoodItem() { return foodItem; }
    public void setFoodItem(FoodItem foodItem) { this.foodItem = foodItem; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}