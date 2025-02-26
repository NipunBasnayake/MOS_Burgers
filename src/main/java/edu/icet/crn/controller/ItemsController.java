package edu.icet.crn.controller;

import edu.icet.crn.dto.Item;
import edu.icet.crn.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/item")
@RequiredArgsConstructor
@CrossOrigin
public class ItemsController {

    final ItemService itemService;

    @PostMapping("/add")
    public void add(@RequestBody Item item) {
        itemService.add(item);
    }

    @PostMapping("/addItems")
    public void addItem(@RequestBody List<Item> itemList) {
        itemService.addItems(itemList);
    }

    @GetMapping("/all")
    public List<Item> getAll() {
        return itemService.getAll();
    }

    @PutMapping("/update")
    public void update(@RequestBody Item item) {
        itemService.update(item);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) {
        itemService.delete(id);
    }

    @GetMapping("/searchById/{id}")
    public Item findById(@PathVariable Integer id) {
        return itemService.findById(id);
    }


}
