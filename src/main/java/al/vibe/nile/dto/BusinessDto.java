package al.vibe.nile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BusinessDto {
    private String name;
    private String email;
    private String username;
    @JsonProperty("phone_number")
    private String phoneNumber;
    private String address;
    private String logo;
    private String website;
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

}
