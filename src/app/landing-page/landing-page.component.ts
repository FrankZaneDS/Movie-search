import { Component, inject, OnInit } from '@angular/core';
import { MoviesService } from '../service/movies.service';
import { Genre, Result, searchResult } from '../service/types';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
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
  searchText: string;
  popularMovies$ = new Observable<Result[]>();
  randomMovies$ = new Observable<Result[]>();
  moviesByGenre$ = new Observable<Result[]>();
  genres$ = new Observable<Genre[]>();
  searchMovies$: Observable<Result[]>;

  getPopularMovies() {
    this.popularMovies$ = this.moviesService.getPopularMovies().pipe(
      map((movies: Result[]) => {
        console.log(movies);

        return movies;
      })
    );
  }
  getRandomMovies() {
    this.randomMovies$ = this.moviesService.getRandomMovie().pipe(
      map((movies: Result[]) => {
        return movies;
      })
    );
  }
  getMovieByGenre(genreId: number) {
    this.moviesByGenre$ = this.moviesService.searchMovieByGenre(genreId).pipe(
      map((movies: Result[]) => {
        return movies;
      })
    );
  }
  getGenres() {
    this.genres$ = this.moviesService.getGenres().pipe(
      map((genres) => {
        return genres;
      })
    );
  }
  searchByGenre(genre: Genre) {
    this.moviesService.genres$.next(genre);
  }
  // searchByName(){
  //   const searchText = this.form.get('searchText').value
  //   this.moviesService.getMoviesBySearch(this.searchText).pipe
  // }

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
