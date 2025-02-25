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

    @PostMapping("/add")
    public void add(@RequestBody Item item) {
        homeService.add(item);
    }

    @PostMapping("/addItems")
    public void addItem(@RequestBody List<Item> itemList) {
        homeService.addItems(itemList);
    }

    @GetMapping("/all")
    public List<Item> getAll() {
        return homeService.getAll();
    }
}
