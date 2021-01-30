import { Component, OnInit, OnDestroy, OnChanges, DoCheck } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../pokemon-types';
import { Subscription } from 'rxjs';
import { LoggerService } from '../logger.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean;
  private isLoggedInSub = new Subscription();

  pokemons:Pokemon[] = [];
  private pokemonsSub = new Subscription();

  constructor(private auth: AuthService, private pokemonService: PokemonService, private logger: LoggerService) { }
  
  ngOnDestroy(): void {
    this.pokemonsSub.unsubscribe();
    this.isLoggedInSub.unsubscribe();
  }

  ngOnInit(): void {
    this.logger.debug('init HomeComponent');
    this.pokemonsSub = this.pokemonService.PokemonList$.subscribe(result => this.pokemons = result);
    this.isLoggedInSub = this.auth.isLoggedIn$.subscribe(result => this.isLoggedIn = result)
  }

  ngOnChanges(): void {}
  ngDoCheck(): void {}

  

  addToCart(pokemon): void {
    this.pokemonService.addToCart(pokemon,this.auth.isLoggedIn$);
  }

}
