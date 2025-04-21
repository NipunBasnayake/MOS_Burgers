package edu.icet.crn.service;

import edu.icet.crn.dto.Order;

import java.util.List;

public interface OrderService {

    void addOrder(Order order);

    Integer getLastOrderId();

    List<Order> getAll();
}
