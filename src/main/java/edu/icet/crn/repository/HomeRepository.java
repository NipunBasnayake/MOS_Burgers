package edu.icet.crn.repository;

import edu.icet.crn.entity.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HomeRepository extends JpaRepository<ItemEntity, Integer> {
}
