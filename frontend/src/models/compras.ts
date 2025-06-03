
export interface Compra {
    id: number;
    usuario_username: string;
    fecha_compra: string;
    total_compra: string;
    comprobante_pago: string | null;
    estado: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items_comprados?: any[];
}