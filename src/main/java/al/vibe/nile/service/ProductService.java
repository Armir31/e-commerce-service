package al.vibe.nile.service;

import al.vibe.nile.dto.CreateProductDto;
import al.vibe.nile.entity.Business;
import al.vibe.nile.entity.Category;
import al.vibe.nile.entity.Product;
import al.vibe.nile.repository.BusinessRepository;
import al.vibe.nile.repository.CategoryRepository;
import al.vibe.nile.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    public static final Logger log = LoggerFactory.getLogger(ProductService.class);
    @Autowired
    private ProductRepository repository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BusinessRepository businessRepository;

    private ModelMapper modelMapper = new ModelMapper();

    public ProductService() {
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
    }

    public List<Product> getList(){
        return(repository.findAll());
    }

    public Product create(CreateProductDto createProductDto) {
            Product product = modelMapper.map(createProductDto, Product.class);
            product.setId(null);
            product.setCategory(new Category(createProductDto.getCategoryId()));
        Business business = businessRepository.findById(createProductDto.getBusinessId())
                .orElseThrow(() -> new RuntimeException("Business not found"));
        product.setBusiness(business);
            return repository.save(product);
    }

    public void delete(Long id){
        repository.deleteById(id);
    }

    public Product update(Long id, CreateProductDto updateProductDto){
        Product existingProduct = getById(id);
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.map(updateProductDto, existingProduct);
        if (updateProductDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(updateProductDto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            existingProduct.setCategory(category);
        }
        existingProduct.setId(id);
        return repository.save(existingProduct);
    }
    public Product getById(Long id){
        return repository
                .findById(id)
                .orElseThrow(
                        ()->new EntityNotFoundException
                                ("Product" + id + "not found"));
    }
}
