/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { URLS } from "../navigation/constants";

import { compraService } from "../services/compraService";
import type { Compra } from "../models/compras";

const MyPurchasesList = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [compras, setCompras] = useState<Array<Compra>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getMyPurchases = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await compraService.getCompras();
            setCompras(response);
        } catch (err: any) {
            console.error("Error al obtener mis compras: ", err);
            setError(err.message || "Error al cargar el historial de compras.");
        } finally {
            setLoading(false);
        }
    };

      useEffect(() => {
        getMyPurchases();
    }, [])
    if (loading) {
        return (
            <>
                <Menu />
                <Container>
                    <Card title="Cargando Mis Compras...">
                        <p>Cargando tu historial de compras...</p>
                    </Card>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Menu />
                <Container>
                    <Card title="Error al cargar compras">
                        <p className="text-red-600">{error}</p>
                        <Button onClick={() => navigate(URLS.HOME)}  title="Volver al inicio"  />
                    </Card>
                </Container>
            </>
        );
    }

    if (compras.length === 0) {
        return (
            <>
                <Menu />
                <Container>
                    <Card title="No tienes compras realizadas">
                        <p>Tu historial de compras está vacío.</p>
                        <Button onClick={() => navigate(URLS.LIBROS.LIST)} variant="primary" title="Explorar libros"  />
                    </Card>
                </Container>
            </>
        );
    }

    return (
        <>
            <Menu />
            <Container>
                <Card title="Mis Compras">
                    <Table>
                        <thead>
                            <tr>
                                <th>ID Compra</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Comprobante</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {compras.map((compra) => (
                                <tr key={compra.id}>
                                    <td className="text-center border-t-1 border-gray-300">{compra.id}</td>
                                    <td className="text-center border-t-1 border-gray-300">{new Date(compra.fecha_compra).toLocaleDateString()}</td>
                                    <td className="text-right border-t-1 border-gray-300">${parseFloat(compra.total_compra).toFixed(2)}</td>
                                    <td className="text-center border-t-1 border-gray-300 capitalize">{compra.estado}</td>
                                    <td className="text-center border-t-1 border-gray-300">
                                        {compra.comprobante_pago ? (
                                            <a
                                                href={compra.comprobante_pago}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                Ver
                                            </a>
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                    <td className="px-3 py-3 text-center border-t-1 border-gray-300">
                                        <Button
                                            onClick={() => navigate(URLS.COMPRAS.DETAIL(compra.id.toString()))}
                                            title="Detalles"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            </Container>
        </>
    );
};

export default MyPurchasesList;