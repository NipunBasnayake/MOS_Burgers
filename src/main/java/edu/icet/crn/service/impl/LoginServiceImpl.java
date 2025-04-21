package edu.icet.crn.service.impl;

import edu.icet.crn.dto.User;
import edu.icet.crn.entity.UserEntity;
import edu.icet.crn.repository.LoginRepository;
import edu.icet.crn.service.LoginService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

    final LoginRepository loginRepository;
    final ModelMapper modelMapper;

    @Override
    public boolean signUp(User user) {
        if (loginRepository.existsById(user.getId())) {
            return false;
        }
        UserEntity userEntity = loginRepository.save(modelMapper.map(user, UserEntity.class));
        return loginRepository.existsById(userEntity.getId());
    }

    @Override
    public User logIn(String email, String password) {
        UserEntity user = loginRepository.findByEmail(email);
        assert user != null;
        if (user.getPassword().equals(password)) {
            User mapped = modelMapper.map(user, User.class);
            mapped.setPassword("xxxxxxxx");
            return mapped;
        }
        return null;
    }
}