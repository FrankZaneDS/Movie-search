import { Injectable } from '@angular/core';

Injectable({
  providedIn: 'root',
});
export interface topMovies {
  page: number;
  results: Result[];
}
export interface Result {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
export interface Genre {
  id: number;
  name: string;
}
export interface searchResult {
  id: number;
  name: string;
}
