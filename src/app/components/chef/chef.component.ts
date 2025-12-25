import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CahierDeCharges, Tache } from '../employe/employe.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { UserCount } from '../employe/employe.component';
import { User } from '../inscription/inscription.component';

@Component({
  selector: 'app-chef',
  standalone: true,
  imports: [FormsModule, HttpClientModule, NgFor , NgIf],
  templateUrl: './chef.component.html',
  styleUrl: './chef.component.css'
})

export class ChefComponent {

  cahiers : CahierDeCharges[] = [];
 tache : Tache[] = [];
  constructor(private http : HttpClient) {}
  
   cahierSelectionne: any = null;
   chefId : number = 0 ;
   chefName : String = '' ;
   validatedByEmployeId: number = 0;
   validatedByEmployeName: string = '';
   validatedbychef : boolean = false ; 
   
    private chargerInfosChef(): void {
       const emailcurrentuser = localStorage.getItem('currentuseremail');
       
       if (emailcurrentuser) {
         this.http.post<User>('http://localhost:8080/api/users/getbyemail', emailcurrentuser).subscribe(
           response => {
             if (response && response.id) {
               this.chefId = response.id;
               this.chefName = response.prenom;
               
               console.log('Infos chef chargées via API:', response);
              
             } 
           },
           error => {
             console.error('Erreur lors du chargement des infos employé:', error);
           }
         );
       }
     }
 ajouterCommentaire(tache: any): void {
  if (!tache.nouveauCommentaire || !tache.nouveauCommentaire.trim()) {
    alert('Veuillez saisir un commentaire');
    return;
  }

  if (!tache.id) {
    alert('ID de tâche manquant');
    return;
  }

  const apiUrl = `http://localhost:8080/api/taches/commenter/${tache.id}`;
  const commentaireData = {
    commentaire: tache.nouveauCommentaire.trim()
  };

  this.http.post(apiUrl, commentaireData).subscribe(
    response => {
      console.log('Commentaire ajouté avec succès:', response);
      
      if (!tache.commentaires) {
        tache.commentaires = [];
      }
      tache.commentaires.push(tache.nouveauCommentaire.trim());
      
      tache.nouveauCommentaire = '';
      
      // Update the task in the selected cahier
      if (this.cahierSelectionne && this.cahierSelectionne.taches) {
        const tacheIndex = this.cahierSelectionne.taches.findIndex((t: any) => t.id === tache.id);
        if (tacheIndex !== -1) {
          this.cahierSelectionne.taches[tacheIndex].commentaires = [...tache.commentaires];
        }
      }
      
      alert('Commentaire ajouté avec succès !');
    },
    error => {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      alert('Erreur lors de l\'ajout du commentaire: ' + error.message);
    }
  );
}
validerTache(tache: any): void {
  if (!tache.id) {
    alert('ID de tâche manquant');
    return;
  }

  const confirmation = confirm('Voulez-vous vraiment valider cette tâche ?');
  if (!confirmation) {
    return;
  }

  const apiUrl = `http://localhost:8080/api/taches/valider/${tache.id}`;
  
  this.http.post(apiUrl, null).subscribe({
    next: (response) => {
      console.log('Tâche validée avec succès:', response);
      tache.valide = true;
      alert('Tâche validée avec succès !');
      
      // Update the task in the selected cahier
      if (this.cahierSelectionne && this.cahierSelectionne.taches) {
        const tacheIndex = this.cahierSelectionne.taches.findIndex((t: any) => t.id === tache.id);
        if (tacheIndex !== -1) {
          this.cahierSelectionne.taches[tacheIndex].valide = true;
        }
      }
    },
    error: (error) => {
      console.error('Erreur lors de la validation de la tâche:', error);
      alert('Erreur lors de la validation de la tâche: ' + error.message);
    }
  });
}



    retourListe(): void {
    this.cahierSelectionne = null;
  }
    telechargerContenu(cahier: any): void {
    if (cahier.contenuFichier) {
      const blob = new Blob([cahier.contenuFichier], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = cahier.nomFichier || 'cahier-de-charges.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      alert('Contenu non disponible pour ce cahier');
    }
  }
    afficherDetailsCahier(cahier: any): void {
    this.cahierSelectionne = {
      ...cahier,
      taches: (cahier.taches || []).map((tache: any) => ({
        ...tache,
        nouveauCommentaire: tache.nouveauCommentaire || ''
      }))
    };
    console.log('Détails du cahier sélectionné:', this.cahierSelectionne);
  }
chargerlescahiers() : void {
   this.http.get<CahierDeCharges[]>('http://localhost:8080/api/cahier-de-charges/getcahiersdechargedesautreemployés').subscribe(data => {
    const service = localStorage.getItem('currentuserservice');
    console.log(service);
    console.log(data);
    const filteredCahiers = data.filter(cahier => {
        const matchesService = cahier.employeService === service;
        
        
        
        return matchesService;
      });
 this.cahiers = filteredCahiers.map(cahier => ({
        ...cahier,
        valide: cahier.valide || false,
        taches: (cahier.taches || []).map((tache: any) => ({
          ...tache,
          valide: tache.valide || false,
          commentaires: tache.commentaires || [],
          nouveauCommentaire: ''
        }))
      }));
      const voircahiersdecharge = document.getElementById('voir');
     voircahiersdecharge?.classList.remove('hidden');

   })
}
ngOnInit(): void {
  this.chargerlescahiers();
  this.chargerInfosChef(); 
}
userCount : UserCount = { count: 0 };
chargercountofusersAsync(): Promise<void> {
  return new Promise((resolve, reject) => {
    const apiUrl = `http://localhost:8080/api/users/userscount`;
    this.http.get<number>(apiUrl).subscribe({
      next: (response: number) => {
        console.log('Nombre d\'utilisateurs récupéré:', response);
        this.userCount.count = response || 0; 
        resolve();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du nombre d\'utilisateurs:', error);
        this.userCount.count = 0; 
        resolve(); 
      }
    });
  });
  
}
chargernumberofvalidatorsbycahier(cahier: any): Promise<number> {
  return new Promise((resolve, reject) => {
    const apiUrl = `http://localhost:8080/api/cahier-de-charges/numberofvalidatorsbycahier`;
    
    this.http.post<number>(apiUrl, cahier).subscribe({
      next: (response: number) => {
        console.log('Nombre de validateurs récupéré:', response);
        
        const count = (response !== null && response !== undefined) ? response : 0;
        cahier.numberofvalidatorsbycahier = count;
        
        console.log('Valeur définie pour numberofvalidatorsbycahier:', count);
        resolve(count);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du nombre de validateurs:', error);
        
        cahier.numberofvalidatorsbycahier = 0;
        resolve(0);
      }
    });
  });
}
async validerCahier(cahier: CahierDeCharges): Promise<void> {
  
   

   

  
  

    const apiUrl = `http://localhost:8080/api/cahier-de-charges/validate/${cahier.id}/${this.chefName}/${this.chefId}`;
    
    console.log('URL appelée:', apiUrl);

    this.http.post(apiUrl, null).subscribe({
      next: (response) => {
        console.log('Cahier validé avec succès:', response);
        
        
             cahier.valide = true ; 
        this.mettreAJourCahierDansTableaux(cahier.id, { 
          valide: cahier.valide,
          validatedByEmployeId: cahier.employeId,
          validatedByEmployeName: cahier.employeName,
          validatedbychefname : cahier.validatedbyChefName , 
        });
        this.chargerValidateursCahier(cahier.id).then(validateurs => {
  cahier.validatedByEmployeNames = validateurs;
  
  this.mettreAJourCahierDansTableaux(cahier.id, { 
    valide: cahier.valide,
    validatedByEmployeId: cahier.validatedByEmployeId,
    validatedByEmployeName: cahier.validatedByEmployeName,
    validatedByChefName : cahier.validatedbyChefName,
    validatedByEmployeNames: validateurs, 
  });
});
      },
      error: (error) => {
        console.error('Erreur lors de la validation du cahier:', error);
        alert('Erreur lors de la validation du cahier: ' + error.message);
      }
    });

  
}

  private mettreAJourCahierDansTableaux(cahierId: number, updates: any): void {

    const indexMesCahiers = this.cahiers.findIndex(c => c.id === cahierId);
    if (indexMesCahiers !== -1) {
      this.cahiers[indexMesCahiers] = { ...this.cahiers[indexMesCahiers], ...updates };
    }
  }
    private chargerValidateursCahier(cahierId: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const apiUrl = `http://localhost:8080/api/cahier-de-charges/getvalidatorsbycahier/${cahierId}`;
    
    this.http.get<string[]>(apiUrl).subscribe({
      next: (response: string[]) => {
        console.log('Validateurs récupérés:', response);
        resolve(response || []);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des validateurs:', error);
        resolve([]);
      }
    });
  });
}
}



