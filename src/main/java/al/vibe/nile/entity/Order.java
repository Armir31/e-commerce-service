package al.vibe.nile.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jdk.jfr.Timestamp;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;
    @Timestamp
    @Column(name = "order_date", nullable = false, updatable = false)
    private LocalDateTime orderDate;
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    private OrderStatus orderStatus;
    @Column(name = "total_amount", nullable = false)
    private Integer totalAmount;
    @ManyToOne
    @JoinColumn(name = "payment_method", nullable = false)
    private Payment paymentMethod;
    @OneToMany
    @JoinColumn(name = "order", nullable = false)
    private List<Product> items = new ArrayList<>();
    @ManyToOne
    @JoinColumn(name = "costumer", nullable = false)
    private Costumer costumer;
}
