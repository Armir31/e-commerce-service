package al.vibe.nile.dto;

import al.vibe.nile.entity.PaymentMethod;
import al.vibe.nile.entity.PaymentStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreatePaymentDto {
    private LocalDateTime paymentDate;
    private String amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String transactionId;
    private Long customerId;
}
