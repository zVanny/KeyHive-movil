import type {
  Casillero,
  CrearSolicitudCasilleroDto,
  MiCasillero,
  PerfilAlumno,
} from "../entities/Casillero";

export interface CasilleroRepository {
  getCasilleros(): Promise<Casillero[]>;
  getPerfilActual(): Promise<PerfilAlumno>;
  getMiCasillero(): Promise<MiCasillero | null>;
  crearSolicitudCasillero(data: CrearSolicitudCasilleroDto): Promise<void>;
}