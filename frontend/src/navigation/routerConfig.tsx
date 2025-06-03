import { Routes, Route } from "react-router";
import { URLS } from "./constants";
import { GeneroForm } from "../pages/generoForm";
import GeneroList from "../pages/generoList";
import { LoginForm } from "../pages/loginForm";
import { RegisterForm } from "../pages/registerForm";
import { LibroForm } from "../pages/libroForm";
import LibroList from "../pages/libroList";
import Home from "../Home";
import DetalleLibro from "../pages/detalleLibro";
import MyCartList from "../pages/myCartList";
import PaymentConfirmationPage from "../pages/pago";
import MyPurchasesList from "../pages/comprasList";
import PurchaseDetailsPage from "../pages/comprasDetalle";
import PaymentCompletedPage from "../pages/pagoCompletado";
import TopBestsellersPage from "../pages/topSellers";

const RouterConfig = () => {
    return (
        <Routes>
            <Route path={URLS.HOME} element={< Home/>} />
            <Route path={URLS.LIBROS.DETAIL(':id')} element={<DetalleLibro />} />
            <Route path={URLS.LOGIN} element={< LoginForm />} />
            <Route path={URLS.REGISTER} element={< RegisterForm />} />
            <Route path={URLS.GENEROS.LIST} element={< GeneroList />} />
            <Route path={URLS.GENEROS.CREATE} element={< GeneroForm />} />
            <Route path={URLS.GENEROS.EDIT} element={< GeneroForm />} />
            <Route path={URLS.LIBROS.LIST} element={< LibroList />} />
            <Route path={URLS.LIBROS.EDIT} element={< LibroForm />} />
            <Route path={URLS.LIBROS.CREATE} element={< LibroForm />} />
            <Route path={URLS.CARRITO} element={<MyCartList />} />
            <Route path={URLS.PAGO_CONFIRMACION} element={<PaymentConfirmationPage />} />
            <Route path={URLS.PAGO_COMPLETADO} element={<PaymentCompletedPage />} />
            <Route path={URLS.COMPRAS.LIST} element={<MyPurchasesList />} />
            <Route path={URLS.COMPRAS.DETAIL(':id')} element={<PurchaseDetailsPage />} />
            <Route path={URLS.TOP_SELLERS} element={<TopBestsellersPage/>}/>
        </Routes>
    );
}
export default RouterConfig;