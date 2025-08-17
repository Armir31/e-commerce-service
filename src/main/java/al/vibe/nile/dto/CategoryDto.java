package al.vibe.nile.dto;

import al.vibe.nile.entity.Product;
import lombok.Data;

@Data
public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private Product product;
}
