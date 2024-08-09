import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MoviesService} from './service/movies.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  movieService = inject(MoviesService);
  title = 'movieSearch';

  ngOnInit(): void {
    this.movieService.genres$ = this.movieService.getGenres();
  }

}
