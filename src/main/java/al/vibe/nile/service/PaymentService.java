package al.vibe.nile.service;

import al.vibe.nile.dto.CreatePaymentDto;
import al.vibe.nile.entity.Payment;
import al.vibe.nile.repository.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    public static final Logger log = LoggerFactory.getLogger(PaymentService.class);
    @Autowired
    private PaymentRepository repository;

    private ModelMapper modelMapper = new ModelMapper();

    public List<Payment> getList(){
        return (repository.findAll());
    }
    public Payment create(CreatePaymentDto createPaymentDto){
        Payment payment = modelMapper.map(createPaymentDto, Payment.class);
        return repository.save(payment);
    }
    public void delete(Long id){
        repository.deleteById(id);
    }
    public Payment update(Long id, CreatePaymentDto updatePaymentDto ){
        Payment existingPayment = getById(id);
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.map(updatePaymentDto, existingPayment);
        return repository.save(existingPayment);
    }
    public Payment getById(Long id){
        return repository
                .findById(id)
                .orElseThrow(
                        ()->new EntityNotFoundException
                                ("Payment" + id + "not found"));
    }
}