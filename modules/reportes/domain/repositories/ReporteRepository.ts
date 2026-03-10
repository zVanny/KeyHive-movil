import { Reporte } from "../entities/Reporte";

export interface ReporteRepository {
  getReportes(): Promise<Reporte[]>;
}