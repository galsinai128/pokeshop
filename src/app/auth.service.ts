import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';
import { PokemonService } from './pokemon.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(private logger: LoggerService, private pokemonService: PokemonService) { }

  public init() {
    this.logger.debug('init AuthService');
  }

  public login() {
    this.logger.info('login');
    this.isLoggedIn.next(true);
    this.pokemonService.loadCartFromStorage();
  }

  public logout() {
    this.logger.info('logout');
    this.isLoggedIn.next(false);
  }
}
