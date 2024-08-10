import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SearchComponentComponent } from './search-component/search-component.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'home', component: LandingPageComponent },
  {
    path: 'search/:ID',
    component: SearchComponentComponent,
  },
  {
    path: 'search/:ID',
    component: SearchComponentComponent,
  },
  {
    path: 'details/:ID',
    component: MovieDetailsComponent,
  },
];
