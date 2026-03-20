import type { CrearSolicitudCasilleroDto } from "../../domain/entities/Casillero";
import type { CasilleroRepository } from "../../domain/repositories/CasilleroRepository";

export async function crearSolicitudCasillero(
  repository: CasilleroRepository,
  data: CrearSolicitudCasilleroDto
): Promise<void> {
  return repository.crearSolicitudCasillero(data);
}