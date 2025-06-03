import type { Genero } from "../models/genero";
import apiClient from "./interceptors";

export class GeneroService {
    getGeneros(): Promise<Array<Genero>> {
        return new Promise<Array<Genero>>((resolve, reject) => {
            apiClient.get("/generos/")
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener los géneros: " + error.message));
                });
        });
    }

    getGenero(id: string): Promise<Genero> {
        return new Promise<Genero>((resolve, reject) => {
            apiClient.get(`/generos/${id}/`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener el género: " + error.message));
                });
        });
    }

    insertGenero(genero: Genero): Promise<Genero> {
        return new Promise<Genero>((resolve, reject) => {
            console.log("Enviando género:", genero);
            const generoData = JSON.parse(JSON.stringify(genero));
            apiClient.post("/generos/", generoData)
                .then((response) => {
                    console.log("Respuesta del servidor:", response.data);
                    resolve(response.data);
                })
                .catch((error) => {
                    console.error("Error completo:", error);
                    reject(new Error("Error al insertar el género: " + 
                        (error.response?.data?.detail || error.message)));
                });
        });
    }
    
    updateGenero(genero: Genero): Promise<Genero> {
        return new Promise<Genero>((resolve, reject) => {
            apiClient.put(`/generos/${genero.id}/`, genero)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al actualizar el género: " + error.message));
                });
        });
    }

    deleteGenero(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            apiClient.delete(`/generos/${id}/`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(new Error("Error al eliminar el género: " + error.message));
                });
        });
    }
}