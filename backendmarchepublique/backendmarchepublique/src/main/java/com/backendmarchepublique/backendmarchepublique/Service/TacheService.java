package com.backendmarchepublique.backendmarchepublique.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backendmarchepublique.backendmarchepublique.Model.Tache;
import com.backendmarchepublique.backendmarchepublique.Repository.TacheRepository;

@Service
public class TacheService {

    @Autowired
    private TacheRepository tacheRepository;

    public void ajouterCommentaire(Long tacheId, String commentaire) {
        Tache tache = tacheRepository.findById(tacheId).orElse(null);
        if (tache != null) {
            tache.ajouterCommentaire(commentaire);
            tacheRepository.save(tache);
        }
    }

    public void validerTache(Long tacheId) {
        Tache tache = tacheRepository.findById(tacheId).orElse(null);
        if (tache != null) {
            tache.setValide(true);
            tacheRepository.save(tache);
        }
    }
}