import { AuthRepository } from "../../domain/repositories/AuthRepository";

export async function loginUser(
  authRepository: AuthRepository,
  matricula: string,
  password: string
) {
  return authRepository.login(matricula, password);
}