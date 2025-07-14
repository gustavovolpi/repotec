export enum TipoUsuario {
  ALUNO = 'aluno',
  PROFESSOR = 'professor',
  ADMIN = 'admin'
}

export const tipoUsuarioLabels: Record<TipoUsuario, string> = {
  [TipoUsuario.ALUNO]: 'Aluno',
  [TipoUsuario.PROFESSOR]: 'Professor',
  [TipoUsuario.ADMIN]: 'Administrador'
}; 