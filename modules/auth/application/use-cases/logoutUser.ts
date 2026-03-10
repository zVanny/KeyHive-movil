import { AuthRepository } from "../../domain/repositories/AuthRepository";

export async function logoutUser(authRepository: AuthRepository) {
  return authRepository.logout();
}