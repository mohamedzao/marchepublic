package com.backendmarchepublique.backendmarchepublique.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id; 
    
    @Column(nullable = false)
    public String prenom;
    
    @Column(nullable = false)
    public String nom;
    
    @Column(nullable = false, unique = true)
    public String email;
    
    @Column(nullable = false)
    public String password;
    
    @Column(nullable = false)
    public String role;
    
    @Column(name = "employe_service") // Si le nom de colonne est différent en base
    public String employeService; 
    
    @Column(name = "chef_service") // Si le nom de colonne est différent en base
    public String chefservice;

    @Column(name = "chef admin") // Si le nom de colonne est différent en base
    public String chefadmin;

    // Vos constructeurs existants
    public User(String prenom, String nom, String email, String password, String role, String employeService, String chefservice , String chefadmin) {
        this.prenom = prenom;
        this.nom = nom;
        this.email = email;
        this.password = password;
        this.role = role;
        this.employeService = employeService;
        this.chefservice = chefservice;
        this.chefadmin = chefadmin;
    }
    
    public User() {
    }

    // Vos getters et setters existants...
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getPrenom() {
        return prenom;
    }
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getEmployeService() {
        return employeService;
    }
    public void setEmployeService(String employeService) {
        this.employeService = employeService;
    }
    public String getChefservice() {
        return chefservice;
    }
    public void setChefservice(String chefservice) {
        this.chefservice = chefservice;
    }
    public String getChefadmin() {
        return chefadmin;
    }
    public void setChefadmin(String chefadmin) {
        this.chefadmin = chefadmin;
    }
  
}