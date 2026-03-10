import { ReporteRepository } from "../../domain/repositories/ReporteRepository";

export async function getReportes(reporteRepository: ReporteRepository) {
  return reporteRepository.getReportes();
}