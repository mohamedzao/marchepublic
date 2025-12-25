import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

// Enhanced interfaces based on your existing models
interface UserWithStats {
  id: number;
  username?: string;  
  name?: string;    
  nom?: string;      
  prenom?: string;   
  email?: string;
  totalCahierDeCharges?: number;
  displayName?: string;
  role?: string;
}

interface Tache {
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

interface CahierDeCharges {
  id: number;
  descriptionetatactuel: string;
  objectif: string;
  materiels: string;
  licences: string;
  taches: Tache[];
  dureeprojet: number;
  budget: number;
  nomFichier: string;
  contenuFichier: string;
  employeId: number;
  employeName: string;
  valide?: boolean;
  dateSoumission?: string;
  validatedByEmployeId?: number;
  validatedByEmployeNames?: string[];
  numberofvalidatorsbycahier?: number;
  validatedbyChefId?: number;
  validatedbyChefName?: string;
  validatedByEmployeName?: string;
}

interface Statistics {
  totalUsers: number;
  totalCahierDeCharges: number;
  totalnumberCahierDeChargesByUser: number;
  totallistofusers: UserWithStats[];
  totalTaches: number;
  tachesValidees: number;
  tachesEnAttente: number;
  cahiersValides: number;
  cahiersEnAttente: number;
  budgetTotal: number;
  dureeMoyenne: number;
  tauxValidationCahiers: number;
  tauxValidationTaches: number;
}

interface DureeRange {
  range: string;
  min: number;
  max: number;
  count: number;
}

interface TacheStats {
  valide: number;
  enAttente: number;
}

interface BudgetRange {
  range: string;
  min: number;
  max: number;
  count: number;
}

@Component({
  selector: 'app-chefadmin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './chefadmin.component.html',
  styleUrl: './chefadmin.component.css'
})
export class ChefadminComponent implements OnInit, AfterViewInit {
  
  @ViewChild('dureeChart') dureeChart!: ElementRef;
  @ViewChild('tacheChart') tacheChart!: ElementRef;
  @ViewChild('budgetChart') budgetChart!: ElementRef;
  @ViewChild('validationChart') validationChart!: ElementRef;
  
  chart: any;
  tacheChartInstance: any;
  budgetChartInstance: any;
  validationChartInstance: any;
  
  cahierdecharge: CahierDeCharges[] = [];  
  cahiersByDuree: DureeRange[] = [];
  tacheStats: TacheStats = { valide: 0, enAttente: 0 };
  cahiersByBudget: BudgetRange[] = [];
  
  stats: Statistics = { 
    totalUsers: 0, 
    totalCahierDeCharges: 0, 
    totalnumberCahierDeChargesByUser: 0, 
    totallistofusers: [],
    totalTaches: 0,
    tachesValidees: 0,
    tachesEnAttente: 0,
    cahiersValides: 0,
    cahiersEnAttente: 0,
    budgetTotal: 0,
    dureeMoyenne: 0,
    tauxValidationCahiers: 0,
    tauxValidationTaches: 0
  };
  
  loading: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.tryCreateCharts(), 500);
  }

  loadStatistics(): void {
    this.loading = true;
    
    Promise.all([
      this.loadUserStatistics(),
      this.loadCahierDeChargesStatistics(),
      this.loadUsersWithCahierStats(),
      this.loadCahiersByDuree(),
      this.loadTacheStatistics(),
      this.loadBudgetStatistics()
    ]).then(() => {
      this.loading = false;
      setTimeout(() => this.tryCreateCharts(), 100);
    }).catch(error => {
      console.error('Error loading statistics:', error);
      this.loading = false;
    });
  }

  private async loadCahiersByDuree(): Promise<void> {
    try {
      const cahiers = await this.http.get<CahierDeCharges[]>('http://localhost:8080/api/cahier-de-charges/getall').toPromise();
      
      if (cahiers && cahiers.length > 0) {
        this.cahiersByDuree = this.groupCahiersByDuree(cahiers);
        console.log('Cahiers by duration loaded:', this.cahiersByDuree);
      } else {
        console.log('No cahiers found');
        this.cahiersByDuree = [];
      }
    } catch (error) {
      console.error('Error loading cahiers for duration analysis:', error);
      this.cahiersByDuree = [];
    }
  }

  private async loadTacheStatistics(): Promise<void> {
    try {
      const cahiers = await this.http.get<CahierDeCharges[]>('http://localhost:8080/api/cahier-de-charges/getall').toPromise();
      
      if (cahiers && cahiers.length > 0) {
        let totalTaches = 0;
        let tachesValidees = 0;
        let tachesEnAttente = 0;
        let cahiersValides = 0;
        let cahiersEnAttente = 0;
        let budgetTotal = 0;
        let dureeTotale = 0;

        cahiers.forEach(cahier => {
          // Cahier statistics
          if (cahier.valide) {
            cahiersValides++;
          } else {
            cahiersEnAttente++;
          }
          
          budgetTotal += cahier.budget || 0;
          dureeTotale += cahier.dureeprojet || 0;

          // Tache statistics
          if (cahier.taches && cahier.taches.length > 0) {
            totalTaches += cahier.taches.length;
            cahier.taches.forEach(tache => {
              if (tache.valide) {
                tachesValidees++;
              } else {
                tachesEnAttente++;
              }
            });
          }
        });

        this.stats.totalTaches = totalTaches;
        this.stats.tachesValidees = tachesValidees;
        this.stats.tachesEnAttente = tachesEnAttente;
        this.stats.cahiersValides = cahiersValides;
        this.stats.cahiersEnAttente = cahiersEnAttente;
        this.stats.budgetTotal = budgetTotal;
        this.stats.dureeMoyenne = cahiers.length > 0 ? dureeTotale / cahiers.length : 0;
        this.stats.tauxValidationCahiers = cahiers.length > 0 ? (cahiersValides / cahiers.length) * 100 : 0;
        this.stats.tauxValidationTaches = totalTaches > 0 ? (tachesValidees / totalTaches) * 100 : 0;

        this.tacheStats = {
          valide: tachesValidees,
          enAttente: tachesEnAttente
        };

        console.log('Tache statistics loaded:', this.tacheStats);
        console.log('Cahier statistics loaded:', {
          valides: cahiersValides,
          enAttente: cahiersEnAttente,
          budgetTotal: budgetTotal,
          dureeMoyenne: this.stats.dureeMoyenne
        });
      }
    } catch (error) {
      console.error('Error loading tache statistics:', error);
    }
  }

  private async loadBudgetStatistics(): Promise<void> {
    try {
      const cahiers = await this.http.get<CahierDeCharges[]>('http://localhost:8080/api/cahier-de-charges/getall').toPromise();
      
      if (cahiers && cahiers.length > 0) {
        this.cahiersByBudget = this.groupCahiersByBudget(cahiers);
        console.log('Budget statistics loaded:', this.cahiersByBudget);
      }
    } catch (error) {
      console.error('Error loading budget statistics:', error);
    }
  }

  private groupCahiersByDuree(cahiers: CahierDeCharges[]): DureeRange[] {
    const durationRanges: DureeRange[] = [
      { range: '0-7 jours', min: 0, max: 7, count: 0 },
      { range: '8-15 jours', min: 8, max: 15, count: 0 },
      { range: '16-30 jours', min: 16, max: 30, count: 0 },
      { range: '1-2 mois', min: 31, max: 60, count: 0 },
      { range: '2-3 mois', min: 61, max: 90, count: 0 },
      { range: '3+ mois', min: 91, max: Infinity, count: 0 }
    ];

    return durationRanges.map(range => ({
      ...range,
      count: cahiers.filter(cahier => 
        cahier.dureeprojet && cahier.dureeprojet >= range.min && cahier.dureeprojet <= range.max
      ).length
    }));
  }

  private groupCahiersByBudget(cahiers: CahierDeCharges[]): BudgetRange[] {
    const budgetRanges: BudgetRange[] = [
      { range: '0-1,000 €', min: 0, max: 1000, count: 0 },
      { range: '1,001-5,000 €', min: 1001, max: 5000, count: 0 },
      { range: '5,001-10,000 €', min: 5001, max: 10000, count: 0 },
      { range: '10,001-20,000 €', min: 10001, max: 20000, count: 0 },
      { range: '20,001-50,000 €', min: 20001, max: 50000, count: 0 },
      { range: '50,000+ €', min: 50001, max: Infinity, count: 0 }
    ];

    return budgetRanges.map(range => ({
      ...range,
      count: cahiers.filter(cahier => 
        cahier.budget && cahier.budget >= range.min && cahier.budget <= range.max
      ).length
    }));
  }

  private tryCreateCharts(): void {
    this.createDureeChart();
    this.createTacheChart();
    this.createBudgetChart();
    this.createValidationChart();
  }

  createDureeChart(): void {
    if (!this.cahiersByDuree || this.cahiersByDuree.length === 0) return;
    if (!this.dureeChart?.nativeElement) return;

    const ctx = this.dureeChart.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.cahiersByDuree.map(item => item.range),
        datasets: [{
          label: 'Nombre de Cahiers de Charges',
          data: this.cahiersByDuree.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Répartition des Cahiers par Durée'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Nombre' }
          },
          x: {
            title: { display: true, text: 'Durée du Projet' }
          }
        }
      }
    });
  }

  createTacheChart(): void {
    if (!this.tacheStats || !this.tacheChart?.nativeElement) return;

    const ctx = this.tacheChart.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.tacheChartInstance) {
      this.tacheChartInstance.destroy();
    }

    this.tacheChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Tâches Validées', 'Tâches en Attente'],
        datasets: [{
          data: [this.tacheStats.valide, this.tacheStats.enAttente],
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Statut des Tâches'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  createBudgetChart(): void {
    if (!this.cahiersByBudget || this.cahiersByBudget.length === 0) return;
    if (!this.budgetChart?.nativeElement) return;

    const ctx = this.budgetChart.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.budgetChartInstance) {
      this.budgetChartInstance.destroy();
    }

    this.budgetChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.cahiersByBudget.map(item => item.range),
        datasets: [{
          label: 'Nombre de Cahiers',
          data: this.cahiersByBudget.map(item => item.count),
          backgroundColor: 'rgba(153, 102, 255, 0.7)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Répartition des Cahiers par Budget'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Nombre' }
          },
          x: {
            title: { display: true, text: 'Budget' }
          }
        }
      }
    });
  }

  createValidationChart(): void {
    if (!this.validationChart?.nativeElement) return;

    const ctx = this.validationChart.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.validationChartInstance) {
      this.validationChartInstance.destroy();
    }

    this.validationChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Cahiers Validés', 'Cahiers en Attente', 'Tâches Validées', 'Tâches en Attente'],
        datasets: [{
          label: 'Nombre',
          data: [
            this.stats.cahiersValides,
            this.stats.cahiersEnAttente,
            this.stats.tachesValidees,
            this.stats.tachesEnAttente
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Comparaison Validation Cahiers vs Tâches'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Nombre' }
          }
        }
      }
    });
  }

  // Existing methods from your original component
  getInitials(user: any): string {
    if (!user) return '';
    const name = user.name || user.displayName || user.username || '';
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  getMaxCahiers(): number {
    if (this.stats && this.stats.totallistofusers && this.stats.totallistofusers.length > 0) {
      return Math.max(...this.stats.totallistofusers.map((user: any) => user.totalCahierDeCharges || 0));
    }
    return 1;
  }

  private async loadUserStatistics(): Promise<void> {
    try {
      const totalUsers = await this.http.get<number>('http://localhost:8080/api/users/userscount').toPromise(); 
      this.stats.totalUsers = totalUsers || 0;
      console.log('Total users loaded:', this.stats.totalUsers);
    } catch (error) {
      console.error('Error loading user statistics:', error);
      this.stats.totalUsers = 0;
    }
  }

  private async loadCahierDeChargesStatistics(): Promise<void> {
    try {
      const totalCahierDeCharges = await this.http.get<number>('http://localhost:8080/api/cahier-de-charges/getcahiersdechargesnumber').toPromise(); 
      this.stats.totalCahierDeCharges = totalCahierDeCharges || 0;
      console.log('Total cahier de charges loaded:', this.stats.totalCahierDeCharges);
    } catch (error) {
      console.error('Error loading cahier de charges statistics:', error);
      this.stats.totalCahierDeCharges = 0;
    }
  }

  private async loadUsersWithCahierStats(): Promise<void> {
    try {
      const users = await this.http.get<any[]>('http://localhost:8080/api/users/getlistusers').toPromise();
      
      this.stats.totallistofusers = (users || []).map(user => ({
        id: user.id,
        username: user.username,
        name: user.name,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        displayName: this.getUserDisplayName(user),
        totalCahierDeCharges: 0
      }));
      
      console.log('Total users list loaded:', this.stats.totallistofusers.length);

      if (this.stats.totallistofusers.length > 0) {
        await this.loadCahierCountsForAllUsers();
      }
    } catch (error) {
      console.error('Error loading users list:', error);
      this.stats.totallistofusers = [];
    }
  }

  private async loadCahierCountsForAllUsers(): Promise<void> {
    const promises = this.stats.totallistofusers.map(async (user) => {
      try {
        const count = await this.http.get<number>(
          `http://localhost:8080/api/cahier-de-charges/getcahiersdechargesnumberbyuser/${user.id}`
        ).toPromise();
        
        user.totalCahierDeCharges = count || 0;
        console.log(`Cahier count for user ${user.id}: ${user.totalCahierDeCharges}`);
      } catch (error) {
        console.error(`Error loading cahier count for user ${user.id}:`, error);
        user.totalCahierDeCharges = 0;
      }
    });

    await Promise.all(promises);
    
    this.stats.totalnumberCahierDeChargesByUser = this.stats.totallistofusers.reduce(
      (total, user) => total + (user.totalCahierDeCharges || 0), 0
    );
    
    console.log('All user cahier counts loaded');
  }

  private getUserDisplayName(user: any): string {
    if (user.name) return user.name;
    if (user.username) return user.username;
    if (user.nom && user.prenom) return `${user.prenom} ${user.nom}`;
    if (user.nom) return user.nom;
    if (user.prenom) return user.prenom;
    if (user.email) return user.email;
    return `User ${user.id}`;
  }

  getDisplayName(user: UserWithStats): string {
    return user.displayName || this.getUserDisplayName(user);
  }

  // Helper method to format numbers
  formatNumber(num: number): string {
    return num.toLocaleString('fr-FR');
  }

  // Helper method to calculate percentage
  calculatePercentage(part: number, total: number): number {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  }

  // Method to refresh all data
  refreshData(): void {
    this.loadStatistics();
  }
}