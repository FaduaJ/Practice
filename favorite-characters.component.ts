import { Component, OnInit, signal } from '@angular/core';
import { StarWarsCharacter } from '../../shared/interfaces/character.interface';
import { Utils } from '../../shared/Utils';

@Component({
  selector: 'app-favorite-characters',
  templateUrl: './favorite-characters.component.html',
  styleUrl: './favorite-characters.component.scss',
})
export class FavoriteCharactersComponent implements OnInit {
  favoriteList = signal<StarWarsCharacter[]>(JSON.parse(Utils.get('favorite') || '[]'));
  

  ngOnInit(): void {
    const initialFavorites = JSON.parse(Utils.get('favorite') || '[]');
    this.favoriteList.set(JSON.parse(Utils.get('favorite') || '[]'));
    
  }
}
