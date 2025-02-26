package edu.icet.crn.controller;

import edu.icet.crn.dto.Customer;
import edu.icet.crn.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
@CrossOrigin
public class CustomerController {

    final CustomerService customerService;

    @PostMapping("/add")
    public void addCustomer(@RequestBody Customer customer) {
        customerService.addCustomer(customer);
    }

    @GetMapping("/all")
    public List<Customer> getAllCustomers() {
        return customerService.getAll();
    }

    @PostMapping("/update")
    public void updateCustomer(@RequestBody Customer customer) {
        customerService.update(customer);
    }

    @DeleteMapping("/delete")
    public void deleteCustomer(@RequestBody Integer id) {
        customerService.delete(id);
    }
}
