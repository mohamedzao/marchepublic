package com.backendmarchepublique.backendmarchepublique.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backendmarchepublique.backendmarchepublique.Model.Tache;

public interface TacheRepository extends JpaRepository<Tache, Long> {
}