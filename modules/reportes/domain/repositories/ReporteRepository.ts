import type { CreateReporteDto, Reporte } from "../entities/Reporte";

export interface ReporteRepository {
  getReports(): Promise<Reporte[]>;
  createReport(data: CreateReporteDto): Promise<void>;
  getAssignedLockerNumber(): Promise<number | null>;
}