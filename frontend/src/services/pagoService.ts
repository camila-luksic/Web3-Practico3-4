/* eslint-disable @typescript-eslint/no-explicit-any */

import apiClient from "./interceptors";

class ImageUploadService {
    uploadImage(formData: FormData): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            apiClient.post("/carritos/confirm-payment/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
                reject(new Error("Error al subir la imagen: " + errorMessage));
            });
        });
    }
}

export const imageUploadService = new ImageUploadService();