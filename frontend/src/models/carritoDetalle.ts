import type { ItemCarrito } from "./itemCarrito";


export interface CarritoDetalle {
    id: number;
    usuario: number;
    sesion_key: string | null;
    activo: boolean;
    fecha_creacion: string;
    fecha_actualizacion: string;
    items: ItemCarrito[];
    calculated_total_items: number;
    calculated_subtotal: string;
}