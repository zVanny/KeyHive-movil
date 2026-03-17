import type { Casillero } from "../../domain/entities/Casillero";
import type { CasilleroRepository } from "../../domain/repositories/CasilleroRepository";

export async function getCasilleros(
  casilleroRepository: CasilleroRepository
): Promise<Casillero[]> {
  return casilleroRepository.getCasilleros();
}