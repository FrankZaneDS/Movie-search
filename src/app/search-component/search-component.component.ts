import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MoviesService } from '../service/movies.service';
import { map, Observable } from 'rxjs';
import { Genre, Result } from '../service/types';

@Component({
  selector: 'app-search-component',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent],
  templateUrl: './search-component.component.html',
  styleUrl: './search-component.component.css',
})
export class SearchComponentComponent implements OnInit {
  moviesService = inject(MoviesService);
  genres$: Observable<Genre[]>;
  genre$ = this.moviesService.genres$;
  genreId: number;
  moviesGenre$: Observable<Result[]>;
  getGenres() {
    this.genres$ = this.moviesService.getGenres().pipe(
      map((genres) => {
        return genres;
      })
    );
  }
  searchByGenre(genre: Genre) {
    this.moviesService.genres$.next(genre);
    this.getMoviesByGenre();
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
  }
}
