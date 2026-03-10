import { supabase } from "../../../../lib/supabase";
import { Casillero } from "../../domain/entities/Casillero";
import { CasilleroRepository } from "../../domain/repositories/CasilleroRepository";

export class SupabaseCasilleroRepository implements CasilleroRepository {
  async getCasilleros(): Promise<Casillero[]> {
    const { data, error } = await supabase
      .from("casilleros")
      .select("*")
      .order("no_casillero", { ascending: true });

    if (error) throw error;
    return (data as Casillero[]) ?? [];
  }

  async getMiCasillero(): Promise<Casillero | null> {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) return null;

    const { data, error } = await supabase
      .from("casilleros")
      .select("*")
      .eq("asignado_a", userId)
      .maybeSingle();

    if (error) throw error;
    return (data as Casillero) ?? null;
  }
}