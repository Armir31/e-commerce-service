package al.vibe.nile.service;

import al.vibe.nile.entity.Business;
import al.vibe.nile.repository.BusinessRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;

import java.util.Set;

@Service
public class BusinessService {
    public static final Logger log = LoggerFactory.getLogger(BusinessService.class);

    private BusinessRepository repository;

    public BusinessService(BusinessRepository businessRepository) {
        this.repository = businessRepository;
    }
    @Transactional
    public Set<Business> getList(){
        return Set.copyOf(repository.findAll());
    }
    @Transactional
    public void create(Business business){
        repository.saveAndFlush(business);
    }
    @Transactional
    public void delete(Long id){
        repository.deleteById(id);
    }
    @Transactional
    public void update(Business business){
        repository.saveAndFlush(business);
    }
    @Transactional
    public Business getById(Long id){
        return repository
                .findById(id)
                .orElseThrow(
                        ()-> new EntityNotFoundException
                                ("Business " + id + " not found"));
    }
}
