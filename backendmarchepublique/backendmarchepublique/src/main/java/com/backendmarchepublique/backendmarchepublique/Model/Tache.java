package com.backendmarchepublique.backendmarchepublique.Model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tache")
public class Tache {

   

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private int numero;
    private int duree;
    private String datefinale;
    private String etat;
    
    // AJOUTEZ CE CHAMP MANQUANT
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ElementCollection
    @CollectionTable(name = "tache_commentaires", joinColumns = @JoinColumn(name = "tache_id"))
    @Column(name = "commentaire")
    private List<String> commentaires = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "tache_validateurs", joinColumns = @JoinColumn(name = "tache_id"))
    @Column(name = "validateur_name")
    private List<String> validatedByEmployeNames = new ArrayList<>();


    @ManyToOne
    @JoinColumn(name = "cahier_de_charges_id")
    @JsonIgnore
    private CahierDeCharges cahierDeCharges;
    
    // Constructeurs
    public Tache() {}
    
    // Modifiez le constructeur
    public Tache(int numero, int duree, String datefinale, String etat, String description) {
        this.numero = numero;
        this.duree = duree;
        this.datefinale = datefinale;
        this.etat = etat;
        this.description = description;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public int getNumero() {
        return numero;
    }
    
    public void setNumero(int numero) {
        this.numero = numero;
    }
    
    public int getDuree() {
        return duree;
    }
    
    public void setDuree(int duree) {
        this.duree = duree;
    }
    
    public String getDatefinale() {
        return datefinale;
    }
    
   public void setDateFinale(String dateFinale) {
    this.datefinale = dateFinale;
}

public void setDatefinale(String datefinale) {
    this.datefinale = datefinale;
}
    
    public String getEtat() {
        return etat;
    }
    
    public void setEtat(String etat) {
        this.etat = etat;
    }
    
    // AJOUTEZ LE GETTER ET SETTER POUR DESCRIPTION
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<String> getCommentaires() {
        return commentaires;
    }
    
    public void setCommentaires(List<String> commentaires) {
        this.commentaires = commentaires;
    }
    
    public CahierDeCharges getCahierDeCharges() {
        return cahierDeCharges;
    }
    
    public void setCahierDeCharges(CahierDeCharges cahierDeCharges) {
        this.cahierDeCharges = cahierDeCharges;
    }
    
    // Méthodes utilitaires pour gérer les commentaires
    public void ajouterCommentaire(String commentaire) {
        this.commentaires.add(commentaire);
    }
    
    public void supprimerCommentaire(int index) {
        if (index >= 0 && index < commentaires.size()) {
            this.commentaires.remove(index);
        }
    }
    private boolean valide = false;
    
    
    public boolean isValide() {
        return valide;
    }
    
    public void setValide(boolean valide) {
        this.valide = valide;
    }

    public List<String> getValidatedByEmployeNames() {
        return validatedByEmployeNames;
    }

    public void setValidatedByEmployeNames(List<String> validatedByEmployeNames) {
        this.validatedByEmployeNames = validatedByEmployeNames;
    }
}
