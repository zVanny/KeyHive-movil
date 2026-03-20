import type { MiCasillero } from "../../domain/entities/Casillero";
import type { CasilleroRepository } from "../../domain/repositories/CasilleroRepository";

export async function getMiCasillero(
  repository: CasilleroRepository
): Promise<MiCasillero | null> {
  return repository.getMiCasillero();
}