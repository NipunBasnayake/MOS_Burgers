package edu.icet.crn.controller;

import edu.icet.crn.dto.Order;
import edu.icet.crn.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
@CrossOrigin
public class HomeController {

    final OrderService orderService;

    @PostMapping("/addOrder")
    public void addOrder(@RequestBody Order order) {
        orderService.addOrder(order);
    }

}
