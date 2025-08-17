package al.vibe.nile.controller;

import al.vibe.nile.dto.CreatePaymentDto;
import al.vibe.nile.dto.PaymentDto;
import al.vibe.nile.entity.Payment;
import al.vibe.nile.service.PaymentService;
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
@RequestMapping("/payment")
public class PaymentController {
    public static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    private ModelMapper modelMapper = new ModelMapper();

    @PostMapping
    public ResponseEntity<PaymentDto> createPayment(@RequestBody CreatePaymentDto createPaymentDto){
        log.info("Creating payment...");
        Payment payment = this.paymentService.create(createPaymentDto);
        return new ResponseEntity<>(modelMapper.map(payment, PaymentDto.class), HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Payment>> getList(){
        return ResponseEntity.ok(paymentService.getList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> getById(@PathVariable Long id){
        Payment payment = paymentService.getById(id);
        return new ResponseEntity<>(modelMapper.map(payment, PaymentDto.class), HttpStatus.OK);
    }
    @PatchMapping("/{id}")
    public ResponseEntity<PaymentDto> updatePayment(@PathVariable Long id, @RequestBody CreatePaymentDto updatePaymentDto){
        Payment saved = paymentService.update(id, updatePaymentDto);
        return new ResponseEntity<>(modelMapper.map(saved, PaymentDto.class), HttpStatus.OK);
    }
    @DeleteMapping
    public ResponseEntity<Void> delete(@PathVariable Long id){
        log.warn("Deleting payment with id: " + id);
        paymentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
