import type { MiPerfilCasillero } from "../../domain/entities/Casillero";
import type { CasilleroRepository } from "../../domain/repositories/CasilleroRepository";

export async function getMiPerfil(
  casilleroRepository: CasilleroRepository
): Promise<MiPerfilCasillero> {
  return casilleroRepository.getMiPerfil();
}