package al.vibe.nile.dto;

import lombok.Data;

@Data
public class ProductDto {
    private String name;
    private String description;
    private String image;
    private String price;
    private Integer quantity;
}
