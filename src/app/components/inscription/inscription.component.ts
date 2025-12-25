import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Correction de l'import
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export class User {
  constructor(
    public id : null, 
    public prenom: string,
    public nom: string,
    public role: string,
    public email: string,
    public password: string,
    public employeService: string = '',
    public chefservice: string = '',
    public chefadmin : string = '' 
  ) {}
}

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule , FormsModule , HttpClientModule], 
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
    user = new User( null  , "", "", "", "", "", "", "");

      
    constructor(private http: HttpClient) { }  
  
  onSubmit() { 
     this.http.post('http://localhost:8080/api/users/register', this.user).subscribe(
       response => {
         console.log('Utilisateur enregistré avec succès', response);
       },
       error => {
         console.error('Erreur lors de l\'enregistrement de l\'utilisateur', error);
       }
     );
    }

}