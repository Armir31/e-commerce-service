package al.vibe.nile.service;

import al.vibe.nile.entity.Payment;
import al.vibe.nile.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class PaymentService {
    public static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private PaymentRepository repository;

    public PaymentService(PaymentRepository paymentRepository){
        this.repository = paymentRepository;
    }
    public Set<Payment> getList(){
        return Set.copyOf(repository.findAll());
    }
    public Payment create(Payment payment){
        return repository.saveAndFlush(payment);
    }
    public void delete(Long id){
        repository.deleteById(id);
    }
    public Payment update(Payment payment){
        return repository.saveAndFlush(payment);
    }
    public Payment getById(Long id){
        return repository
                .findById(id)
                .orElseThrow(
                        ()->new RuntimeException
                                ("Payment" + id + "not found"));
    }
}