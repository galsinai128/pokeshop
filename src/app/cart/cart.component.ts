import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../pokemon-types';
import { Subscription } from 'rxjs';
import { LoggerService } from '../logger.service';
import { AuthService } from '../auth.service';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})


export class CartComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean;
  private isLoggedInSub = new Subscription();

  private pokemonsOnCartSub = new Subscription();
  pokemonsOnCart:Pokemon[] = [];

  constructor(private auth: AuthService, private pokemonService: PokemonService, private logger: LoggerService, private dialog: MatDialog) { }
  
  ngOnDestroy(): void {
    this.pokemonsOnCartSub.unsubscribe();
    this.isLoggedInSub.unsubscribe();
  }

  ngOnInit(): void {
    this.logger.debug('init CartComponent');
    this.pokemonsOnCartSub = this.pokemonService.PokemonOnCartList$.subscribe(result => this.pokemonsOnCart = result);
    this.isLoggedInSub = this.auth.isLoggedIn$.subscribe(result => this.isLoggedIn = result)
  }

  removeFromCart(pokemon): void {
    this.pokemonService.removeFromCart(pokemon,this.auth.isLoggedIn$);
  }

  clearCart(){
    this.pokemonService.clearCart(this.auth.isLoggedIn$);
  }

  openDialog(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(shouldClear => {
      if (shouldClear){
        this.clearCart()
      }
    }
  );
  }

}
