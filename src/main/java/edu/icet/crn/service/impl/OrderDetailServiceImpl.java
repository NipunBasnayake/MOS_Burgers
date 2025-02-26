package edu.icet.crn.service.impl;

import edu.icet.crn.repository.OrderDetailRepository;
import edu.icet.crn.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderDetailServiceImpl implements OrderDetailService {

    final OrderDetailRepository orderDetailRepository;

}
