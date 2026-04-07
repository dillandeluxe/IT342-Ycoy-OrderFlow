package edu.cit.ycoy.orderflow.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "products") // ERD MATCH: Officially named 'products'
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ERD MATCH: Proper Foreign Key relationship to the USERS table!
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    @JsonIgnoreProperties({"passwordHash", "createdAt"}) // Security: Prevents the seller's password from leaking to the frontend!
    private User seller;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    // ERD MATCH: Added stock
    @Column(nullable = false)
    private Integer stock = 0;

    // ERD MATCH: Added image_url
    @Column(name = "image_url")
    private String imageUrl;

    // ERD MATCH: Added category
    @Column(nullable = false)
    private String category = "Uncategorized";

    @Column(name = "is_available")
    private boolean isAvailable = true;

    // Default Constructor
    public FoodItem() {}

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
}