import type{ SubmitHandler } from "react-hook-form"
 import{useForm } from "react-hook-form"
import { Input } from "../components/Input"
import { FormField } from "../components/FormField"
import { Card } from '../components/Card';
import { Button } from "../components/Button";
import { GeneroService } from "../services/generoService";
import type { Genero } from "../models/genero";
import { useNavigate, useParams } from "react-router";
import { URLS } from "../navigation/constants";
import { useEffect } from "react";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";

type Inputs = {
    nombre: string
   
}
export const GeneroForm = () => {
    const navigate = useNavigate()
    useAuth()

    const { id } = useParams<{ id: string }>();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
        const Genero: Genero = {
            id: id ? id : "",
            nombre: data.nombre,
        }
        if (id) {
            updateGenero(Genero)
        } else {
            insertGenero(Genero)
        }

    }
    const updateGenero = (Genero: Genero) => {
        new GeneroService()
            .updateGenero(Genero)
            .then(() => {
                navigate(URLS.HOME)
            })
            .catch((error) => {
                console.error("Error al actualizar la Genero: ", error)
                alert("Error al actualizar Genero, intente nuevamente");
            });
    }

    const insertGenero = (Genero: Genero) => {
        new GeneroService()
            .insertGenero(Genero)
            .then(() => {
                navigate(URLS.HOME)
            })
            .catch((error) => {
                console.error("Error al insertar la Genero: ", error)
                alert("Error al insertar Genero, intente nuevamente");
            });
    }

    const loadGenero = async () => {
        new GeneroService()
            .getGenero(id!)
            .then((response) => {
                reset({
                    nombre: response.nombre,
                })
            });
    }
    useEffect(() => {
        if (!id) {
            return;
        }
        loadGenero();

    }, [id])

    return (<>
        <Menu />
        <Container>
            <Card title="Formulario Genero" className="mx-5 my-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField>
                        <label htmlFor="nombre">Nombre:</label>
                        <Input id="nombre" {...register("nombre", { required: true })} />
                        {errors.nombre && <span>Este campo es requerido</span>}
                    </FormField>
                    <Button type="submit" title="Guardar" />
                </form>
            </Card>
        </Container>
    </>
    );
}