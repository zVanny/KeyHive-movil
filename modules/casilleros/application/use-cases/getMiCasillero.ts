import { CasilleroRepository } from "../../domain/repositories/CasilleroRepository";

export async function getMiCasillero(casilleroRepository: CasilleroRepository) {
  return casilleroRepository.getMiCasillero();
}