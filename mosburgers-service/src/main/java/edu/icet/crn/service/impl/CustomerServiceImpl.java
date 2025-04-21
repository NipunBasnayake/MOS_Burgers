package edu.icet.crn.service.impl;

import edu.icet.crn.dto.Customer;
import edu.icet.crn.entity.CustomerEntity;
import edu.icet.crn.repository.CustomerRepository;
import edu.icet.crn.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    final CustomerRepository customerRepository;
    final ModelMapper modelMapper;

    @Override
    public void addCustomer(Customer customer) {
        customerRepository.save(modelMapper.map(customer, CustomerEntity.class));
    }

    @Override
    public List<Customer> getAll() {
        List<CustomerEntity> customerEntities = customerRepository.findAll();
        List<Customer> customers = new ArrayList<>();
        customerEntities.forEach(customerEntity -> customers.add(modelMapper.map(customerEntity, Customer.class)));
        return customers;
    }

    @Override
    public void update(Customer customer) {
        customerRepository.save(modelMapper.map(customer, CustomerEntity.class));
    }

    @Override
    public void delete(Integer id) {
        customerRepository.deleteById(id);
    }
}
