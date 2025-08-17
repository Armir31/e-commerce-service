package al.vibe.nile.controller;

import al.vibe.nile.dto.CostumerDto;
import al.vibe.nile.dto.CreateCostumerDto;
import al.vibe.nile.entity.Costumer;
import al.vibe.nile.service.CostumerService;
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
@RequestMapping("/costumer")
public class CostumerController {
    public static final Logger log = LoggerFactory.getLogger(CostumerController.class);

    @Autowired
    private CostumerService costumerService;

    private ModelMapper modelMapper = new ModelMapper();

    @PostMapping
    public ResponseEntity<CostumerDto> createCostumer(@RequestBody CreateCostumerDto createCostumerDto) {
        log.info("Creating costumer");
        Costumer costumer = this.costumerService.create(createCostumerDto);
        return new ResponseEntity<>(modelMapper.map(costumer, CostumerDto.class), HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Costumer>>getList(){
        return ResponseEntity.ok(costumerService.getList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<CostumerDto> getById(@PathVariable Long id){
        Costumer costumer = costumerService.getById(id);
        return new ResponseEntity<>(modelMapper.map(costumer, CostumerDto.class), HttpStatus.OK);
    }
    @PatchMapping("/{id}")
    public ResponseEntity<CostumerDto> updateCostumer(@PathVariable Long id, @RequestBody CreateCostumerDto updateCostumerDto){
        Costumer saved = costumerService.update(updateCostumerDto, id);
        return new ResponseEntity<>(modelMapper.map(saved, CostumerDto.class), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        log.warn("Deleting costumer with id: " + id);
        costumerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}