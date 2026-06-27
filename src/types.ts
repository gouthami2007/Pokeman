export type PokemonType =
  | 'Fire'
  | 'Water'
  | 'Electric'
  | 'Grass'
  | 'Rock'
  | 'Ghost'
  | 'Dragon';

export interface Pokemon {
  id: number;
  name: string;
  type: PokemonType;
  secondaryType?: PokemonType;
  level: number;
  hp: number;
  attack: number;
  defense: number;
  description: string;
  spriteId: number;
}
