package edu.icet.crn.service;

import edu.icet.crn.dto.User;

public interface LoginService {
    void signUp(User user);
    boolean logIn(String email, String password);
}
