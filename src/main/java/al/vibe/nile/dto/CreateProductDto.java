package al.vibe.nile.dto;

import lombok.Data;

@Data
public class CreateProductDto {
    private String name;
    private String description;
    private String image;
    private String price;
    private Integer quantity;
    private Long categoryId;
}
