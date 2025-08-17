package al.vibe.nile.service;

import al.vibe.nile.dto.CreateOrderDto;
import al.vibe.nile.entity.Order;
import al.vibe.nile.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    public static final Logger log = LoggerFactory.getLogger(OrderService.class);
    @Autowired
    private OrderRepository repository;

    private ModelMapper modelMapper = new ModelMapper();

    public OrderService(OrderRepository orderRepository){
        this.repository = orderRepository;
    }

    public Order getById(Long id){
        return repository
                .findById(id)
                .orElseThrow(
                        ()->new EntityNotFoundException
                                ("Order" + id + "not found"));

    }
    public Order create(CreateOrderDto createOrderDto){
        Order order = modelMapper.map(createOrderDto, Order.class);
        return repository.save(order);
    }

    public List<Order> getList(){
        return(repository.findAll());
    }

    public void delete(Long id){
        repository.deleteById(id);
    }

    public Order update(Long id, CreateOrderDto updateOrderDto){
        Order existingOrder = getById(id);
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.map(updateOrderDto, existingOrder);
        return repository.saveAndFlush(existingOrder);
    }
}