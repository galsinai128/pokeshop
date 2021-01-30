import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { LoggerService } from '../logger.service';
import { Pokemon } from '../pokemon-types';
import { Subscription } from 'rxjs';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = this.auth.isLoggedIn$;

  private pokemonsOnCartSub = new Subscription();
  pokemonsOnCart:Pokemon[] = [];

  constructor(private auth: AuthService, private logger: LoggerService, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.logger.debug('init HeaderComponent');
    this.pokemonsOnCartSub = this.pokemonService.PokemonOnCartList$.subscribe(result => this.pokemonsOnCart = result);
  }

  ngOnDestroy(): void {
    this.pokemonsOnCartSub.unsubscribe();
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }

}
