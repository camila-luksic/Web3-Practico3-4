import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { libroService as LibroServiceClass } from "../services/libroService";
import type { BestsellerLibro } from "../models/libroApi";
import { URLS } from "../navigation/constants";

const TopBestsellersPage = () => {
    const navigate = useNavigate();
    const [bestsellers, setBestsellers] = useState<Array<BestsellerLibro>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const libroService = new LibroServiceClass();

    useEffect(() => {
        const fetchBestsellers = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await libroService.getTop10Bestsellers();
                setBestsellers(data);
            } catch (err: any) {
                console.error("Error fetching top bestsellers: ", err);
                setError(err.message || "Error al cargar los 10 libros más vendidos.");
            } finally {
                setLoading(false);
            }
        };

        fetchBestsellers();
    }, []);

    if (loading) {
        return (
            <>
                <Menu />
                <Container>
                    <h1>Top 10 Libros Más Vendidos</h1>
                    <p>Obteniendo los 10 libros más vendidos...</p>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Menu />
                <Container>
                    <h1>Error</h1>
                    <p className="text-red-600">{error}</p>
                    <Button onClick={() => navigate(URLS.HOME)} title="Volver al inicio" />
                </Container>
            </>
        );
    }

    return (
        <>
            <Menu />
            <div style={{ padding: "2rem" }}>
                <h1>Top 10 Libros Más Vendidos</h1>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                    {bestsellers.map((libro, index) => (
                        <div
                            key={libro.id}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "1rem",
                                width: "200px",
                                background: "#f9f9f9",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            {libro.portada && (
                                <img
                                    src={libro.portada}
                                    alt={`Portada de ${libro.nombre}`}
                                    style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                        marginBottom: "0.5rem",
                                        borderRadius: "4px",
                                    }}
                                />
                            )}
                            <h4>{index + 1}. {libro.nombre}</h4>
                            <p><strong>Autor:</strong> {libro.autor}</p>
                            <p><strong>Total Vendido:</strong> {libro.total_vendidos}</p>
                            <Button
                                onClick={() => navigate(URLS.LIBROS.DETAIL(libro.id.toString()))}
                                title="Ver Detalles"
                            />
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: "2rem" }}>
                    <Button onClick={() => navigate(URLS.HOME)} title="Volver al inicio" />
                </div>
            </div>
        </>
    );
};

export default TopBestsellersPage;
