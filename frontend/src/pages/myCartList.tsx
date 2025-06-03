/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { URLS } from "../navigation/constants";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";

import { carritoService } from "../services/carritoService";
import type { CarritoDetalle} from "../models/carritoDetalle"
import type { ItemCarrito } from "../models/itemCarrito";

const MyCartList = () => {
    const navigate = useNavigate();
    const { isAuthenticated} = useAuth();

    const [cartDetails, setCartDetails] = useState<CarritoDetalle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getMyCartDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await carritoService.getCartDetails();
            setCartDetails(data);
        } catch (err: any) {
            console.error("Error al obtener los detalles del carrito: ", err);
            setError(err.message || "Error al cargar el carrito.");

            if (err.message.includes("Tu carrito está vacío") || err.message.includes("not found")) {
                setCartDetails(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveBook = async (libroId: number) => {
        const confirmation = window.confirm("¿Está seguro de que desea eliminar este libro del carrito?");
        if (!confirmation) return;

        setLoading(true);
        try {
            await carritoService.removeBookFromCart(libroId);
            alert("Libro eliminado del carrito.");
            getMyCartDetails();
        } catch (err: any) {
            console.error("Error al eliminar el libro:", err);
            alert(err.message || "No se pudo eliminar el libro del carrito.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyCartDetails();
    }, []); 

    if (loading) {
        return (
            <>
                <Menu />
                <Container>
                    <Card title="Cargando Carrito...">
                        <p>Cargando los detalles de tu carrito...</p>
                    </Card>
                </Container>
            </>
        );
    }

    if (error && !cartDetails) {
        return (
            <>
                <Menu />
                <Container>
                    <Card title="Error al cargar el carrito">
                        <p className="text-red-600">{error}</p>
                        <Button onClick={() => navigate(URLS.LIBROS.LIST)}  title="Volver a la tienda"  />
                    </Card>
                </Container>
            </>
        );
    }

    if (!cartDetails || cartDetails.items.length === 0) {
        return (
            <>
                <Menu />
                <Container>
                    <Card title="Tu carrito está vacío">
                        <p>Parece que no tienes ningún libro en tu carrito todavía.</p>
                        <Button onClick={() => navigate(URLS.HOME)} variant="primary" title="Explorar libros"  />
                    </Card>
                </Container>
            </>
        );
    }

    return (
        <>
            <Menu />
            <Container>
                <Card title={`Mi Carrito `}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Portada</th>
                                <th>Libro</th>
                                <th>Autor</th>
                                <th>Precio Unitario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartDetails.items.map((item: ItemCarrito) => (
                                <tr key={item.id}>
                                    <td className="text-center border-t-1 border-gray-300 py-2">
                                        {item.libro.portada ? (
                                            <img
                                                src={item.libro.portada}
                                                alt={`Portada de ${item.libro.nombre}`}
                                                className="w-16 h-24 object-contain mx-auto"
                                            />
                                        ) : (
                                            <div className="w-16 h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-500 mx-auto">
                                                No Portada
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-left border-t-1 border-gray-300">{item.libro.nombre}</td>
                                    <td className="text-left border-t-1 border-gray-300">{item.libro.autor}</td>
                                    <td className="text-right border-t-1 border-gray-300">${parseFloat(item.precio_unitario_al_momento).toFixed(2)}</td>
                                    <td className="px-3 py-3 text-center border-t-1 border-gray-300">
                                        <Button
                                            onClick={() => handleRemoveBook(item.libro.id)}
                                            variant="danger"
                                            title="Eliminar"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="mt-6 pt-4 border-t border-gray-300 text-right">
                        <p className="text-lg font-semibold">Total de artículos: {cartDetails.calculated_total_items}</p>
                        <p className="text-xl font-bold text-blue-600">Subtotal: ${parseFloat(cartDetails.calculated_subtotal).toFixed(2)}</p>
                        <Button onClick={() => navigate(URLS.PAGO_CONFIRMACION)} title="Pagar" />
                    </div>
                </Card>
            </Container>
        </>
    );
};

export default MyCartList;