import axios from "axios";
import { AuthService } from "./AuthService";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/proxy/",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    withCredentials: true
});
//cuando la petición se va a enviar a la API, se ejecuta este interceptor
apiClient.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    console.error("Error en la solicitud a la API: ", error);
    return Promise.reject(error);
});
//cuando la petición ya llegó a la API y se recibe una respuesta, se ejecuta este interceptor
apiClient.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        console.log("--- Interceptor de Axios ---");
        console.log("Respuesta de error recibida:", error.response?.status, error.response?.data);

        if (error.response && error.response.status === 401) {
            console.log("Status 401 detectado. Intentando refrescar token...");
            try {
                await new AuthService().refreshToken();
                console.log("Refresh token exitoso. Reintentando petición original.");
                return apiClient.request(error.config);
            } catch (authError: any) {
                console.error("⛔ Refresh token FALLÓ:", authError.message || authError);
                console.error("Detalle del error de refresh:", authError.response?.data);
                /*
                if (window.location.pathname !== '/login') {
                    console.log("Redirigiendo a /login...");
                    window.location.href = '/login';
                }
                    */
                return Promise.reject(authError);
            }
        }
        console.error("Otro tipo de error en la respuesta de la API:", error);
        return Promise.reject(error);
    }
);
export default apiClient;