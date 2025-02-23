package edu.icet.crn.service.impl;

import edu.icet.crn.dto.User;
import edu.icet.crn.entity.UserEntity;
import edu.icet.crn.repository.LoginRepository;
import edu.icet.crn.service.LoginService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

    final LoginRepository loginRepository;
    final ModelMapper modelMapper;

    @Override
    public void signUp(User user) {
        loginRepository.save(modelMapper.map(user, UserEntity.class));
    }

    @Override
    public boolean logIn(String email, String password) {
        List<UserEntity> byEmail = loginRepository.findByEmail(email);
        for (UserEntity user : byEmail) {
            if (user.getPassword().equals(password)) {
                return true;
            }
        }
        return false;
    }
}
