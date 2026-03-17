import type { Casillero } from "../../domain/entities/Casillero";
import type { CasilleroRepository } from "../../domain/repositories/CasilleroRepository";

export async function getMiCasillero(
  casilleroRepository: CasilleroRepository
): Promise<Casillero | null> {
  return casilleroRepository.getMiCasillero();
}