import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SearchComponentComponent } from './search-component/search-component.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'home', component: LandingPageComponent },
  {
    path: 'search/:Id/:name',
    component: SearchComponentComponent,
  },
  {
    path: 'search/:movieName/:movieId',
    component: SearchComponentComponent,
  },
];
