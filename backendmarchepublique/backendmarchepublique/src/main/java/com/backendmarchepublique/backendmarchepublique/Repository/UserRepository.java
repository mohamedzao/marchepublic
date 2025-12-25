package com.backendmarchepublique.backendmarchepublique.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.backendmarchepublique.backendmarchepublique.Model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    
    public User findByEmailAndPassword(String email, String password);

    public User findByEmail(String email);

    public Long countBy();

}
