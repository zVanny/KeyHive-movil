import type { Reporte } from "../../domain/entities/Reporte";
import type { ReporteRepository } from "../../domain/repositories/ReporteRepository";

export async function getReports(
  reporteRepository: ReporteRepository
): Promise<Reporte[]> {
  return reporteRepository.getReports();
}