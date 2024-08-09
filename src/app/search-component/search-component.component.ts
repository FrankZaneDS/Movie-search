import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MoviesService } from '../service/movies.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  switchMap,
} from 'rxjs';
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

  form = this.fb.group({
    searchText: [null],
  });

  genres$ = this.moviesService.genres$;
  genre$ = this.moviesService.genre$;
  // genreId: number;
  moviesGenre$ = this.genre$.pipe(
    filter(genre => !!genre),
    switchMap((genre) => this.moviesService.searchMovieByGenre(genre.id))
  );
  searchMovies$: Observable<Result[]>;

  searchByGenre(genre: Genre) {
    this.moviesService.genre$.next(genre);
    // this.getMoviesByGenre();
  }
  // genres zovemo na prvi dolazak u app-component
  // getGenres() {
  //   this.genres$ = this.moviesService.getGenres().pipe(
  //     map((genres) => {
  //       return genres;
  //     })
  //   );
  // }

  // ne mora funkcija mozes odmah gore da definises
  // getMoviesByGenre() {
  //   this.genreId = this.genre$.getValue().id;
  //   this.moviesGenre$ = this.moviesService
  //     .searchMovieByGenre(this.genreId)
  //     .pipe(
  //       map((movies: Result[]) => {
  //         return movies;
  //       })
  //     );
  // }

  ngOnInit(): void {
    // this.getMoviesByGenre();
    // this.getGenres();
    // this.form = this.fb.group({
    //   searchText: [null],
    // });
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
