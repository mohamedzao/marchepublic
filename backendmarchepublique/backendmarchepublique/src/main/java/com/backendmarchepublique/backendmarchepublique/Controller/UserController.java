package com.backendmarchepublique.backendmarchepublique.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backendmarchepublique.backendmarchepublique.Model.User;
import com.backendmarchepublique.backendmarchepublique.Service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

@Autowired
public UserService userService;

@PostMapping("/register")
public void registerUser(@RequestBody User user) {
     userService.saveUser(user);
}
@PostMapping("/login")
public User loginUser(@RequestBody User user) {
    return userService.loginUser(user.getEmail(), user.getPassword());
}

@PostMapping("/getbyemail")
public User getUserByEmail(@RequestBody String email) {
     return userService.getUserByEmail(email);
}
@GetMapping("/userscount")
public Number getuserscount(){
     return userService.getUsersCount(); 

}

@GetMapping("/getlistusers")
public List<User> getlistusers(){
     return userService.getlistusers();
}



}