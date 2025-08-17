package al.vibe.nile.controller;

import al.vibe.nile.dto.CreateOrderDto;
import al.vibe.nile.dto.OrderDto;
import al.vibe.nile.entity.Order;
import al.vibe.nile.service.OrderService;
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
@RequestMapping("/order")
public class OrderController {
    public static final Logger log = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    private ModelMapper modelMapper = new ModelMapper();

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody CreateOrderDto createOrderDto){
        log.info("Creating order..." );
        Order order = this.orderService.create(createOrderDto);
        return new ResponseEntity<>(modelMapper.map(order, OrderDto.class), HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Order>> getList(){
        return ResponseEntity.ok(orderService.getList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getById(@PathVariable Long id){
        Order order = orderService.getById(id);
        return new ResponseEntity<>(modelMapper.map(order, OrderDto.class), HttpStatus.OK);
    }
    @PatchMapping("/{id}")
    public ResponseEntity<OrderDto> updateOrder(@PathVariable Long id, @RequestBody CreateOrderDto updateOrderDto){
        Order saved = orderService.update(id, updateOrderDto);
        return new ResponseEntity<>(modelMapper.map(saved, OrderDto.class), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        log.warn("Deleting order with id: " + id);
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
