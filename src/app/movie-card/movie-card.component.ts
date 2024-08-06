import { Component, Input } from '@angular/core';
import { Result } from '../service/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css',
})
export class MovieCardComponent {
  @Input() movie: Result;
  srcImg: string = 'https://image.tmdb.org/t/p/w500/';
}
