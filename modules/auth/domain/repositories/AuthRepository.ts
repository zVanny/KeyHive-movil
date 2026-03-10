export interface AuthRepository {
    login(matricula: string, password: string): Promise<void>;
    register(
      matricula: string,
      password: string,
      nombre: string,
      telefono?: string,
      carrera?: string
    ): Promise<void>;
    logout(): Promise<void>;
  }