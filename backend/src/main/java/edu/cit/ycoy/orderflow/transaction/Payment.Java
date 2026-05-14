package edu.cit.ycoy.orderflow.transaction;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ERD MATCH: order_id
    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // ERD MATCH: stripe_payment_id
    @Column(name = "stripe_payment_id")
    private String stripePaymentId;

    // ERD MATCH: amount (decimal)
    @Column(nullable = false)
    private BigDecimal amount;

    // ERD MATCH: status
    @Column(nullable = false)
    private String status = "SUCCESS";

    // ERD MATCH: created_at
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Payment() {}

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public String getStripePaymentId() { return stripePaymentId; }
    public void setStripePaymentId(String stripePaymentId) { this.stripePaymentId = stripePaymentId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}