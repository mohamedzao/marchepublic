
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../inscription/inscription.component';

export class UserCount {
  constructor(
    public count : number, 
  ){}
}

export interface Tache {
  id?: number;
  description: string;
  dateFinale: string;
  duree: number;
  numero?: number; 
  etat?: string;
  commentaires?: string[];
  valide?: boolean;
  nouveauCommentaire?: string;
}
export class CahierDeCharges {
  constructor(
   public id : number  ,  
    public descriptionetatactuel: string, 
    public objectif: string, 
    public materiels: string, 
    public licences: string, 
    public taches: Tache[], 
    public dureeprojet: number,  
    public budget: number,
    public nomFichier: string,
    public contenuFichier: string,
    public employeId: number,
    public employeName: string,
    public valide?: boolean,
    public employeService? : string  | null ,
    public chefservice? : string | null ,
    public dateSoumission?: string,
    public validatedByEmployeId?: number,    
    public validatedByEmployeNames?: String[] ,
    public numberofvalidatorsbycahier?: number ,
    public validatedbyChefId? : number , 
    public validatedbyChefName? : String, 
    public validatedByEmployeName? : String,
    
  ) {}
}

@Component({
  selector: 'app-employe',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './employe.component.html',
  styleUrl: './employe.component.css'
})
export class EmployeComponent implements OnInit {
  
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  constructor(private http: HttpClient) { }  
  cahiers : CahierDeCharges[]  =[];
  fileContent: string = '';
  fileName: string = '';
  employeId: number = 0;
  employeName: string = '';
  otherEmployesCahiers: any[] = []; 
  mesCahiers: any[] = [];
  afficherListeCahiers: boolean = false;
  cahierSelectionne: any = null;
   userCount: UserCount = new UserCount(0);
   service = localStorage.getItem('currentuserservice');
chargercountofusersAsync(): Promise<void> {
  return new Promise((resolve, reject) => {
    const apiUrl = `http://localhost:8080/api/users/userscount`;
    this.http.get<number>(apiUrl).subscribe({
      next: (response: number) => {
        this.userCount.count = response || 0; 
        resolve();
      },
      error: (error) => {
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
        
        const count = (response !== null && response !== undefined) ? response : 0;
        cahier.numberofvalidatorsbycahier = count;
        
        
        resolve(count);
      },
      error: (error) => {
        
        cahier.numberofvalidatorsbycahier = 0;
        resolve(0);
      }
    });
  });
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
      alert('Erreur lors de la validation de la tâche: ' + error.message);
    }
  });
}


async ngOnInit(): Promise<void> {
  try {
    this.userCount = new UserCount(0);
    
    await this.chargerInfosEmploye();
    await this.chargercountofusersAsync();
    await this.chargerMesCahiers();
    await this.chargerinfoautresemployes();
    
    
  } catch (error) {
  }
}

private chargerinfoautresemployes(): void {
  const service = localStorage.getItem('currentuserservice');  
  
  this.http.get<CahierDeCharges[]>('http://localhost:8080/api/cahier-de-charges/allotheremployees/' + this.employeId).subscribe(
    response => {
      
      
      
     
      const filteredCahiers = response.filter(cahier => {
        const matchesService = cahier.employeService === service;
        
        
        
        return matchesService;
      });
      
      
      
      this.otherEmployesCahiers = filteredCahiers.map(cahier => ({
        ...cahier,
        valide: cahier.valide || false,
        taches: (cahier.taches || []).map((tache: any) => ({
          ...tache,
          valide: tache.valide || false,
          commentaires: tache.commentaires || [],
          nouveauCommentaire: ''
        }))
      }));
      
      
    },
    error => {
    }
  );
}
  
  private chargerValidateursCahier(cahierId: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const apiUrl = `http://localhost:8080/api/cahier-de-charges/getvalidatorsbycahier/${cahierId}`;
    
    this.http.get<string[]>(apiUrl).subscribe({
      next: (response: string[]) => {
        resolve(response || []);
      },
      error: (error) => {
        resolve([]);
      }
    });
  });
}


  private chargerInfosEmploye(): void {
    const emailcurrentuser = localStorage.getItem('currentuseremail');
    
    if (emailcurrentuser) {
      this.http.post<User>('http://localhost:8080/api/users/getbyemail', emailcurrentuser).subscribe(
        response => {
          if (response && response.id) {
            this.employeId = response.id;
            this.employeName = response.prenom;
            
            
            this.chargerMesCahiers();
          } 
        },
        error => {
        }
      );
    }
  }

  private chargerMesCahiers(): void {
    const apiUrl = `http://localhost:8080/api/cahier-de-charges/employe/${this.employeId}`;
    
    this.http.get<any[]>(apiUrl).subscribe(
      (cahiers: any[]) => {
        this.mesCahiers = cahiers.map(cahier => ({
          ...cahier,
          valide: cahier.valide || false,
          // Assurer que chaque tâche a les propriétés nécessaires
          taches: (cahier.taches || []).map((tache: any) => ({
            ...tache,
            valide: tache.valide || false,
            commentaires: tache.commentaires || [],
            nouveauCommentaire: ''
          }))
        }));
      },
      error => {
      }
    );
  }


async validerCahier(cahier: CahierDeCharges): Promise<void> {
  try {
    if (!cahier.id || !this.employeId || !this.employeName) {
      alert('Données manquantes pour la validation');
      return;
    }

    if (this.userCount.count === 0) {
      await this.chargercountofusersAsync();
    }

    if (cahier.numberofvalidatorsbycahier === null || 
        cahier.numberofvalidatorsbycahier === undefined ||
        isNaN(Number(cahier.numberofvalidatorsbycahier))) {
      
      
      await this.chargernumberofvalidatorsbycahier(cahier);
    }

    let validatorsCount = Number(cahier.numberofvalidatorsbycahier);
    if (isNaN(validatorsCount)) {
      
      validatorsCount = 0;
      cahier.numberofvalidatorsbycahier = 0;
    } else {
      cahier.numberofvalidatorsbycahier = validatorsCount;
    }

    

    // Vérifier si l'utilisateur a déjà validé
    if (cahier.validatedByEmployeId === this.employeId) {
      alert('Vous avez déjà validé ce cahier de charges');
      return;
    }

    // Demander confirmation
    const confirmation = confirm(
      `Voulez-vous vraiment valider ce cahier de charges ?\n` +
      `Validations actuelles: ${cahier.numberofvalidatorsbycahier}/${this.userCount.count - 1}`
    );
    
    if (!confirmation) {
      return;
    }

    const apiUrl = `http://localhost:8080/api/cahier-de-charges/validate/${cahier.id}/${this.employeName}/${this.employeId}/${this.userCount.count}`;
    
    
    this.http.post(apiUrl, null).subscribe({
      next: (response) => {
        
        
        const nouveauNombre = (cahier.numberofvalidatorsbycahier || 0) + 1;
        cahier.numberofvalidatorsbycahier = nouveauNombre;
        
        if (nouveauNombre >= this.userCount.count - 1) {
          cahier.valide = true;
          alert('Cahier de charges totalement validé !');
        } else {
          alert(`Cahier validé avec succès ! (${nouveauNombre}/${this.userCount.count - 1 } validations)`);
        }        
        this.mettreAJourCahierDansTableaux(cahier.id, { 
          valide: cahier.valide,
          validatedByEmployeId: this.employeId,
          validatedByEmployeName: this.employeName,
          numberofvalidatorsbycahier: nouveauNombre
        });
        this.chargerValidateursCahier(cahier.id).then(validateurs => {
  cahier.validatedByEmployeNames = validateurs;
  
  this.mettreAJourCahierDansTableaux(cahier.id, { 
    valide: cahier.valide,
    validatedByEmployeId: this.employeId,
    validatedByEmployeName: this.employeName,
    numberofvalidatorsbycahier: nouveauNombre,
    validatedByEmployeNames: validateurs, 
  });
});
      },
      error: (error) => {
        alert('Erreur lors de la validation du cahier: ' + error.message);
      }
    });

  } catch (error) {
    alert('Erreur inattendue lors de la validation');
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
      alert('Erreur lors de l\'ajout du commentaire: ' + error.message);
    }
  );
}

  private mettreAJourCahierDansTableaux(cahierId: number, updates: any): void {

    const indexMesCahiers = this.mesCahiers.findIndex(c => c.id === cahierId);
    if (indexMesCahiers !== -1) {
      this.mesCahiers[indexMesCahiers] = { ...this.mesCahiers[indexMesCahiers], ...updates };
    }

    const indexOtherCahiers = this.otherEmployesCahiers.findIndex(c => c.id === cahierId);
    if (indexOtherCahiers !== -1) {
      this.otherEmployesCahiers[indexOtherCahiers] = { ...this.otherEmployesCahiers[indexOtherCahiers], ...updates };
    }

    if (this.cahierSelectionne && this.cahierSelectionne.id === cahierId) {
      this.cahierSelectionne = { ...this.cahierSelectionne, ...updates };
    }
  }

  soumettre(): void {
    const formulaire = document.getElementById("soumettre");
    formulaire?.classList.remove("hidden");
    this.afficherListeCahiers = false;
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) {
      return;
    }
    
    const file: File = input.files[0];
    
    if (file) {
      const isTextFile = file.type === 'text/plain' || 
                        file.name.toLowerCase().endsWith('.txt') ||
                        file.type === '';
      
      if (isTextFile) {
        this.fileName = file.name;
        
        const reader = new FileReader();
        
        reader.onload = () => {
          if (reader.result !== null) {
            this.fileContent = reader.result as string;
            
          } else {
            this.resetForm();
          }
        };
        
        reader.onerror = () => {
          alert('Erreur lors de la lecture du fichier');
          this.resetForm();
        };
        
        reader.onabort = () => {
          this.resetForm();
        };
        
        reader.readAsText(file);
      } else {
        alert('Veuillez sélectionner un fichier .txt valide');
        this.resetForm();
      }
    }
  }

  soumettrecahierdecharges(): void {
    if (!this.fileContent) {
      alert('Veuillez d\'abord importer un fichier .txt');
      return;
    }

    const donnees = this.extraireDonneesFichier(this.fileContent);
     
    const apiUrl = 'http://localhost:8080/api/cahier-de-charges/save';
    const cahierDeCharges = new CahierDeCharges(
      donnees.id , 
      donnees.descriptionetatactuel,
      donnees.objectif,
      donnees.materiels,
      donnees.licences,
      donnees.taches,
      donnees.dureeprojet,  
      donnees.budget,
      this.fileName,
      this.fileContent,
      this.employeId,
      this.employeName,
      false,
      this.service,


    );

    this.http.post(apiUrl, cahierDeCharges).subscribe(
      response => {
        alert('Cahier de charges soumis avec succès !');
        this.resetForm();
        this.chargerMesCahiers();
      },
      error => {
        alert('Erreur lors de la soumission du cahier de charges: ' + error.message);
      }
    );
  }

  voirMesCahiersDeCharges(): void {
    this.afficherListeCahiers = true;
    
    const formulaire = document.getElementById("soumettre");
    formulaire?.classList.add("hidden");
    
    this.chargerMesCahiers();
    this.chargerinfoautresemployes();
  }

 afficherDetailsCahier(cahier: any): void {
  // Charger les validateurs depuis l'API
  this.chargerValidateursCahier(cahier.id).then(validateurs => {
    this.cahierSelectionne = {
      ...cahier,
      validatedByEmployeNames: validateurs || [],
      taches: (cahier.taches || []).map((tache: any) => ({
        ...tache,
        nouveauCommentaire: tache.nouveauCommentaire || ''
      }))
    };
    
  });
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

  retourListe(): void {
    this.cahierSelectionne = null;
  }

  fermerVueCahiers(): void {
    this.afficherListeCahiers = false;
    this.cahierSelectionne = null;
    this.mesCahiers = [];
    this.otherEmployesCahiers = [];
  }

  private extraireDonneesFichier(contenu: string): any {
    const lignes = contenu.split('\n');
    const donnees = {
      descriptionetatactuel: '',
      objectif: '',
      materiels: '',
      licences: '',
      taches: [] as Tache[],
      dureeprojet: 0,  
      budget: 0
    };

    let inTachesSection = false;
    let numeroTache = 1;

    lignes.forEach(ligne => {
      const ligneNettoyee = ligne.trim();
      
      if (ligneNettoyee.toLowerCase().startsWith('description:')) {
        donnees.descriptionetatactuel = ligneNettoyee.substring('description:'.length).trim();
      } else if (ligneNettoyee.toLowerCase().startsWith('objectif:')) {
        donnees.objectif = ligneNettoyee.substring('objectif:'.length).trim();
      } else if (ligneNettoyee.toLowerCase().startsWith('materiels:')) {
        donnees.materiels = ligneNettoyee.substring('materiels:'.length).trim();
      } else if (ligneNettoyee.toLowerCase().startsWith('licences:')) {
        donnees.licences = ligneNettoyee.substring('licences:'.length).trim();
      } else if (ligneNettoyee.toLowerCase().startsWith('taches:')) {
        inTachesSection = true;
      } else if (ligneNettoyee.toLowerCase().startsWith('duree:')) {
        inTachesSection = false;
        donnees.dureeprojet = parseInt(ligneNettoyee.substring('duree:'.length).trim()) || 0;
      } else if (ligneNettoyee.toLowerCase().startsWith('budget:')) {
        inTachesSection = false;
        donnees.budget = parseInt(ligneNettoyee.substring('budget:'.length).trim()) || 0;
      } else if (inTachesSection && ligneNettoyee) {
        const tache = this.parserTacheSimplifiee(ligneNettoyee, numeroTache);
        if (tache) {
          donnees.taches.push(tache);
          numeroTache++;
        }
      }
    });

    return donnees;
  }

  private parserTacheSimplifiee(ligneTache: string, numero: number): Tache | null {
    const parties = ligneTache.split(';');
    if (parties.length < 3) {
      
      return null;
    }

    const tache: Tache = {
      numero: numero,
      description: parties[0].trim(),
      dateFinale: parties[1].trim(),
      duree: parseInt(parties[2].trim()) || 0,
      etat: 'en attente',
      commentaires: [],
      valide: false
    };

    return tache;
  }

  private resetForm(): void {
    this.fileContent = '';
    this.fileName = '';
    
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
