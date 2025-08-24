package al.vibe.nile.repository;

import al.vibe.nile.entity.Business;
import al.vibe.nile.entity.Costumer;
import al.vibe.nile.entity.Order;
import al.vibe.nile.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findOrdersByCostumer(Costumer costumer);
    Page<Order> findOrdersByBusiness(Business business, Pageable pageable);
    Page<Order> findOrdersByOrderStatus(OrderStatus orderStatus, Pageable pageable);

//    @Override
      //Page<Order> findAll(Pageable pageable);
}
