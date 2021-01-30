import { Component, OnInit, Input } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { LoggerService } from '../logger.service';
import { AuthService } from '../auth.service';


import {
  trigger,
  style,
  animate,
  transition } from '@angular/animations';


@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [
      transition(':leave',
        animate(200, style({opacity: 0})))
    ])
  ]
})


//SHARED COMPONENT FOR BOTH LIST AND CART
export class PokemonListComponent implements OnInit {

  @Input('pokemons') pokemons: any;
  @Input('isFromList') isFromList: boolean;
  @Input() cartAction:(args: any) => void;

  constructor(private auth: AuthService, private pokemonService: PokemonService, private logger: LoggerService) { }

  ngOnInit(): void {
    this.logger.debug('init PokemonListComponent');
  }

}
