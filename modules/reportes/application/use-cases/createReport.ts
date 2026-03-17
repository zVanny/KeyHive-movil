import type { CreateReporteDto } from "../../domain/entities/Reporte";
import type { ReporteRepository } from "../../domain/repositories/ReporteRepository";

export async function createReport(
  reporteRepository: ReporteRepository,
  data: CreateReporteDto
): Promise<void> {
  return reporteRepository.createReport(data);
}