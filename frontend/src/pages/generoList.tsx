import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { Table } from "../components/Table";
import type { Genero } from "../models/genero";
import { GeneroService } from "../services/generoService";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/constants";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";

const GeneroList = () => {
    const navigate = useNavigate()
    useAuth()

    const [generos, setgeneros] = useState<Array<Genero>>([]);
    const getgeneroList = () => {
        new GeneroService().getGeneros()
            .then((response) => {
                setgeneros(response);
            })
            .catch((error) => {
                console.error("Error al obtener las generos: ", error);
            });
    }
    useEffect(() => {
        getgeneroList()
    }, [])
    const deletegenero = (id: string) => {
        const confirmation = window.confirm("¿Está seguro de que desea eliminar esta genero?");
        if (!confirmation) return;
        new GeneroService().deleteGenero(id)
            .then(() => {
                getgeneroList()
            })
            .catch((error) => {
                console.error("Error al eliminar la genero: ", error);
            });
    }
    return (
        <>
            <Menu />
            <Container>
                <Card title="Lista de generos">
                    <Table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {generos.map((genero) => (
                                <tr key={genero.id}>
                                    <td className="text-center border-t-1 border-gray-300">{genero.id}</td>
                                    <td className="text-center border-t-1 border-gray-300">{genero.nombre}</td>
                                    <td className="text-center border-t-1 border-gray-300"><Button onClick={() => {
                                        navigate(URLS.GENEROS.UPDATE(genero.id.toString()))
                                    }} variant="primary" title="Editar"></Button></td>
                                    <td className="px-3 py-3 text-center border-t-1 border-gray-300"><Button onClick={
                                        () => {
                                            deletegenero(genero.id.toString())
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

export default GeneroList;
