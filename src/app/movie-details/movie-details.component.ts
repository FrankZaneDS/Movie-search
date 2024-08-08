import { Component, inject, OnInit } from '@angular/core';
import { MoviesService } from '../service/movies.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Genre, MovieDetails, Result } from '../service/types';
import { debounceTime, distinctUntilChanged, map, Observable, of } from 'rxjs';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MovieCardComponent,
    FormsModule,
  ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit {
  moviesService = inject(MoviesService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  movieId: number = this.route.snapshot.params['ID'];
  similarMovies$: Observable<Result[]>;
  userPrompt: string = '';
  response: string | null = null;
  question: string = 'answer only about this movie ';
  form: FormGroup;
  searchMovies$ = this.moviesService.searchMovies$;
  genres$ = this.moviesService.genres$;
  movie$: Observable<MovieDetails>;
  srcImg: string = 'https://image.tmdb.org/t/p/w342/';

  generateText(movie: MovieDetails): void {
    this.moviesService
      .generateText(this.question, movie.title, this.userPrompt)
      .subscribe(
        (res) => {
          console.log('Response:', res); // Loguje odgovor od API-ja

          // Proveri da li postoji 'text' u odgovoru
          if (res && res.text) {
            this.response = res.text;
          } else {
            this.response = 'No valid response received.';
          }
        },
        (error) => {
          console.error('Error:', error);
          this.response = 'An error occurred while communicating with the API.';
        }
      );
    this.userPrompt = '';
  }

  searchByGenre(genre: Genre) {
    this.moviesService.genre$.next(genre);
  }

  getSimilarMovies() {
    this.similarMovies$ = this.moviesService
      .getSimilarMovies(this.movieId)
      .pipe(
        map((movies) => {
          return movies;
        })
      );
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
    this.getSimilarMovies();
    this.form = this.fb.group({
      searchText: [''],
    });

    this.form
      .get('searchText')
      .valueChanges.pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((value: string) => {
        if (value) {
          this.searchMovies$ = this.moviesService.getMoviesBySearch(value).pipe(
            map((movies: Result[]) => {
              console.log(movies);

              return movies;
            })
          );
          this.searchMovies$.subscribe((v) => console.log(value));
        } else return;
      });
    this.route.params.subscribe((params: Params) => {
      this.movieId = this.route.snapshot.params['ID'];
      this.form.reset();

      this.getMovieDetails();
    });
  }
}
