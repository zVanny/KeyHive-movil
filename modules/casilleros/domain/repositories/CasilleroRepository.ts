import type {
  Casillero,
  CrearSolicitudCasilleroDto,
  MiPerfilCasillero,
} from "../entities/Casillero";

export interface CasilleroRepository {
  getCasilleros(): Promise<Casillero[]>;
  getMiCasillero(): Promise<Casillero | null>;
  getMiPerfil(): Promise<MiPerfilCasillero>;
  crearSolicitud(data: CrearSolicitudCasilleroDto): Promise<void>;
}