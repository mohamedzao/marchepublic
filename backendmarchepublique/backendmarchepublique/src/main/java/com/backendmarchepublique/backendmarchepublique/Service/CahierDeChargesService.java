package com.backendmarchepublique.backendmarchepublique.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backendmarchepublique.backendmarchepublique.Model.CahierDeCharges;
import com.backendmarchepublique.backendmarchepublique.Model.Tache;
import com.backendmarchepublique.backendmarchepublique.Repository.CahierDeChargesRepository;

@Service
public class CahierDeChargesService {

   @Autowired
   private CahierDeChargesRepository cahierDeChargesRepository;

    public void saveCahierDeCharges(CahierDeCharges cahierDeCharges) {
           if (cahierDeCharges.getTaches() != null) {
            for (Tache tache : cahierDeCharges.getTaches()) {
                tache.setCahierDeCharges(cahierDeCharges);
            }
        }
        cahierDeChargesRepository.save(cahierDeCharges);
    }

    public List<CahierDeCharges> getCahierDeChargesByEmployeId(Long employeId) {
        return cahierDeChargesRepository.findByEmployeId(employeId);
    }

    public List<CahierDeCharges> getCahiersOfOtherEmployees(Long employeId ) {
        return cahierDeChargesRepository.findByEmployeIdNot(employeId );
    }
    
    public void validateCahierDeCharges(Long cahierId, String employeName, Long employeId, Long numberofusers) {
        CahierDeCharges cahier = cahierDeChargesRepository.findById(cahierId).orElse(null);
        
        if (cahier != null) {
            if (cahier.getValidatedByEmployeId() != null && cahier.getValidatedByEmployeId().equals(employeId)) {
                throw new RuntimeException("Cet employé a déjà validé ce cahier de charges");
            }
            
            if (cahier.getValidatedByEmployeName() == null) {
                cahier.setValidatedByEmployeName(new ArrayList<>());
            }
            
            Long currentValidations = cahier.getNumberofvalidationsbycahier();
            if (currentValidations == null) {
                currentValidations = 0L;
            }

            currentValidations += 1;
            cahier.setNumberofvalidationsbycahier(currentValidations);
            
            // Add the current validator to the list
            if (!cahier.getValidatedByEmployeName().contains(employeName)) {
                cahier.getValidatedByEmployeName().add(employeName);
            }
            
            cahier.setValidatedByEmployeId(employeId);
            
            if (currentValidations >= numberofusers - 1) {
                cahier.setValide(true);
            }
            
            cahierDeChargesRepository.save(cahier);
        }
    }
   
    public void validateCahierDeCharges(Long cahierId , String chefName , Long  chefId   ){
        CahierDeCharges cahier = cahierDeChargesRepository.findById(cahierId).orElse(null);
        if (cahier != null) {
            cahier.setValide(true);
            cahier.setValidatedbychefName(chefName);
            cahier.setValidatedbychefId(chefId);
            cahierDeChargesRepository.save(cahier);
        }
    }

    public Long getNumberOfValidatorsbyCahier(CahierDeCharges cahierDeCharges) {
        return cahierDeChargesRepository.countvalidatorsbycahier(cahierDeCharges);
    }

    public List<CahierDeCharges> getCahiersDeChargesDesAutresEmployes() {
        return cahierDeChargesRepository.findAll();
    }
    
    public List<String> getValidatorsByCahier(Long cahierid){
        return cahierDeChargesRepository.getValidatorsByCahier(cahierid);
    }
    
    public Long getcahiersdechargesnumber(){
        return cahierDeChargesRepository.findnumberofcahiersdecharges();
    }
    public  Long getcahiersdechargesnumberbyuser(Long userid ){
        return cahierDeChargesRepository.findnumberofcahiersdecharges( userid);
    }
    public List<CahierDeCharges> getAllCahiersDeCharges (){
        return cahierDeChargesRepository.findAll();
    }
}