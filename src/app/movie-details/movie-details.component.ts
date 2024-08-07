import { Component, inject, OnInit } from '@angular/core';
import { MoviesService } from '../service/movies.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Genre, MovieDetails, Result } from '../service/types';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit {
  moviesService = inject(MoviesService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  movieId: number = this.route.snapshot.params['ID'];

  form: FormGroup;
  searchMovies$ = this.moviesService.searchMovies$;
  genres$ = this.moviesService.genres$;
  movie$: Observable<MovieDetails>;
  srcImg: string = 'https://image.tmdb.org/t/p/w342/';
  searchByGenre(genre: Genre) {
    this.moviesService.genre$.next(genre);
  }
  getMovieDetails() {
    this.movie$ = this.moviesService.getMovieDetails(this.movieId).pipe(
      map((movie) => {
        return movie;
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
  ngOnInit(): void {
    this.getGenres();
    this.getMovieDetails();
    this.genres$.subscribe((v) => console.log(v));
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
    console.log(this.route.snapshot.params['ID']);
  }
}
