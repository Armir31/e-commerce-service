package al.vibe.nile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CreateBusinessDto {
    private String name;
    private String email;
    private String username;
    @JsonProperty("phone_number")
    private String phoneNumber;
    private String address;
    private String logo;
    private String website;
}
