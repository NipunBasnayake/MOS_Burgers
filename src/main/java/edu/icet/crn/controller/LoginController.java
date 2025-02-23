package edu.icet.crn.controller;

import edu.icet.crn.dto.User;
import edu.icet.crn.service.LoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin
public class LoginController {

    final LoginService loginService;

    @PostMapping("/signup")
    public void signUp(@RequestBody User user) {
        loginService.signUp(user);
    }

    @PostMapping("/login")
    public boolean login(@RequestBody User user) {
        return loginService.logIn(user.getEmail(), user.getPassword());
    }
}
