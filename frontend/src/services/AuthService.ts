import axios from "axios";
import type { LoginResponse } from "../models/dto/LoginResponse";
import type { RefreshTokenResponse } from "../models/dto/RefreshTokenResponse";
import type { RegisterResponse } from "../models/dto/RegisterResponse";
import apiClient from "./interceptors";
import Cookies from 'js-cookie';

export class AuthService {
    login(username: string, password: string): Promise<LoginResponse> {
        return new Promise<LoginResponse>((resolve, reject) => {
            axios.post("http://localhost:3000/auth/login/", {
                username: username,
                password: password
            }, { withCredentials: true }).then((response) => {
                resolve(response.data)
            }).catch((error) => {
                reject(new Error("Error al iniciar sesión: " + error.message))
            })
        });
    }
    refreshToken(): Promise<RefreshTokenResponse> {
        return new Promise<RefreshTokenResponse>((resolve, reject) => {
             const refreshTokenValue = Cookies.get('refresh');
             console.log("refresh token:"+refreshTokenValue)

        if (!refreshTokenValue) {
            return reject(new Error("No refresh token found in cookies."));
        }
            axios.post("http://localhost:3000/auth/refresh/", { refresh: refreshTokenValue}, {
                withCredentials: true
            }).then((response) => {
                  console.log("AuthService.refreshToken: Refresh exitoso, respuesta:", response.data)
                resolve(response.data)
            }).catch((error) => {
                console.error("AuthService.refreshToken: Error en la llamada al refresh:", error.response?.status, error.response?.data, error.message);
                reject(new Error("Error al refrescar el token: " + error.message))
            })
        });
    }
    logout(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            apiClient.post("http://localhost:3000/auth/logout/").then((response) => {
                resolve(response.data)
            }).catch((error) => {
                reject(new Error("Error al cerrar sesión: " + error.message))
            })
        });
    }

    register(email: string, password: string): Promise<RegisterResponse> {
        return new Promise<RegisterResponse>((resolve, reject) => {
            axios.post("http://localhost:8000/libreria/auth/register/", {
                email,
                password
            }).then((response) => {
                resolve(response.data)
            }).catch((error) => {
                reject(new Error("Error al registrar el usuario: " + error.message))
            })
        });
    }
}