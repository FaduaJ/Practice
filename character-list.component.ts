import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SwapiService } from '../../services/swapi/swapi.service';
import { StarWarsCharacter } from '../../shared/interfaces/character.interface';
import { Utils } from '../../shared/Utils';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
})
export class CharacterListComponent implements OnInit, OnDestroy {
  characterList: StarWarsCharacter[] = [];
  favoriteList = signal<StarWarsCharacter[]>(JSON.parse(Utils.get('favorite') || '[]'));
  nextUrl: string | null = null;
  previousUrl: string | null = null;
  currentPage = 1;
  loading = false;

  private unsubscribe$ = new Subject<void>();

  constructor(private swapiService: SwapiService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadCharacters() {
    this.loading = true;
    this.swapiService
      .getCharacters(this.currentPage)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: Response => {
          this.characterList = Response.results;
          this.nextUrl = Response.next;
          this.previousUrl = Response.previous;
          this.loading = false;
        },
        error: error => {
          console.log(error);
        },
      });
  }

  loadNextPage(): void {
    if (this.nextUrl) {
      this.currentPage++;
      this.loadCharacters();
    }
  }

  loadPreviousPage(): void {
    if (this.previousUrl) {
      this.currentPage--;
      this.loadCharacters();
    }
  }

  addToFavorite(character: StarWarsCharacter) {
    let favorites = this.favoriteList();
    const index = favorites.findIndex(fav => fav.name === character.name);
    if (index === -1) {
      favorites.push(character);
    } else {
      favorites.splice(index, 1);
    }
    this.favoriteList.set(favorites);
    Utils.set('favorite', JSON.stringify(favorites));
  }

  isFavorite(character: StarWarsCharacter): boolean {
    const isFav = this.favoriteList().some(fav => fav.name === character.name);
    console.log(`Checking if ${character.name} is favorite: `, isFav);
    return isFav;
  }
  
}
