
import type { LibroFromAPI } from "./libroApi";

export interface ItemCarrito {
    id: number;
    carrito: number;
    libro: LibroFromAPI;
    precio_unitario_al_momento: string;
    cantidad?: number;
}

