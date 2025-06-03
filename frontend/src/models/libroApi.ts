
import type { Genero } from './genero';

export interface LibroFromAPI {
    portada: string;
    id: number;
    nombre: string;
    autor: string;
    descripcion: string;
    precio: number;
    isbn: string;
    generos?: (string | Genero)[];
}

export interface BestsellerLibro extends LibroFromAPI {
    total_vendidos: number;
}
