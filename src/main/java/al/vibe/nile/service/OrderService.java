package al.vibe.nile.service;

import al.vibe.nile.dto.CreateOrderDto;
import al.vibe.nile.dto.CreateOrderItemDto;
import al.vibe.nile.entity.Costumer;
import al.vibe.nile.entity.Order;
import al.vibe.nile.entity.OrderItem;
import al.vibe.nile.entity.OrderStatus;
import al.vibe.nile.entity.Product;
import al.vibe.nile.repository.OrderItemRepository;
import al.vibe.nile.repository.OrderRepository;
import al.vibe.nile.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {
    public static final Logger log = LoggerFactory.getLogger(OrderService.class);
    @Autowired
    private OrderRepository repository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

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
        Order order = new Order();
        order.setCostumer(new Costumer(createOrderDto.getCostumerId()));
        order.setTotalAmount(0D);
        order.setOrderStatus(OrderStatus.PROCESSING);
        Order savedOrder = repository.save(order);
        Set<Long> ids = createOrderDto.getOrderItems().stream()
                .map(orderItemDto -> orderItemDto.getProductId())
                .collect(Collectors.toSet());

        List<Product> products = this.productRepository.findAllById(ids);

        Map<Long, Double> priceMap = new HashMap<>();

        products.stream().forEach(product -> {
            priceMap.put(product.getId(), product.getPrice());
        });

        Double total = 0D;

        for (CreateOrderItemDto orderItemDto: createOrderDto.getOrderItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(orderItemDto.getProductId());
            orderItem.setPrice(priceMap.get(orderItemDto.getProductId()));
            orderItem.setSubTotal(orderItem.getPrice() * orderItemDto.getQunatity());
            orderItem.setQuantity(orderItemDto.getQunatity());
            orderItem.setOrder(savedOrder);
            total+=orderItem.getSubTotal();
            orderItemRepository.save(orderItem);
        }
        savedOrder.setTotalAmount(total);
        return repository.save(savedOrder);
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
        return repository.save(existingOrder);
    }
}