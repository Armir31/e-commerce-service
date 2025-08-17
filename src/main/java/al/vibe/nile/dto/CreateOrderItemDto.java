package al.vibe.nile.dto;

import lombok.Data;

@Data
public class CreateOrderItemDto {
    private Long productId;
    private Integer qunatity;
}
