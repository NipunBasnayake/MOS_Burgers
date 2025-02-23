package edu.icet.crn.repository;

import edu.icet.crn.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoginRepository extends JpaRepository<UserEntity, Integer> {
    List<UserEntity> findByEmail(String email);
}
