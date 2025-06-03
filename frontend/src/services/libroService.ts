import type{ BestsellerLibro, Libro } from "../models/libro"
import type { LibroFromAPI } from "../models/libroApi"
import apiClient from "./interceptors"

export class libroService {
    getlibros(): Promise<Array<LibroFromAPI>> {
        return new Promise<Array<LibroFromAPI>>((resolve, reject) => {
            apiClient.get("libros/")
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(new Error("Error al obtener las libros: " + error.message))
                })
        })
    }
    getlibro(id: string): Promise<Libro> {
        return new Promise<Libro>((resolve, reject) => {
            apiClient.get("libros/" + id + "/")
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(new Error("Error al obtener la libro: " + error.message))
                })
        })
    }
    getTop10Bestsellers(): Promise<Array<BestsellerLibro>> {
        return new Promise<Array<BestsellerLibro>>((resolve, reject) => {
            apiClient.get("/libros/top-10-bestsellers/")
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
                    reject(new Error("Error al obtener los top 10 más vendidos: " + errorMessage));
                });
        });
    }
    insertlibro(libro: Libro): Promise<Libro> {
        return new Promise<Libro>((resolve, reject) => {
            const formData = new FormData()
            formData.append("nombre", libro.nombre)
            formData.append("autor", libro.autor)
            formData.append("descripcion", libro.descripcion)
            formData.append("isbn", libro.isbn)
            formData.append("precio", libro.precio.toString())
            const file = libro.portada[0]
            if (libro.generos && libro.generos.length > 0) {
            libro.generos.forEach((generoId) => {
            formData.append("generos", generoId);  });
            }

            formData.append("portada", file)
            console.log(formData)
            apiClient.post("libros/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(new Error("Error al insertar el libro: " + error.message))
                })
        })
    }
   updatelibro(libro: Libro): Promise<Libro> {
    return new Promise<Libro>((resolve, reject) => {
        const formData = new FormData();
        formData.append("nombre", libro.nombre);
        formData.append("autor", libro.autor);
        formData.append("descripcion", libro.descripcion);
        formData.append("isbn", libro.isbn);
        formData.append("precio", libro.precio.toString());

        if (libro.portada && libro.portada.length > 0) {
            formData.append("portada", libro.portada[0]);
        }

        if (libro.generos && libro.generos.length > 0) {
            libro.generos.forEach((generoId) => {
                formData.append("generos_id", generoId);
            });
        }
 console.log(formData)
        apiClient.put("libros/" + libro.id + "/", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(new Error("Error al actualizar el libro: " + error.message));
            });
    });
}

    deletelibro(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            apiClient.delete("libros/" + id + '/')
                .then(() => {
                    resolve()
                })
                .catch((error) => {
                    reject(new Error("Error al eliminar la libro: " + error.message))
                })
        })
    }
}