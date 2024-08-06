import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Genre, Result, searchResult } from './types';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  http = inject(HttpClient);

  private apiUrl: string = `https://api.themoviedb.org/3`;

  genres$ = new BehaviorSubject<Genre>(null);

  getTopRatedMovies(): Observable<Result[]> {
    return this.http
      .get(`${this.apiUrl}/movie/top_rated?api_key=${environment.tmdbApiKey}`)
      .pipe(map((response: any) => response.results));
  }

  getPopularMovies(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/movie/popular?api_key=${environment.tmdbApiKey}`)
      .pipe(map((response: any) => response.results));
  }

  getMovieDetails(movieId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/movie/${movieId}?api_key=${environment.tmdbApiKey}`
    );
  }
  getRandomMovie(): Observable<Result[]> {
    return this.http
      .get(
        `${this.apiUrl}/discover/movie?api_key=${environment.tmdbApiKey}&sort_by=revenue.desc`
      )
      .pipe(map((response: any) => response.results));
  }
  searchMovieByGenre(genreId: number): Observable<Result[]> {
    return this.http
      .get(
        `${this.apiUrl}/discover/movie?api_key=${environment.tmdbApiKey}&with_genres=${genreId}`
      )
      .pipe(map((response: any) => response.results));
  }
  getGenres(): Observable<Genre[]> {
    return this.http
      .get(`${this.apiUrl}/genre/movie/list?api_key=${environment.tmdbApiKey}`)
      .pipe(map((response: any) => response.genres));
  }
  getMoviesBySearch(keyword: string): Observable<Result[]> {
    return this.http
      .get(
        `${this.apiUrl}/search/movie?api_key=${environment.tmdbApiKey}&query=${keyword}`
      )
      .pipe(map((response: any) => response.results));
  }
  constructor() {}
}
