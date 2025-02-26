package edu.icet.crn.controller;

import edu.icet.crn.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orderDetail")
@RequiredArgsConstructor
@CrossOrigin
public class OrderDetailController {

    final OrderDetailService orderDetailService;
}
