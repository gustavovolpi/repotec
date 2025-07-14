export interface ListagemPaginada<T> {
  dados: T[];
  meta: {
    total: number;
    pagina: number;
    ultimaPagina: number;
    limite: number;
  };
} 