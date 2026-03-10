export interface Casillero {
    id: number;
    no_casillero: number;
    area: string;
    planta: string;
    estado: string;
    asignado_a?: string | null;
  }