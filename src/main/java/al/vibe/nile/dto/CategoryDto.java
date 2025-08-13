package al.vibe.nile.dto;

import al.vibe.nile.entity.Product;
import lombok.Data;

@Data
public class CategoryDto {
    private String name;
    private String description;
    private Product product;
}
