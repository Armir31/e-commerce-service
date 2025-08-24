package al.vibe.nile.controller;

import al.vibe.nile.dto.CategoryDto;
import al.vibe.nile.dto.CreateCategoryDto;
import al.vibe.nile.entity.Category;
import al.vibe.nile.service.CategoryService;
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
@RequestMapping("/api/category")
public class CategoryController {
    public static final Logger log = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    private CategoryService categoryService;

    private ModelMapper modelMapper = new ModelMapper();

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CreateCategoryDto createCategoryDto){
        log.info("Creating category...");
        Category category = this.categoryService.create(createCategoryDto);
        return new ResponseEntity<>(modelMapper.map(category, CategoryDto.class), HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Category>> getList(){
        return ResponseEntity.ok(categoryService.getList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getById(@PathVariable Long id){
        Category category = categoryService.getById(id);
        return new ResponseEntity<>(modelMapper.map(category, CategoryDto.class), HttpStatus.OK);
    }
    @PatchMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id,
                                                      @RequestBody CreateCategoryDto updateCategoryDto){
        Category saved = categoryService.update(id, updateCategoryDto);
        return new ResponseEntity<>(modelMapper.map(saved, CategoryDto.class), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        log.warn("Deleting category with id: " + id);
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
