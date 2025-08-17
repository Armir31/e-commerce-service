package al.vibe.nile.controller;

import al.vibe.nile.dto.BusinessDto;
import al.vibe.nile.dto.CreateBusinessDto;
import al.vibe.nile.entity.Business;
import al.vibe.nile.service.BusinessService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/business")
public class BusinessController {

public static final Logger log = LoggerFactory.getLogger(BusinessController.class);

@Autowired
private BusinessService businessService;

    private ModelMapper modelMapper = new ModelMapper();

    @PostMapping
    public ResponseEntity<BusinessDto> createBusiness(
            @RequestBody CreateBusinessDto createBusinessDto) {
        log.info("Creating costumer");
        Business business = this.businessService.create(createBusinessDto);
        return new ResponseEntity<>(modelMapper.map(business, BusinessDto.class), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Business>> getList(){
         return ResponseEntity.ok(businessService.getList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<BusinessDto> getById(@PathVariable Long id){
        Business business = businessService.getById(id);
        return new ResponseEntity<>(modelMapper.map(business, BusinessDto.class), HttpStatus.OK);
    }
    @PatchMapping("/{id}")
    public ResponseEntity<BusinessDto> update(@PathVariable Long id,
                                           @RequestBody CreateBusinessDto updateBusinessDto){
    Business saved = businessService.update(id, updateBusinessDto);
    return new ResponseEntity<>(modelMapper.map(saved, BusinessDto.class), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        log.warn("Deleting business with id: " + id);
        businessService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
