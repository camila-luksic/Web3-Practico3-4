
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser, logoutUser } from "../redux/slices/authSlice";
import { AuthService } from "../services/AuthService";
import { useEffect } from "react";
import Cookies from "js-cookie";

type LoginParams = {
    access_token: string;
    refresh_token: string;
    email: string;
};

interface AuthHookReturn {
    email: string | null;
    isAuthenticated: boolean;
    doLogin: (params: LoginParams) => void;
    doLogout: () => void;
}

export const useAuth = (): AuthHookReturn => {
    const dispatch = useAppDispatch();
    const email = useAppSelector((state) => state.auth.email);
    const isAuthenticated = !!email;

    useEffect(() => {
        if (!isAuthenticated) {
            const accessToken = Cookies.get("access");
            const refreshToken = Cookies.get("refresh");
            const userEmail = Cookies.get("user_email");

            if (accessToken && refreshToken && userEmail) {
                dispatch(loginUser(userEmail));
                console.log("Re-authenticated from cookies.");
            }
        }
    }, [dispatch, isAuthenticated]);

    const doLogin = (params: LoginParams) => {
        dispatch(loginUser(params.email));
    };

    const doLogout = () => {
        new AuthService()
            .logout()
            .then(() => {
                dispatch(logoutUser());
                Cookies.remove("access");
                Cookies.remove("refresh");
                Cookies.remove("user_email");
            })
            .catch((error) => {
                console.error("Error al cerrar sesión: ", error);
            });
    };

    return { email, isAuthenticated, doLogin, doLogout };
};