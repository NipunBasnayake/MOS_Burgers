package edu.icet.crn.repository;

import edu.icet.crn.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginRepository extends JpaRepository<UserEntity, Integer> {
    UserEntity findByEmail(String email);
}
