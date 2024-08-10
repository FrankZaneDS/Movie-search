import { Component, inject, OnInit } from '@angular/core';
import { MoviesService } from '../service/movies.service';
import { Genre, Result, searchResult } from '../service/types';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit {
  moviesService = inject(MoviesService);
  fb = inject(FormBuilder);

  form: FormGroup;

  currentPage: number = 1;
  popularMovies$ = new Observable<Result[]>();
  randomMovies$ = new BehaviorSubject<Result[]>([]);
  genres$ = this.moviesService.genres$;
  searchMovies$ = this.moviesService.searchMovies$;

  getPopularMovies() {
    this.popularMovies$ = this.moviesService.getPopularMovies().pipe(
      map((movies: Result[]) => {
        console.log(movies);

        return movies;
      })
    );
  }
  getRandomMovies() {
    this.moviesService
      .getRandomMovie(this.currentPage)
      .pipe(
        map((newMovies: Result[]) => {
          const currentMovies = this.randomMovies$.getValue();
          return [...currentMovies, ...newMovies];
        })
      )
      .subscribe((movies) => this.randomMovies$.next(movies));
  }
  loadMoreMovies() {
    this.currentPage++;
    this.getRandomMovies();
  }

  getGenres() {
    this.genres$ = this.moviesService.getGenres().pipe(
      map((genres) => {
        return genres;
      })
    );
  }
  searchByGenre(genre: Genre) {
    this.moviesService.genre$.next(genre);
  }

  constructor() {}
  ngOnInit(): void {
    this.getPopularMovies();
    this.getRandomMovies();
    this.getGenres();
    this.form = this.fb.group({
      searchText: [null],
    });

    this.form
      .get('searchText')
      .valueChanges.pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.searchMovies$ = this.moviesService.getMoviesBySearch(value).pipe(
            map((movies: Result[]) => {
              console.log(movies);

              return movies;
            })
          );
          this.searchMovies$.subscribe((v) => console.log(value));
        }
      });
  }
}
