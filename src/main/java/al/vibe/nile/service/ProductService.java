package al.vibe.nile.service;

import al.vibe.nile.entity.Product;
import al.vibe.nile.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class ProductService {
    public static final Logger log = LoggerFactory.getLogger(ProductService.class);

    private ProductRepository repository;

    public ProductService(ProductRepository productRepository) {
        this.repository = productRepository;
    }
    @Transactional
    public Set<Product> getList(){
        return Set.copyOf(repository.findAll());
    }
    @Transactional
    public Product create(Product product) {
        return repository.saveAndFlush(product);
    }
    @Transactional
    public void delete(Long id){
        repository.deleteById(id);
    }
    @Transactional
    public Product update(Product product){
        return repository.saveAndFlush(product);
    }
    public Product getById(Long id){
        return repository
                .findById(id)
                .orElseThrow(
                        ()->new RuntimeException
                                ("Product" + id + "not found"));
    }
}
