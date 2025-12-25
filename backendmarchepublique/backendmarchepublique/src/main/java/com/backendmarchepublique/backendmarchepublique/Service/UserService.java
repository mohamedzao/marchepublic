package com.backendmarchepublique.backendmarchepublique.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backendmarchepublique.backendmarchepublique.Model.User;
import com.backendmarchepublique.backendmarchepublique.Repository.UserRepository;


@Service
public class UserService {
    
   @Autowired
   public UserRepository userRepository;

   public void saveUser(User user){
         userRepository.save(user);
   }

   public User loginUser(String email, String password){
       return userRepository.findByEmailAndPassword(email, password);
   }

   public User getUserByEmail(String email) {
       return userRepository.findByEmail(email);
   }
   public long getUsersCount() {
         return userRepository.countBy();
}
public List<User> getlistusers() {
    return userRepository.findAll();
}

}
