package al.vibe.nile.service;

import al.vibe.nile.dto.CreateBusinessDto;
import al.vibe.nile.entity.Business;
import al.vibe.nile.repository.BusinessRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;

import java.util.List;

@Service
public class BusinessService {
    public static final Logger log = LoggerFactory.getLogger(BusinessService.class);

    @Autowired
    private BusinessRepository repository;

    private ModelMapper modelMapper = new ModelMapper();

    public BusinessService(BusinessRepository businessRepository) {
        this.repository = businessRepository;
    }

    public List<Business> getList(){
        return repository.findAll();
    }
    public Business create(CreateBusinessDto createBusinessDto){
        Business business = modelMapper.map(createBusinessDto, Business.class);
       return repository.save(business);
    }
    public void delete(Long id){
        repository.deleteById(id);
    }
    public Business update(Long id, CreateBusinessDto updateBusinessDto){
        Business existingBusiness = getById(id);
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.map(updateBusinessDto, existingBusiness);
        return repository.save(existingBusiness);
    }
    public Business getById(Long id){
        return repository
                .findById(id)
                .orElseThrow(
                        ()-> new EntityNotFoundException
                                ("Business " + id + " not found"));
    }
}
