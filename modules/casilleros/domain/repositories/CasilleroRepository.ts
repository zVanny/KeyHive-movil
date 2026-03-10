import { Casillero } from "../entities/Casillero";

export interface CasilleroRepository {
  getCasilleros(): Promise<Casillero[]>;
  getMiCasillero(): Promise<Casillero | null>;
}