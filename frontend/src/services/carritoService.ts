/* eslint-disable @typescript-eslint/no-explicit-any */


import type { CarritoDetalle } from "../models/carritoDetalle";
import apiClient from "./interceptors";

class CarritoService {

    addBookToCart(libroId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            apiClient.post("/carritos/add-book/", { libro_id: libroId })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
                    reject(new Error("Error al agregar el libro al carrito: " + errorMessage));
                });
        });
    }

    removeBookFromCart(libroId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            apiClient.post("/carritos/remove-book/", { libro_id: libroId })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
                    reject(new Error("Error al eliminar el libro del carrito: " + errorMessage));
                });
        });
    }

    getCartDetails(): Promise<CarritoDetalle> {
        return new Promise<CarritoDetalle>((resolve, reject) => {
            apiClient.get("/carritos/my-cart/")
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
                    reject(new Error("Error al obtener los detalles del carrito: " + errorMessage));
                });
        });
    }

}

export const carritoService = new CarritoService();