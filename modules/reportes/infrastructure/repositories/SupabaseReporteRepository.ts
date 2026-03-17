import type {
  CreateReporteDto,
  Reporte,
} from "../../domain/entities/Reporte";
import type { ReporteRepository } from "../../domain/repositories/ReporteRepository";
import { supabase } from "../../../../lib/supabase";

type ReporteRow = {
  id: number;
  user_id: string;
  no_casillero: number | null;
  fecha: string;
  reporte: string;
  created_at: string;
};

export class SupabaseReporteRepository implements ReporteRepository {
  private async getCurrentUserId(): Promise<string> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("No se encontró el usuario autenticado.");
    }

    return user.id;
  }

  async getReports(): Promise<Reporte[]> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("reportes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message || "No se pudieron obtener los reportes.");
    }

    return (data as ReporteRow[]).map((row) => ({
      id: row.id,
      userId: row.user_id,
      noCasillero: row.no_casillero,
      fecha: row.fecha,
      reporte: row.reporte,
      createdAt: row.created_at,
    }));
  }

  async createReport(data: CreateReporteDto): Promise<void> {
    const userId = await this.getCurrentUserId();

    const { error } = await supabase.from("reportes").insert({
      user_id: userId,
      no_casillero: data.noCasillero,
      fecha: data.fecha,
      reporte: data.reporte,
    });

    if (error) {
      throw new Error(error.message || "No se pudo guardar el reporte.");
    }
  }

  async getAssignedLockerNumber(): Promise<number | null> {
    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("casilleros")
      .select("no_casillero")
      .eq("asignado_a", userId)
      .maybeSingle();

    if (error) {
      throw new Error(
        error.message || "No se pudo consultar el casillero asignado."
      );
    }

    if (!data) return null;

    return data.no_casillero ?? null;
  }
}