/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { URLS } from "../navigation/constants";
import { compraService } from "../services/compraService";
import type { Compra } from "../models/compras";
import { Table } from "../components/Table";

const PurchaseDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [compra, setCompra] = useState<Compra | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!id) {
            setError("ID de compra no especificado.");
            setLoading(false);
            return;
        }

        const getPurchaseDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await compraService.getCompraById(id);
                setCompra(data);
            } catch (err: any) {
                console.error("Error al obtener detalles de la compra:", err);
                setError(err.message || "Error al cargar los detalles de la compra.");
            } finally {
                setLoading(false);
            }
        };

        getPurchaseDetails();
    }, [id]);

    if (loading) {
        return (
            <>
                <Menu />
                <Container>
                    <Card title="Cargando Detalles de Compra...">
                        <p>Cargando información de tu compra...</p>
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
                    <Card title="Error al cargar los detalles">
                        <p className="text-red-600">{error}</p>
                        <Button onClick={() => navigate(URLS.COMPRAS.LIST)}  title="Volver a Mis Compras" />
                    </Card>
                </Container>
            </>
        );
    }

    if (!compra) {
        return (
            <>
                <Menu />
                <Container>
                    <Card title="Compra no encontrada">
                        <p>La compra solicitada no existe o no tienes permiso para verla.</p>
                        <Button onClick={() => navigate(URLS.COMPRAS.LIST)}  title="Volver a Mis Compras" />
                    </Card>
                </Container>
            </>
        );
    }

    return (
        <>
            <Menu />
            <Container>
                <Card title={`Detalles de Compra #${compra.id}`}>
                    <div className="p-4">
                        <p className="mb-2"><strong>Usuario:</strong> {compra.usuario_username}</p>
                        <p className="mb-2"><strong>Fecha de Compra:</strong> {new Date(compra.fecha_compra).toLocaleString()}</p>
                        <p className="mb-2"><strong>Total:</strong> ${parseFloat(compra.total_compra).toFixed(2)}</p>
                        <p className="mb-2"><strong>Estado:</strong> <span className="font-semibold capitalize">{compra.estado}</span></p>

                        {compra.comprobante_pago && (
                            <div className="mb-4">
                                <p className="font-semibold mb-2">Comprobante de Pago:</p>
                                <a
                                    href={compra.comprobante_pago}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline block mb-2"
                                >
                                    <img
                                        src={compra.comprobante_pago}
                                        alt="Comprobante de Pago"
                                        className="max-w-xs h-auto border border-gray-300 rounded-lg shadow-md"
                                        style={{ maxHeight: '200px' }}
                                    />
                                    Clic para ver en grande
                                </a>
                            </div>
                        )}

                        <h3 className="text-xl font-semibold mt-6 mb-3">Artículos Comprados:</h3>
                        {compra.items_comprados && compra.items_comprados.length > 0 ? (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Libro</th>
                                        <th>Autor</th>
                                        <th>Precio Unitario</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {compra.items_comprados.map((item: any) => (
                                        <tr key={item.id}>
                                            <td className="text-left border-t-1 border-gray-300">{item.libro.nombre}</td>
                                            <td className="text-left border-t-1 border-gray-300">{item.libro.autor}</td>
                                            <td className="text-right border-t-1 border-gray-300">${parseFloat(item.precio_unitario_al_momento).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>No hay artículos asociados a esta compra.</p>
                        )}

                        <Button onClick={() => navigate(URLS.COMPRAS.LIST)}  title="Volver a Mis Compras" />
                    </div>
                </Card>
            </Container>
        </>
    );
};

export default PurchaseDetailsPage;