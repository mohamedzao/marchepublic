
package com.backendmarchepublique.backendmarchepublique.Model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "cahier_de_charges")
public class CahierDeCharges {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String descriptionetatactuel;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String objectif;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String materiels;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String licences;
    
    private int dureeprojet;
    private double budget;
    
    private String chefService ; 
    private String employeService;
    
    private String nomFichier;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String contenuFichier;
    
    private Long employeId;
    private String employeName;
    
   @OneToMany(mappedBy = "cahierDeCharges", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Tache> taches = new ArrayList<>();
    
    // Constructeurs, getters et setters restent les mêmes...
    public CahierDeCharges() {}
    
   public CahierDeCharges(String descriptionetatactuel, String objectif, String materiels, String licences, 
                      int dureeprojet, double budget, String nomFichier, String contenuFichier, 
                      Long employeId, String employeName, List<Tache> taches , String employeService) {
    this.descriptionetatactuel = descriptionetatactuel;
    this.objectif = objectif;
    this.materiels = materiels;
    this.licences = licences;
    this.dureeprojet = dureeprojet;
    this.budget = budget;
    this.nomFichier = nomFichier;
    this.contenuFichier = contenuFichier;
    this.employeId = employeId;
    this.employeName = employeName;
    this.taches = taches != null ? taches : new ArrayList<>();
    this.employeService = employeService;
    // LIER les tâches au cahier de charges
    if (this.taches != null) {
        for (Tache tache : this.taches) {
            tache.setCahierDeCharges(this);
        }
    }
}
     public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getDescriptionetatactuel() {
        return descriptionetatactuel;
    }
    public void setDescriptionetatactuel(String descriptionetatactuel) {
        this.descriptionetatactuel = descriptionetatactuel;
    }
    public String getObjectif() {
        return objectif;
    }
    public void setObjectif(String objectif) {
        this.objectif = objectif;
    }
    public String getMateriels() {
        return materiels;
    }
    public void setMateriels(String materiels) {
        this.materiels = materiels;
    }
    public String getLicences() {
        return licences;
    }
    public void setLicences(String licences) {
        this.licences = licences;
    }
    public int getDureeprojet() {
        return dureeprojet;
    }
    public void setDureeprojet(int dureeprojet) {
        this.dureeprojet = dureeprojet;
    }
    public double getBudget() {
        return budget;
    }
    public void setBudget(double budget) {
        this.budget = budget;
    }
    public List<Tache> getTaches() {
        return taches;
    }
    public void setTaches(List<Tache> taches) {
        this.taches = taches;
    }
    
    // Getters et Setters pour les nouveaux champs
    public String getNomFichier() {
        return nomFichier;
    }
    
    public void setNomFichier(String nomFichier) {
        this.nomFichier = nomFichier;
    }
    
    public String getContenuFichier() {
        return contenuFichier;
    }
    
    public void setContenuFichier(String contenuFichier) {
        this.contenuFichier = contenuFichier;
    }
    
    public Long getEmployeId() {
        return employeId;
    }
    
    public void setEmployeId(Long employeId) {
        this.employeId = employeId;
    }
    
    public String getEmployeName() {
        return employeName;
    }
    
    public void setEmployeName(String employeName) {
        this.employeName = employeName;
    }
    
    // Méthode utilitaire pour lier les tâches au cahier de charges
    public void ajouterTache(Tache tache) {
        if (this.taches != null) {
            tache.setCahierDeCharges(this);
            this.taches.add(tache);
        }
    }

    private boolean valide = false;
    public boolean isValide() {
        return valide;
    }
    public void setValide(boolean valide) {
        this.valide = valide;
    }

   private List<String> validatedByEmployeNames = new ArrayList<>();

    public List<String> getValidatedByEmployeName() {
        return validatedByEmployeNames;
    }
    public void setValidatedByEmployeName(List<String> validatedByEmployeNames) {
        this.validatedByEmployeNames = validatedByEmployeNames;
    }

     private Long validatedByEmployeId;
    public Long getValidatedByEmployeId() {
        return validatedByEmployeId;
    }
    public void setValidatedByEmployeId(Long validatedByEmployeId) {
        this.validatedByEmployeId = validatedByEmployeId;
    }

    public Long numberofvalidationsbycahier;
    public Long getNumberofvalidationsbycahier() {
        return numberofvalidationsbycahier;
    }
    public void setNumberofvalidationsbycahier(Long numberofvalidationsbycahier) {
        this.numberofvalidationsbycahier = numberofvalidationsbycahier;

    
    }
    private Long validatedbychefId ;

    public Long getValidatedbychefId() {
        return validatedbychefId;
    }
    public void setValidatedbychefId(Long validatedbychefId) {
        this.validatedbychefId = validatedbychefId;
    }

    private String validatedbychefName ;

    public String getValidatedbychefName() {
        return validatedbychefName;
    }
    public void setValidatedbychefName(String validatedbychefName) {
        this.validatedbychefName = validatedbychefName;
    }
    
    public String getemployeService() {
        return this.employeService;
    }
    public void setemployeService(String employeService) {
        this.employeService = employeService;
    } 


}