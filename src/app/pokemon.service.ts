import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { ApiClientService } from './api-client.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Pokemon } from './pokemon-types';


@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private pokemonList = new BehaviorSubject<Pokemon[]>([]);
  PokemonList$ = this.pokemonList.asObservable();
  private pokemonsSub = new Subscription();

  public pokemonOnCartList = new BehaviorSubject<Pokemon[]>([]);
  PokemonOnCartList$ = this.pokemonOnCartList.asObservable();
  private pokemonsOnCartSub = new Subscription();

  //********************************************************************************** */
  //hash table where <key = pokemon name, value = index of pokemon> for prefornence
  //********************************************************************************** */
  private pokemonListHashTable = {};

  constructor(private logger: LoggerService, private apiClient: ApiClientService) { }

  public init() {
    this.pokemonsSub = this.apiClient.getPokemons().subscribe(
      response => 
        {
          if(response !== undefined) {
            let i = 0;
            response.map(pokemon => {
              pokemon.isOnCart = false;
              //Init pokemon hash table
              this.pokemonListHashTable[pokemon.name] = i;
              i++;

              //Get Pokemon Image
              this.apiClient.getPokemonImage(pokemon).subscribe(
                response => {
                  if(response !== undefined){
                    this.logger.info(`Got pokemon image`);
                    pokemon.imageUrl = response.sprites.front_default
                  }
                },
                error => {this.logger.debug(`error accur on fetching image:${pokemon} error: ${error}`)}
              )
            })
            this.pokemonList.next(response);
            this.pokemonOnCartList.next([]);
            this.logger.info(`Got ${response.length} pokemons`);
            this.pokemonsSub.unsubscribe();
          }
        },
      error => {`error accur fetching pokemons, error: ${error}`}
      );
  }

  public addToCart(pokemon: Pokemon, isLoggedIn: any){
    this.logger.info(`inside pokemon service add to cart`);
    //update pokemons list
    let pokemonListCopy = [...this.pokemonList.value];
    pokemonListCopy[this.pokemonListHashTable[pokemon.name]].isOnCart = true;
    this.pokemonList.next(pokemonListCopy);

    //update pokemons cart
    let pokemonOnCartListCopy = [...this.pokemonOnCartList.value];
    pokemonOnCartListCopy.push(pokemon);
    this.pokemonOnCartList.next(pokemonOnCartListCopy);

    //save cart on login
    this.saveWhenLogin(pokemonOnCartListCopy,isLoggedIn)
  }

  public removeFromCart(pokemon: Pokemon, isLoggedIn: any){
    this.logger.info(`inside pokemon service remove from cart`);
    //update pokemons list
    let pokemonListCopy = [...this.pokemonList.value];
    pokemonListCopy[this.pokemonListHashTable[pokemon.name]].isOnCart = false;
    this.pokemonList.next(pokemonListCopy);
    
    //update pokemons carts
    let pokemonOnCartListCopy = [...this.pokemonOnCartList.value];
    for (let i = 0; i < pokemonOnCartListCopy.length; i++){
      if (pokemon.name === pokemonOnCartListCopy[i].name){  
        pokemonOnCartListCopy.splice(i,1);
      }
    }
    this.pokemonOnCartList.next(pokemonOnCartListCopy);

    //save cart on login
    this.saveWhenLogin(pokemonOnCartListCopy,isLoggedIn)
  }

  public clearCart(isLoggedIn: any){
    this.logger.info(`inside pokemon service clear cart`);
    let pokemonListCopy = [...this.pokemonList.value];
    for (let i = 0; i < pokemonListCopy.length; i++){
      pokemonListCopy[i].isOnCart = false;
    }

    this.pokemonOnCartList.next([]);

    //save cart on login
    this.saveWhenLogin([],isLoggedIn)
  }
  
  public loadCartFromStorage(){
    let updatedCart = JSON.parse(localStorage.getItem('cart'));
    let pokemonListCopy = JSON.parse(JSON.stringify(this.pokemonList.value));

    if (updatedCart){ 
      for (let i = 0; i < pokemonListCopy.length; i++){
        pokemonListCopy[i].isOnCart = false;
      }
      for (let i = 0; i < updatedCart.length; i++){
        pokemonListCopy[this.pokemonListHashTable[updatedCart[i].name]].isOnCart = true;
      }
      this.pokemonList.next(pokemonListCopy);
      this.pokemonOnCartList.next(updatedCart);
    }

  }

  public saveCartToStorage(cart: Pokemon[]){
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  public saveWhenLogin(cart: Pokemon[], isLoggedIn: any){
    if (isLoggedIn && isLoggedIn.source && isLoggedIn.source.value){
      this.saveCartToStorage(cart);
    }
  }

}
