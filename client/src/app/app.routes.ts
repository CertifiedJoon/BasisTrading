import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { BasisChartComponent } from './features/basis-chart/basis-chart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'basis/chart', component: BasisChartComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
