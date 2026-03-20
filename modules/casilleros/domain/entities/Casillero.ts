export type EstadoCasillero = "DISPONIBLE" | "OCUPADO" | "REPARACION";
export type EstadoSolicitud = "PENDIENTE" | "ASIGNADO" | "RECHAZADO" | "CANCELADO";

export interface Casillero {
  id: number;
  noCasillero: number;
  area: string;
  planta: string;
  estado: EstadoCasillero;
  disponible: boolean;
}

export interface PerfilAlumno {
  userId: string;
  nombre: string;
  matricula: string;
  carrera: string;
  telefono?: string | null;
  correo: string;
}

export interface MiCasillero {
  solicitudId: number;
  casilleroId: number;
  noCasillero: number;
  area: string;
  planta: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  estado: EstadoSolicitud;
  createdAt: string;
}

export interface CrearSolicitudCasilleroDto {
  casilleroId: number;
  fechaInicio: string;
  fechaFin: string;
}