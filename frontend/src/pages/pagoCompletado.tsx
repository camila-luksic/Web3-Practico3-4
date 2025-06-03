import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { URLS } from "../navigation/constants";
import type { Compra } from "../models/compras";

const PaymentCompletedPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { success, purchaseData } = (location.state || {}) as { success?: boolean; purchaseData?: Compra };

    useEffect(() => {
        if (!success) {
            navigate(URLS.HOME);
        }
    }, [success, navigate]);

    if (!success) {
        return null;
    }

    return (
        <>
            <Menu />
            <Container>
                <Card title="¡Pago Completado!">
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                        <svg
                            className="w-16 h-16 text-green-500 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <h2 className="text-2xl font-bold text-green-700 mb-2">¡Tu compra ha sido registrada!</h2>
                        <p className="text-lg text-gray-700 mb-4">
                            Hemos recibido tu comprobante de pago. Tu compra está ahora en estado **"pendiente"** y será revisada pronto.
                        </p>

                        {purchaseData && (
                            <div className="bg-gray-100 p-4 rounded-lg w-full max-w-md text-left mb-6">
                                <h3 className="text-xl font-semibold mb-2">Detalles de la Compra:</h3>
                                <p><strong>ID de Compra:</strong> {purchaseData.id}</p>
                                <p><strong>Fecha:</strong> {new Date(purchaseData.fecha_compra).toLocaleDateString()}</p>
                                <p><strong>Total:</strong> ${parseFloat(purchaseData.total_compra).toFixed(2)}</p>
                                <p><strong>Estado:</strong> <span className="font-semibold capitalize">{purchaseData.estado}</span></p>
                                {purchaseData.comprobante_pago && (
                                    <p>
                                        <strong>Comprobante:</strong>{' '}
                                        <a
                                            href={purchaseData.comprobante_pago}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            Ver imagen
                                        </a>
                                    </p>
                                )}
                            </div>
                        )}

                        <Button
                            onClick={() => navigate(URLS.COMPRAS.LIST)}
                            variant="primary"
                            title="Ver Mis Compras"
                            />
                            <br></br>
                        <Button
                            onClick={() => navigate(URLS.HOME)}
                            title="Volver a la tienda"
                             />
                    </div>
                </Card>
            </Container>
        </>
    );
};

export default PaymentCompletedPage;