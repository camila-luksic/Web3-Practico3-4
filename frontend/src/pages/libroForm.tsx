import type{ SubmitHandler} from "react-hook-form"
import{ useForm } from "react-hook-form"
import { Input } from "../components/Input"
import { FormField } from "../components/FormField"
import { Card } from '../components/Card';
import { Button } from "../components/Button";
import { libroService } from "../services/libroService";
import type { Libro } from "../models/libro";
import { useNavigate, useParams } from "react-router-dom";
import { URLS } from "../navigation/constants";
import { useEffect ,useState} from "react";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { FileInput } from "../components/FileInput";
import { GeneroService } from "../services/generoService";

type Inputs = {
    nombre: string
    autor: string,
    precio: number,
    descripcion: string,
    isbn: string,
    portada: FileList,
    generos: string[]
}
export const LibroForm = () => {
    const navigate = useNavigate()
    const [generos, setGeneros] = useState<{ id: string, nombre: string }[]>([]);

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
        const libro: Libro = {
            id: id ? id : "",
            nombre: data.nombre,
            autor: data.autor,
            precio: data.precio,
            descripcion: data.descripcion,
            isbn: data.isbn,
            portada: data.portada,
            generos: data.generos,
        }
        if (id) {
            updatelibro(libro)
        } else {
            insertlibro(libro)
        }

    }
    const updatelibro = (libro: Libro) => {
        new libroService()
            .updatelibro(libro)
            .then(() => {
                navigate(URLS.LIBROS.LIST)
            })
            .catch((error) => {
                console.error("Error al actualizar el libro: ", error)
                alert("Error al actualizar libro, intente nuevamente");
            });
    }

    const insertlibro = (libro: Libro) => {
        new libroService()
            .insertlibro(libro)
            .then(() => {
                navigate(URLS.LIBROS.LIST)
            })
            .catch((error) => {
                console.error("Error al insertar la libro: ", error)
                alert("Error al insertar libro, intente nuevamente");
            });
    }

    const loadlibro = async () => {
        new libroService()
            .getlibro(id!)
            .then((response) => {
                reset({
                    nombre: response.nombre,
                    autor: response.autor,
                    precio: response.precio,
                    descripcion: response.descripcion,
                    isbn: response.isbn
                })
            });
    }
    const loadGeneros = async () => {
    try {
        const response = await new GeneroService().getGeneros();
        setGeneros(response);
    } catch (error) {
        console.error("Error al cargar géneros", error);
    }
};
    useEffect(() => {
        loadGeneros();
        if (!id) {
            return;
        }
        loadlibro();

    }, [id])

    return (
        <>
            <Menu />

            <Container>
                <Card title="Formulario libro" className="mx-5 my-5">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormField>
                            <label htmlFor="nombre">Nombre:</label>
                            <Input id="nombre" {...register("nombre", { required: true })} />
                            {errors.nombre && <span>Este campo es requerido</span>}
                        </FormField>
                        <FormField>
                            <label htmlFor="autor">Autor:</label>
                            <Input id="autor" {...register("autor", { required: true })} />
                            {errors.autor && <span>Este campo es requerido</span>}
                        </FormField>
                        <FormField>
                            <label htmlFor="precio">Precio:</label>
                            <Input id="precio" type="number" {...register("precio", { required: true,valueAsNumber: true })} />
                            {errors.precio && <span>Este campo es requerido</span>}
                        </FormField>
                        <FormField>
                            <label htmlFor="descripcion">Descripcion:</label>
                            <Input id="descripcion"  {...register("descripcion", { required: true })} />
                            {errors.descripcion && <span>Este campo es requerido</span>}
                        </FormField>
                        <FormField>
                            <label htmlFor="isbn">ISBN:</label>
                            <Input id="isbn" type="text" {...register("isbn", { required: true })} />
                            {errors.isbn && <span>Este campo es requerido</span>}
                        </FormField>
                        <FormField>
                            <label htmlFor="portada">Foto de portada:</label>
                            <FileInput id="portada" type="file" {...register("portada", { required: true })} />
                            {errors.portada && <span>Este campo es requerido</span>}
                        </FormField>
                        <FormField>
                        <label htmlFor="generos">Géneros:</label>
                        <select id="generos" multiple {...register("generos", { required: true })}>
                        {generos.map((genero) => (
                        <option key={genero.id} value={genero.id}>{genero.nombre}</option> ))}
                        </select>
                        {errors.generos && <span>Debes seleccionar al menos un género</span>}
                        </FormField>

                        <Button type="submit" title="Guardar" />
                    </form>
                </Card>
            </Container>
        </>
    );
}