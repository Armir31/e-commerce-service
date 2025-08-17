package al.vibe.nile.service;

import al.vibe.nile.dto.CreateCategoryDto;
import al.vibe.nile.entity.Category;
import al.vibe.nile.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    public static final Logger log = LoggerFactory.getLogger(CategoryService.class);
    @Autowired
    private CategoryRepository repository;

    private ModelMapper modelMapper = new ModelMapper();

    public CategoryService(CategoryRepository categoryRepository){
        this.repository = categoryRepository;
    }
    public List<Category> getList(){
        return(repository.findAll());
    }
    public void create(CreateCategoryDto createCategoryDto){
        Category category = modelMapper.map(createCategoryDto, Category.class);
        repository.save(category);
    }
    public void delete(Long id){
        repository.deleteById(id);
    }
    public void update(Long id, CreateCategoryDto updateCategoryDto){
        Category existingCategory = getById(id);
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.map(updateCategoryDto, existingCategory);
        repository.saveAndFlush(existingCategory);

    }
    public Category getById(Long id){
        return repository
                .findById(id)
                .orElseThrow(
                        ()->new EntityNotFoundException
                                ("Category " + id + " not found"));
    }
}
