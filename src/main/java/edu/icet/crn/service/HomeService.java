package edu.icet.crn.service;

import edu.icet.crn.dto.Item;

import java.util.List;

public interface HomeService {

    void add(Item item);

    void addItems(List<Item> itemList);

    List<Item> getAll();
}
