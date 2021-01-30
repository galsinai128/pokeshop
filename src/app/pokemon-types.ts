export class PokemonsResponse {
    results: Pokemon[];
}

export class Pokemon {
    name: string;
    isOnCart: boolean;
    imageUrl: string;
}