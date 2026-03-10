import { supabase } from "../../../../lib/supabase";
import { Reporte } from "../../domain/entities/Reporte";
import { ReporteRepository } from "../../domain/repositories/ReporteRepository";

export class SupabaseReporteRepository implements ReporteRepository {
  async getReportes(): Promise<Reporte[]> {
    const { data, error } = await supabase
      .from("reportes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Reporte[]) ?? [];
  }
}