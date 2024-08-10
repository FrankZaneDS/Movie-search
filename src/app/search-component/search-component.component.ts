import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MoviesService } from '../service/movies.service';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { Genre, Result } from '../service/types';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-component',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent, ReactiveFormsModule],
  templateUrl: './search-component.component.html',
  styleUrl: './search-component.component.css',
})
export class SearchComponentComponent implements OnInit {
  moviesService = inject(MoviesService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  form: FormGroup;

  genres$ = this.moviesService.genres$;
  genre$ = this.moviesService.genre$;
  genreId: number = this.route.snapshot.params['ID'];
  moviesGenre$: Observable<Result[]>;
  searchMovies$: Observable<Result[]>;

  searchByGenre(genre: Genre) {
    this.moviesService.genre$.next(genre);
    this.getMoviesByGenre();
  }
  getGenres() {
    this.genres$ = this.moviesService.getGenres().pipe(
      map((genres) => {
        return genres;
      })
    );
  }
  getMoviesByGenre() {
    this.genreId = this.genre$.getValue().id;
    this.moviesGenre$ = this.moviesService
      .searchMovieByGenre(this.genreId)
      .pipe(
        map((movies: Result[]) => {
          return movies;
        })
      );
  }
  ngOnInit(): void {
    this.getMoviesByGenre();
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
