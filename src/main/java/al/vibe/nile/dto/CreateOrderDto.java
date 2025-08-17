package al.vibe.nile.dto;

import al.vibe.nile.entity.Costumer;
import al.vibe.nile.entity.OrderStatus;
import al.vibe.nile.entity.Payment;
import al.vibe.nile.entity.Product;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
@Data
public class CreateOrderDto {
    private Long costumerId;
    private List<CreateOrderItemDto> orderItems;
}
