import { AuthRepository } from "../../domain/repositories/AuthRepository";

export async function registerUser(
  authRepository: AuthRepository,
  matricula: string,
  password: string,
  nombre: string,
  telefono?: string,
  carrera?: string
) {
  return authRepository.register(matricula, password, nombre, telefono, carrera);
}