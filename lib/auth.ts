import { supabase } from "./supabase";

export function matriculaToEmail(matricula: string) {
  const clean = (matricula ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[,;]/g, ""); // por si meten coma sin querer

  // valida: solo números (ajusta el rango si tu matrícula tiene otro formato)
  if (!/^\d{4,20}$/.test(clean)) {
    throw new Error("La matrícula debe contener solo números (sin espacios).");
  }

  return `${clean}@keyhive.com`;
}

export async function login(matricula: string, password: string) {
  const email = matriculaToEmail(matricula);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
}

export async function register(
  matricula: string,
  password: string,
  nombre: string,
  telefono?: string,
  carrera?: string
) {
  const email = matriculaToEmail(matricula);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // IMPORTANTE: asegúrate que tengas sesión o user
  const userId = data.user?.id;
  if (!userId) throw new Error("No se pudo crear el usuario.");

  const { error: profileError } = await supabase.from("perfiles").insert({
    user_id: userId,
    matricula: matricula.trim(),
    nombre: nombre.trim(),
    telefono: telefono?.trim() ?? null,
    carrera: carrera?.trim() ?? null,
  });

  if (profileError) throw profileError;
}

export async function logout() {
  await supabase.auth.signOut();
}