import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../inscription/inscription.component';


 
@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [FormsModule, CommonModule , HttpClientModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  user : User = new User( null  , "", "", "", "", "", "", "");
  currentservice : string = '';
  constructor(private router: Router , private http : HttpClient ) {}
onSubmit(){
    localStorage.setItem('currentuseremail', this.user.email);
    this.http.post<User>('http://localhost:8080/api/users/getbyemail', this.user.email).subscribe(
      response => {
        if (response && response.id) {
          console.log('Infos utilisateur chargées via API:', response);
               if(response.chefservice && response.chefservice.trim() !== '') {
                 this.currentservice = response.chefservice;
               }else if(response.employeService && response.employeService.trim() !== '') {
                 this.currentservice = response.employeService;
               }
        }      }

    )
    localStorage.setItem('currentuserservice', this.currentservice);
   
  this.http.post<User>('http://localhost:8080/api/users/login', {
    email: this.user.email,
    password: this.user.password
  }).subscribe(
    response => {
      console.log('Login successful', response);
      
      if (response) {
       if (response.chefservice && response.chefservice.trim() !== '') {
        this.router.navigate(['/chef']);
} else if (response.employeService && response.employeService.trim() !== '') {
  this.router.navigate(['/employe']);
} else if (response.chefadmin && response.chefadmin.trim() !== '') {
  
  this.router.navigate(['/chefadmin']);
} 
      }
    },
    error => {
      console.error('Login failed', error);
}
  );
  
}


}
