package edu.icet.crn.service;

import edu.icet.crn.dto.Order;

public interface OrderService {

    void addOrder(Order order);

    Integer getLastOrderId();
}
