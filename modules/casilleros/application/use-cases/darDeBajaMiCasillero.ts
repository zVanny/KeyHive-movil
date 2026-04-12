import type { CasilleroRepository } from "../../domain/repositories/CasilleroRepository";

export async function darDeBajaMiCasillero(
  repository: CasilleroRepository
): Promise<void> {
  return repository.darDeBajaMiCasillero();
}