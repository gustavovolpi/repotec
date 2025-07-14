import { Usuario } from '../services/usuarios.service';

export interface Tag {
  id?: number;
  nome: string;
}

export interface Avaliacao {
  id: number;
  nota: number;
  comentario: string;
  autor: { 
    id: number; 
    nome: string;
    imagemPerfil?: {
      id: number;
      url: string;
    };
  };
}

export enum TipoProjeto {
  TCC = 'TCC',
  ARTIGO = 'Artigo Científico',
  OUTROS = 'Outros'
}

// Define o formato das opções para o react-select
export interface TipoProjetoOption {
  value: TipoProjeto;
  label: string;
}

// Cria as opções a partir do enum para serem usadas com react-select
export const tipoProjetoOptions: TipoProjetoOption[] = [
  { value: TipoProjeto.TCC, label: 'TCC' },
  { value: TipoProjeto.ARTIGO, label: 'Artigo Científico' },
  { value: TipoProjeto.OUTROS, label: 'Outros' },
];

export interface Arquivo {
  id: number;
  nome: string;
  url: string;
}

export interface Projeto {
  id: number;
  titulo: string;
  descricao: string;
  semestre: string;
  reputacao: number;
  autor: Usuario;
  professorOrientador?: string;
  autorArquivos?: string;
  tags: Tag[];
  arquivos: Arquivo[];
  avaliacoes: Avaliacao[];
  tipoProjeto: TipoProjeto;
  dataCriacao: Date;
  dataAtualizacao: Date;
} 