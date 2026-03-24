import type { Casillero } from "../../domain/entities/Casillero";
import type { CasilleroRepository } from "../../domain/repositories/CasilleroRepository";

export async function getCasilleros(
  repository: CasilleroRepository
): Promise<Casillero[]> {
  return repository.getCasilleros();
}