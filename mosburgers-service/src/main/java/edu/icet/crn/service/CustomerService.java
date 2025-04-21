package edu.icet.crn.service;

import edu.icet.crn.dto.Customer;

import java.util.List;

public interface CustomerService {
    void addCustomer(Customer customer);

    List<Customer> getAll();

    void update(Customer customer);

    void delete(Integer id);
}
