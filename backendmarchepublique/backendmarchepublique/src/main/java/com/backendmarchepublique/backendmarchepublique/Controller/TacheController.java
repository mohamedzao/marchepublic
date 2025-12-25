package com.backendmarchepublique.backendmarchepublique.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backendmarchepublique.backendmarchepublique.Service.TacheService;

@RestController
@RequestMapping("/api/taches")
@CrossOrigin(origins = "http://localhost:4200")
public class TacheController {

    @Autowired
    private TacheService tacheService;

    @PostMapping("/commenter/{tacheId}")
    public void ajouterCommentaire(@PathVariable Long tacheId, @RequestBody CommentaireRequest commentaireRequest) {
        tacheService.ajouterCommentaire(tacheId, commentaireRequest.getCommentaire());
    }

    @PostMapping("/valider/{tacheId}")
    public void validerTache(@PathVariable Long tacheId) {
        tacheService.validerTache(tacheId);
    }

    // Inner class for comment request
    public static class CommentaireRequest {
        private String commentaire;

        public String getCommentaire() {
            return commentaire;
        }

        public void setCommentaire(String commentaire) {
            this.commentaire = commentaire;
        }
    }
}