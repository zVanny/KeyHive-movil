export type EstadoCasillero = "DISPONIBLE" | "OCUPADO" | "REPARACION";

export interface Casillero {
  id: number;
  noCasillero: number;
  area: string;
  planta: string;
  estado: EstadoCasillero;
  asignadoA: string | null;
  asignadoEn: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
}

export interface MiPerfilCasillero {
  userId: string;
  matricula: string;
  nombre: string;
  telefono: string | null;
  carrera: string | null;
  correo: string;
}

export interface CrearSolicitudCasilleroDto {
  casilleroId: number;
  fechaInicio: string;
  fechaFin: string;
}