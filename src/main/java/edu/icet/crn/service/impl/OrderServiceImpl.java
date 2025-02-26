package edu.icet.crn.service.impl;

import edu.icet.crn.dto.Order;
import edu.icet.crn.dto.OrderDetail;
import edu.icet.crn.entity.ItemEntity;
import edu.icet.crn.entity.OrderDetailEntity;
import edu.icet.crn.entity.OrderEntity;
import edu.icet.crn.repository.ItemRepository;
import edu.icet.crn.repository.OrderDetailRepository;
import edu.icet.crn.repository.OrderRepository;
import edu.icet.crn.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ItemRepository itemRepository;
    private final ModelMapper modelMapper;

    @Override
    public void addOrder(Order order) {
        OrderEntity orderEntity = modelMapper.map(order, OrderEntity.class);
        orderRepository.save(orderEntity);

        for (OrderDetail orderDetail : order.getDetails()) {
            OrderDetailEntity orderDetailEntity = modelMapper.map(orderDetail, OrderDetailEntity.class);

            ItemEntity itemEntity = itemRepository.findById(orderDetail.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + orderDetail.getItemId()));

            itemEntity.reduceStock(orderDetail.getQuantity());
            itemRepository.save(itemEntity);

            orderDetailEntity.setOrder(orderEntity);
            orderDetailEntity.setItem(itemEntity);

            orderDetailRepository.save(orderDetailEntity);
        }
    }

    @Override
    public Integer getLastOrderId() {
        List<OrderEntity> orderEntities = orderRepository.findAll();
        if (orderEntities.isEmpty()) {
            return 0;
        }
        int lastOrderId = 0;
        for (OrderEntity order : orderEntities) {
            if (order.getId() > lastOrderId) {
                lastOrderId = order.getId();
            }
        }
        return lastOrderId;
    }

    @Override
    public List<Order> getAll() {
        List<OrderEntity> orderEntities = orderRepository.findAll();
        List<OrderDetailEntity> orderDetailEntities = orderDetailRepository.findAll();

        List<Order> orders = new ArrayList<>();

        for (OrderEntity order : orderEntities) {

            Order newOrder = modelMapper.map(order, Order.class);

            for (OrderDetailEntity orderDetail : orderDetailEntities) {
                if (order.getId() == orderDetail.getId()) {
                    newOrder.getDetails().add(modelMapper.map(orderDetail, OrderDetail.class));
                }
            }
            orders.add(newOrder);
        }
        return orders;
    }


}

