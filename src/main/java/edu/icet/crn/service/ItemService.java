package edu.icet.crn.service;

import edu.icet.crn.dto.Item;

import java.util.List;

public interface ItemService {

    void add(Item item);

    void addItems(List<Item> itemList);

    List<Item> getAll();

    void update(Item item);
}
