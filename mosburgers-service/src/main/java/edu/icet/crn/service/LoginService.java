package edu.icet.crn.service;

import edu.icet.crn.dto.User;

public interface LoginService {
    boolean signUp(User user);
    User logIn(String email, String password);
}
