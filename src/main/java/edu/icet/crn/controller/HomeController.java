package edu.icet.crn.controller;

import edu.icet.crn.dto.Item;
import edu.icet.crn.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
@CrossOrigin
public class HomeController {

    final HomeService homeService;


}
