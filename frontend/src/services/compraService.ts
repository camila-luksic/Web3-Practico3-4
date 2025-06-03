
import apiClient from "./interceptors";
import type { Compra } from "../models/compras";

class CompraService {
    getCompras(): Promise<Array<Compra>> {
        return new Promise<Array<Compra>>((resolve, reject) => {
            apiClient.get("/compras/")
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
                    reject(new Error("Error al obtener las compras: " + errorMessage));
                });
        });
    }

    getCompraById(id: string): Promise<Compra> {
        return new Promise<Compra>((resolve, reject) => {
            apiClient.get(`/compras/${id}/`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
                    reject(new Error("Error al obtener el detalle de la compra: " + errorMessage));
                });
        });
    }
}

export const compraService = new CompraService();