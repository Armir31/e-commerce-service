package al.vibe.nile.service;

import al.vibe.nile.entity.Category;
import al.vibe.nile.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class CategoryService {
    public static final Logger log = LoggerFactory.getLogger(CategoryService.class);

    private CategoryRepository repository;

    public CategoryService(CategoryRepository categoryRepository){
        this.repository = categoryRepository;
    }
    public Set<Category> getList(){
        return Set.copyOf(repository.findAll());
    }
    public void create(Category category){
        repository.saveAndFlush(category);
    }
    public void delete(Long id){
        repository.deleteById(id);
    }
    public void update(Category category){
        repository.saveAndFlush(category);
    }
    public Category getById(Long id){
        return repository
                .findById(id)
                .orElseThrow(
                        ()->new RuntimeException
                                ("Category " + id + " not found"));
    }
}
