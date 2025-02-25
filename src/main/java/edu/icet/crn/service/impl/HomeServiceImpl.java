package edu.icet.crn.service.impl;

import edu.icet.crn.dto.Item;
import edu.icet.crn.entity.ItemEntity;
import edu.icet.crn.repository.HomeRepository;
import edu.icet.crn.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    final HomeRepository homeRepository;
    final ModelMapper modelMapper;

    @Override
    public void add(Item item) {
        homeRepository.save(modelMapper.map(item, ItemEntity.class));
    }

    @Override
    public void addItems(List<Item> itemList) {
        for (Item item : itemList) {
            homeRepository.save(modelMapper.map(item, ItemEntity.class));
        }
    }

    @Override
    public List<Item> getAll() {
        List<ItemEntity> itemEntities = homeRepository.findAll();
        List<Item> itemList = new ArrayList<>();
        itemEntities.forEach(itemEntity -> itemList.add(modelMapper.map(itemEntity, Item.class)));
        return itemList;
    }

}
