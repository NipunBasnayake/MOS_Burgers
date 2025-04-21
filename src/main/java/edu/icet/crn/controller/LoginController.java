package edu.icet.crn.controller;

import edu.icet.crn.dto.User;
import edu.icet.crn.service.LoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody User user) {
        System.out.println(user.toString());
        boolean success = loginService.signUp(user);
        if (success) {
            return ResponseEntity.ok("User registered successfully");
        } else {
            return ResponseEntity.badRequest().body("Email already exists");
        }
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return loginService.logIn(user.getEmail(), user.getPassword());
    }
}