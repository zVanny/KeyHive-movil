import { supabase } from "../../../../lib/supabase";
import type {
  Casillero,
  CrearSolicitudCasilleroDto,
  EstadoSolicitud,
  MiCasillero,
  PerfilAlumno,
} from "../../domain/entities/Casillero";
import type { CasilleroRepository } from "../../domain/repositories/CasilleroRepository";

type CasilleroRow = {
  id: number;
  no_casillero: number;
  area: string;
  planta: string;
  estado: "DISPONIBLE" | "OCUPADO" | "REPARACION";
  asignado_a: string | null;
};

type SolicitudBloqueanteRow = {
  casillero_id: number | null;
  estado: EstadoSolicitud;
};

type PerfilRow = {
  user_id: string;
  matricula: string;
  nombre: string;
  telefono: string | null;
  carrera: string;
};

type MiSolicitudRow = {
  id: number;
  casillero_id: number;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estado: EstadoSolicitud;
  created_at: string;
  casilleros: {
    id: number;
    no_casillero: number;
    area: string;
    planta: string;
  } | null;
};

export class SupabaseCasilleroRepository implements CasilleroRepository {
  private async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("No se encontró el usuario autenticado.");
    }

    return user;
  }

  async getCasilleros(): Promise<Casillero[]> {
    const { data: casillerosData, error: casillerosError } = await supabase
      .from("casilleros")
      .select("id, no_casillero, area, planta, estado, asignado_a")
      .order("no_casillero", { ascending: true });

    if (casillerosError) {
      throw new Error(casillerosError.message || "No se pudieron cargar los casilleros.");
    }

    const { data: solicitudesData, error: solicitudesError } = await supabase
      .from("solicitudes_casillero")
      .select("casillero_id, estado")
      .in("estado", ["PENDIENTE", "ASIGNADO"]);

    if (solicitudesError) {
      throw new Error(solicitudesError.message || "No se pudieron cargar las solicitudes.");
    }

    const casillerosBloqueados = new Set(
      ((solicitudesData ?? []) as SolicitudBloqueanteRow[])
        .map((item) => item.casillero_id)
        .filter((id): id is number => id !== null)
    );

    return ((casillerosData ?? []) as CasilleroRow[]).map((row) => {
      const bloqueadoPorSolicitud = casillerosBloqueados.has(row.id);
      const disponible =
        row.estado === "DISPONIBLE" &&
        row.asignado_a === null &&
        !bloqueadoPorSolicitud;

      return {
        id: row.id,
        noCasillero: row.no_casillero,
        area: row.area,
        planta: row.planta,
        estado: disponible ? "DISPONIBLE" : row.estado === "REPARACION" ? "REPARACION" : "OCUPADO",
        disponible,
      };
    });
  }

  async getPerfilActual(): Promise<PerfilAlumno> {
    const user = await this.getCurrentUser();

    const { data, error } = await supabase
      .from("perfiles")
      .select("user_id, matricula, nombre, telefono, carrera")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message || "No se pudo cargar el perfil del alumno.");
    }

    if (!data) {
      throw new Error("No existe un perfil para este usuario.");
    }

    const perfil = data as PerfilRow;

    return {
      userId: perfil.user_id,
      nombre: perfil.nombre,
      matricula: perfil.matricula,
      carrera: perfil.carrera,
      telefono: perfil.telefono,
      correo: user.email ?? "",
    };
  }

  async getMiCasillero(): Promise<MiCasillero | null> {
    const user = await this.getCurrentUser();

    const { data, error } = await supabase
      .from("solicitudes_casillero")
      .select(`
        id,
        casillero_id,
        fecha_inicio,
        fecha_fin,
        estado,
        created_at,
        casilleros (
          id,
          no_casillero,
          area,
          planta
        )
      `)
      .eq("user_id", user.id)
      .in("estado", ["PENDIENTE", "ASIGNADO"])
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (error) {
      throw new Error(error.message || "No se pudo consultar tu casillero.");
    }

    if (!data) return null;

    const row = data as unknown as MiSolicitudRow;

    if (!row.casilleros) return null;

    return {
      solicitudId: row.id,
      casilleroId: row.casillero_id,
      noCasillero: row.casilleros.no_casillero,
      area: row.casilleros.area,
      planta: row.casilleros.planta,
      fechaInicio: row.fecha_inicio,
      fechaFin: row.fecha_fin,
      estado: row.estado,
      createdAt: row.created_at,
    };
  }

  async crearSolicitudCasillero(data: CrearSolicitudCasilleroDto): Promise<void> {
    const user = await this.getCurrentUser();

    const solicitudActual = await this.getMiCasillero();
    if (solicitudActual) {
      throw new Error("Ya tienes una solicitud o un casillero asignado.");
    }

    const { data: casilleroData, error: casilleroError } = await supabase
      .from("casilleros")
      .select("id, no_casillero, area, planta, estado, asignado_a")
      .eq("id", data.casilleroId)
      .maybeSingle();

    if (casilleroError) {
      throw new Error(casilleroError.message || "No se pudo validar el casillero.");
    }

    if (!casilleroData) {
      throw new Error("El casillero seleccionado no existe.");
    }

    const casillero = casilleroData as CasilleroRow;

    if (casillero.estado !== "DISPONIBLE" || casillero.asignado_a !== null) {
      throw new Error("Ese casillero ya no está disponible.");
    }

    const { data: solicitudDeEseCasillero, error: bloqueoError } = await supabase
      .from("solicitudes_casillero")
      .select("id")
      .eq("casillero_id", data.casilleroId)
      .in("estado", ["PENDIENTE", "ASIGNADO"])
      .maybeSingle();

    if (bloqueoError) {
      throw new Error(bloqueoError.message || "No se pudo validar la solicitud del casillero.");
    }

    if (solicitudDeEseCasillero) {
      throw new Error("Ese casillero ya fue solicitado por otro alumno.");
    }

    const { error: insertError } = await supabase.from("solicitudes_casillero").insert({
      user_id: user.id,
      casillero_id: data.casilleroId,
      area: casillero.area,
      planta: casillero.planta,
      fecha_inicio: data.fechaInicio,
      fecha_fin: data.fechaFin,
      estado: "PENDIENTE",
    });

    if (insertError) {
      throw new Error(insertError.message || "No se pudo guardar la solicitud.");
    }
  }
}