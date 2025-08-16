package al.vibe.nile.controller;

import al.vibe.nile.entity.Costumer;
import al.vibe.nile.service.CostumerService;
import jakarta.persistence.EntityNotFoundException;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Set;

@RestController
@RequestMapping("/costumer")
public class CostumerController {
    public static final Logger log = LoggerFactory.getLogger(CostumerController.class);

    @Autowired
    private CostumerService costumerService;

    @PostMapping
    public ResponseEntity<Costumer> createCostumer(Costumer costumer) {
        try{
            Costumer createdCostumer = costumerService.create(costumer);
            Long id = createdCostumer.getId();
            URI costumerUri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(id)
                    .toUri();
            return ResponseEntity.created(costumerUri)
                    .build();
        }catch (RuntimeException e){
            return ResponseEntity.internalServerError()
                    .build();
        }
    }
    @GetMapping
    public ResponseEntity<Set<Costumer>> getList(){
        return ResponseEntity.ok(costumerService.getList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id){
        try{
            return ResponseEntity.ok(costumerService.getById(id));
        }catch (EntityNotFoundException e) {
            return ResponseEntity.notFound()
                    .build();
        }catch (RuntimeException e){
            return ResponseEntity.internalServerError()
                    .build();
        }
    }
    @PatchMapping("/{id}")
    public ResponseEntity<Costumer> update (@PathVariable Long id,
                                            @RequestBody Costumer costumer){
        Costumer saved = costumerService.update(costumer);
        return new ResponseEntity<>(saved,HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        log.warn("Deleting costumer with id: " + id);
        costumerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}