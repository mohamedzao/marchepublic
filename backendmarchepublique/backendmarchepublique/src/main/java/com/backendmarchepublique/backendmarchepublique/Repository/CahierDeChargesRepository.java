package com.backendmarchepublique.backendmarchepublique.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backendmarchepublique.backendmarchepublique.Model.CahierDeCharges;

    

public interface CahierDeChargesRepository extends JpaRepository<CahierDeCharges, Long> {
    
    @Query("SELECT c FROM CahierDeCharges c LEFT JOIN FETCH c.taches WHERE c.employeId = :employeId")
    List<CahierDeCharges> findByEmployeId(@Param("employeId") Long employeId);

    @Query("SELECT c FROM CahierDeCharges c LEFT JOIN FETCH c.taches  WHERE c.employeId != :employeId ")
    List<CahierDeCharges> findByEmployeIdNot(@Param("employeId") Long employeId );
    
    @Query("SELECT numberofvalidationsbycahier FROM CahierDeCharges c WHERE c = :cahierDeCharges")
    Long countvalidatorsbycahier(@Param("cahierDeCharges") CahierDeCharges cahierDeCharges);
   

    @Query("Select validatedByEmployeNames FROM CahierDeCharges c WHERE c.id = :cahierid")
    List<String> getValidatorsByCahier(@Param("cahierid") Long cahierid);


    @Query("SELECT COUNT(c) FROM CahierDeCharges c")
    Long findnumberofcahiersdecharges();
    

    @Query("SELECT COUNT(c) FROM CahierDeCharges c WHERE c.employeId = :userid") 
    Long findnumberofcahiersdecharges(@Param("userid") Long userid);
}
