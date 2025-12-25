package com.backendmarchepublique.backendmarchepublique.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backendmarchepublique.backendmarchepublique.Model.CahierDeCharges;
import com.backendmarchepublique.backendmarchepublique.Service.CahierDeChargesService;

@RestController
@RequestMapping("/api/cahier-de-charges")
@CrossOrigin(origins = "http://localhost:4200")
public class CahierDeChargesController {
    
    @Autowired
    private CahierDeChargesService cahierDeChargesService;
    
    @PostMapping("/save")
    public void saveCahierDeCharges(@RequestBody CahierDeCharges cahierDeCharges) {
      
        cahierDeChargesService.saveCahierDeCharges(cahierDeCharges);
    }

    @GetMapping("/employe/{employeId}")
    public List<CahierDeCharges> getCahiersByEmployeId(@PathVariable Long employeId) {
        


        return cahierDeChargesService.getCahierDeChargesByEmployeId(employeId );
    }

    @GetMapping("/allotheremployees/{employeid}")
    public List<CahierDeCharges> getCahiersOfOtherEmployees(@PathVariable Long employeid) {
        return cahierDeChargesService.getCahiersOfOtherEmployees(employeid );
    }

    @PostMapping("/validate/{cahierId}/{employeName}/{employeId}/{numberofusers}")
         public void validateCahierDeCharges(@PathVariable Long cahierId, 
                                   @PathVariable String employeName,
                                   @PathVariable Long employeId, 
                                   @PathVariable Long numberofusers) {
    cahierDeChargesService.validateCahierDeCharges(cahierId, employeName, employeId, numberofusers);
}

@PostMapping("/validate/{cahierId}/{chefName}/{chefId}")
public void validateCahierDeChargesByChef(@PathVariable Long cahierId,@PathVariable String chefName,@PathVariable Long chefId){
                    cahierDeChargesService.validateCahierDeCharges(cahierId , chefName , chefId );
}
                                                                      

@PostMapping("/numberofvalidatorsbycahier")
public Long getNumberOfValidCahiers(@RequestBody CahierDeCharges cahierDeCharges) {
    return cahierDeChargesService.getNumberOfValidatorsbyCahier(cahierDeCharges);
}

@GetMapping("/getcahiersdechargedesautreemployés")
public List<CahierDeCharges> getCahiersDeChargesDesAutresEmployes() {
    return cahierDeChargesService.getCahiersDeChargesDesAutresEmployes();
}

@GetMapping("/getvalidatorsbycahier/{cahierid}")
public List<String> getValidatorsByCahier(@PathVariable Long cahierid) {
    return cahierDeChargesService.getValidatorsByCahier(cahierid);
}

 @GetMapping("/getcahiersdechargesnumber")
    public Long getnumber() {
        return cahierDeChargesService.getcahiersdechargesnumber();
    }
@GetMapping("/getcahiersdechargesnumberbyuser/{userid}")
public Long getcahiersdechargesnumberbyuser(@PathVariable Long userid) {
    return cahierDeChargesService.getcahiersdechargesnumberbyuser(userid);

}
@GetMapping("/getall")
public List<CahierDeCharges> getAllCahiersDeCharges() {
    return cahierDeChargesService.getAllCahiersDeCharges();
}
}