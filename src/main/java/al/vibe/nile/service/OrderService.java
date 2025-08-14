package al.vibe.nile.service;

import al.vibe.nile.entity.Order;
import al.vibe.nile.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class OrderService {
    public static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private OrderRepository repository;

    public OrderService(OrderRepository orderRepository){
        this.repository = orderRepository;
    }

    public Order getById(Long id){
        return repository
                .findById(id)
                .orElseThrow(
                        ()->new RuntimeException
                                ("Order" + id + "not found"));

    }
    public Order create(Order order){
        return repository.saveAndFlush(order);
    }

    public Set<Order> getList(){
        return Set.copyOf(repository.findAll());
    }

    public void delete(Long id){
        repository.deleteById(id);
    }

    public Order update(Order order){
        return repository.saveAndFlush(order);
    }
}