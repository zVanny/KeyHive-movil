import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { login, register, logout } from "../../../../lib/auth";

export class SupabaseAuthRepository implements AuthRepository {
  async login(matricula: string, password: string): Promise<void> {
    return login(matricula, password);
  }

  async register(
    matricula: string,
    password: string,
    nombre: string,
    telefono?: string,
    carrera?: string
  ): Promise<void> {
    return register(matricula, password, nombre, telefono, carrera);
  }

  async logout(): Promise<void> {
    return logout();
  }
}