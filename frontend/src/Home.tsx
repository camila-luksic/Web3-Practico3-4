import { useEffect, useState } from "react";
import { libroService } from "./services/libroService";
import { GeneroService } from "./services/generoService";
import type { LibroFromAPI } from "./models/libroApi";
import type { Libro} from "./models/libro";
import type { Genero } from "./models/genero";
import { Menu } from "./components/Menu";
import { Button } from "./components/Button";
import { useNavigate } from "react-router-dom";
import { URLS } from "./navigation/constants";

type LibroForDisplay = Omit<Libro, 'portada' | 'id' | 'generos'> & {
    portada: string;
    id: number;
    generos?: string[];
};


export default function App() {
  const [libros, setLibros] = useState<LibroForDisplay[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const librosData: LibroFromAPI[] = await new libroService().getlibros();
        const generosData = await new GeneroService().getGeneros();

        console.log("### Datos de Libros recibidos (raw desde API):", librosData);
        console.log("### Datos de Géneros recibidos (raw desde API):", generosData);

        const normalizedLibros: LibroForDisplay[] = librosData.map(libro => {
            const normalizedGeneros: string[] = [];
            if (libro.generos) {
                libro.generos.forEach(gen => {
                    if (typeof gen === 'string') {
                      normalizedGeneros.push(gen);
                    } else if (typeof gen === 'object' && gen !== null && 'id' in gen) {
                        normalizedGeneros.push(String(gen.id));
                    }
                });
            }

            return {
                ...libro,
                id: Number(libro.id),
                portada: String(libro.portada),
                generos: normalizedGeneros
            };
        });

        setLibros(normalizedLibros);
        setGeneros(generosData);

        console.log("### Libros después de normalización y set:", normalizedLibros);
        console.log("### Géneros después de set:", generosData.length);

      } catch (err) {
        setError("Error al cargar datos: " + err);
        console.error("### Error en fetchData:", err);
      }
    };

    fetchData();
  }, []);

  const librosPorGenero = (generoId: string): LibroForDisplay[] => {
    return libros.filter(libro => {
      if (!libro.generos || libro.generos.length === 0) {
        return false;
      }
      return libro.generos.includes(generoId);
    });
  };

  if (libros.length === 0 && generos.length === 0 && !error) {
    return (
      <>
        <Menu />
        <div style={{ padding: "2rem" }}>
          <h1>Catálogo de Libros por Género</h1>
          <p>Cargando datos o no hay libros/géneros disponibles...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Menu />
      <div style={{ padding: "2rem" }}>
        <h1>Catálogo de Libros por Género</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {generos.map(genero => {
          const librosDelGenero = librosPorGenero(String(genero.id));
          console.log(`### Género: ${genero.nombre} (ID: ${genero.id}), Libros encontrados: ${librosDelGenero.length}`);
          if (librosDelGenero.length === 0) return null;

          return (
            <section key={genero.id} style={{ marginBottom: "2rem" }}>
              <h2>{genero.nombre}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {librosDelGenero.map(libro => (
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
                    <h4>{libro.nombre}</h4>
                    <p style={{ textAlign: "center" }}>
                      <strong>Autor:</strong> {libro.autor}
                    </p>
                    <p style={{ textAlign: "center" }}>
                      <strong>Precio:</strong> ${libro.precio}
                    </p>
                    <Button
                      onClick={() => navigate(URLS.LIBROS.DETAIL(libro.id.toString()))}
                      title="Ver Detalles"
                       />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}