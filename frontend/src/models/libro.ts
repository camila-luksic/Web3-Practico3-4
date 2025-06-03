
export interface Libro {
    portada: string|FileList  ;
    id: string;
    nombre: string;
    autor:string;
    descripcion:string;
    precio:number;
    isbn:string;
    generos?: string[]

}
