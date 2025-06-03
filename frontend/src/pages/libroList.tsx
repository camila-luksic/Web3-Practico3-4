import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/constants";
import { libroService } from "../services/libroService";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import type { LibroFromAPI } from "../models/libroApi";

const LibroList = () => {
    const navigate = useNavigate()
    useAuth()

    const [libros, setlibros] = useState<Array<LibroFromAPI>>([]);
    const getlibroList = () => {
        new libroService().getlibros()
            .then((response) => {
                setlibros(response);
            })
            .catch((error) => {
                console.error("Error al obtener las libros: ", error);
            });
    }
    useEffect(() => {
        getlibroList()
    }, [])
    const deletelibro = (id: string) => {
        const confirmation = window.confirm("¿Está seguro de que desea eliminar esta libro?");
        if (!confirmation) return;
        new libroService().deletelibro(id)
            .then(() => {
                getlibroList()
            })
            .catch((error) => {
                console.error("Error al eliminar la libro: ", error);
            });
    }
    return (
        <>
            <Menu />
            <Container>
                <Card title="Lista de libros">
                    <Table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>Autor</th>
                                <th>Precio</th>
                                <th>Descripcion</th>
                                <th>ISBN</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {libros.map((libro) => (
                                <tr key={libro.id}>
                                    <td className="text-center border-t-1 border-gray-300">{libro.id}</td>
                                    <td className="text-center border-t-1 border-gray-300">{libro.nombre}</td>
                                    <td className="text-center border-t-1 border-gray-300">{libro.autor}</td>
                                    <td className="text-center border-t-1 border-gray-300">{libro.precio}</td>
                                    <td className="text-center border-t-1 border-gray-300">{libro.descripcion}</td>
                                    <td className="text-center border-t-1 border-gray-300">{libro.isbn}</td>
                                    <td className="text-center border-t-1 border-gray-300"><Button onClick={() => {
                                        navigate(URLS.LIBROS.UPDATE(libro.id.toString()))
                                    }} variant="primary" title="Editar"></Button></td>
                                    <td className="px-3 py-3 text-center border-t-1 border-gray-300"><Button onClick={
                                        () => {
                                            deletelibro(libro.id.toString())
                                        }
                                    } variant="danger" title="Eliminar"></Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            </Container>
        </>

    );
}

export default LibroList;