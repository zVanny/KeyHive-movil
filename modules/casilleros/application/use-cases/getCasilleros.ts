import { CasilleroRepository } from "../../domain/repositories/CasilleroRepository";

export async function getCasilleros(casilleroRepository: CasilleroRepository) {
  return casilleroRepository.getCasilleros();
}