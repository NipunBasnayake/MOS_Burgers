package edu.icet.crn.service.impl;

import edu.icet.crn.dto.Item;
import edu.icet.crn.entity.ItemEntity;
import edu.icet.crn.repository.ItemRepository;
import edu.icet.crn.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    final ItemRepository itemRepository;
    final ModelMapper modelMapper;

    @Override
    public void add(Item item) {
        itemRepository.save(modelMapper.map(item, ItemEntity.class));
    }

    @Override
    public void addItems(List<Item> itemList) {
        for (Item item : itemList) {
            itemRepository.save(modelMapper.map(item, ItemEntity.class));
        }
    }

    @Override
    public List<Item> getAll() {
        List<ItemEntity> itemEntities = itemRepository.findAll();
        List<Item> itemList = new ArrayList<>();
        itemEntities.forEach(itemEntity -> itemList.add(modelMapper.map(itemEntity, Item.class)));
        return itemList;
    }

    @Override
    public void update(Item item) {
        itemRepository.save(modelMapper.map(item, ItemEntity.class));
    }
}
