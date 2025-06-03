import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { URLS } from "../navigation/constants";
import { libroService } from "../services/libroService";
import type { LibroFromAPI } from "../models/libroApi";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { carritoService } from "../services/carritoService";

const DetalleLibro = () => {
  const navigate = useNavigate();
  useAuth();
  const { id } = useParams<{ id: string }>();

  const [libro, setLibro] = useState<LibroFromAPI | null>(null);
    const { isAuthenticated } = useAuth();
  

  useEffect(() => {
    if (id) {
      new libroService()
        .getlibro(id)
        .then((response) => {
          const processedLibro: LibroFromAPI = {
            ...response,
            id: Number(response.id),
            portada: String(response.portada)
          };
          setLibro(processedLibro);
        })
        .catch((error) => {
          console.error("Error al obtener el libro: ", error);
          navigate(URLS.LIBROS.LIST);
        });
    }
  }, [id, navigate]);

    const handleComprarClick = () => {
        if (!libro) {
            console.warn("No hay libro para añadir al carrito.");
            return;
        }

        if (!isAuthenticated) {
            alert("Debes iniciar sesión para agregar libros al carrito.");
            navigate(URLS.LOGIN);
            return;
        }

        carritoService.addBookToCart(libro.id)
            .then(response => {
                console.log("Respuesta del carrito:", response);
                alert(response.message || "Libro agregado al carrito con éxito!");
            })
            .catch(error => {
                console.error("Error al añadir al carrito:", error);
                alert(error.message || "No se pudo agregar el libro al carrito.");
            })
            .finally(() => {
            });
    };

  if (!libro) {
    return (
      <>
        <Menu />
        <Container>
          <Card title="Cargando Libro...">
            <p>Cargando detalles del libro...</p>
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <Menu />
      <Container>
       <Card title={libro.nombre}>
          <div className="flex flex-col md:flex-row gap-8 items-start"> 
            <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center md:justify-start">
              {libro.portada ? (
                <img
                  src={libro.portada}
                  alt={`Portada de ${libro.nombre}`}
                  className="max-w-xs md:max-w-full h-auto object-contain rounded-md shadow-md"
                  style={{ maxWidth: '250px', maxHeight: '350px' }}
                />
              ) : (
                <div className="max-w-xs md:max-w-full h-auto bg-gray-200 flex justify-center items-center text-gray-500 rounded-md shadow-md"
                     style={{ minHeight: '200px', maxWidth: '250px', maxHeight: '350px' }}>
                  No hay portada disponible
                </div>
              )}
            </div>

            <div className="flex-grow">
              <p className="mb-2">
                <strong className="font-semibold">Autor:</strong> {libro.autor}
              </p>
              <p className="mb-2">
                <strong className="font-semibold">Precio:</strong> ${libro.precio}
              </p>
              <p className="mb-2">
                <strong className="font-semibold">ISBN:</strong> {libro.isbn}
              </p>
              <p className="mb-4">
                <strong className="font-semibold">Descripción:</strong> {libro.descripcion}
              </p>
              {libro.generos && libro.generos.length > 0 && (
                <p className="mb-2">
                  <strong className="font-semibold">Géneros:</strong>{" "}
                  {libro.generos.map(g => typeof g === 'string' ? g : g.nombre).join(', ')}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleComprarClick} variant="primary" title="Comprar ahora" />
          </div>
        </Card>
      </Container>
    </>
  );
};

export default DetalleLibro;