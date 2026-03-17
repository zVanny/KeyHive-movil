export interface Reporte {
  id: number;
  userId: string;
  noCasillero: number | null;
  fecha: string; // YYYY-MM-DD
  reporte: string;
  createdAt: string;
}

export interface CreateReporteDto {
  noCasillero: number | null;
  fecha: string; // YYYY-MM-DD
  reporte: string;
}