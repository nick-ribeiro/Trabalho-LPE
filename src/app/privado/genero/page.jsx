import { Table } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { getGenerosDB, deleteGeneroDB } from "@/bd/usecases/generosUseCases";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Suspense } from 'react';
import Loading from '@/components/comuns/CampoEntradaFloating';

const deleteGenero = async (codigo) => {
    'use server'
    try {
        await deleteGeneroDB(codigo);
    } catch (err) {
        console.log('Erro: ' + err);
        throw new Error('Erro: ' + err);
    }
    revalidatePath('/privado/genero/');
    redirect('/privado/genero/');
}

export default async function Genero() {

    revalidatePath('/privado/genero/');

    const generos = await getGenerosDB();

    return (
        <Suspense fallback={<Loading />}>
            <div style={{ padding: '20px' }}>
                <Link href={`/privado/genero/${0}/formulario`}
                    className="btn btn-primary">
                    <i className="bi bi-file-earmark-plus"></i> Novo
                </Link>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>Ações</th>
                            <th>Código</th>
                            <th>Nome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            generos.map((genero) => (
                                <tr key={genero.codigo}>
                                    <td align="center">
                                        <Link className="btn btn-info" title="Editar"
                                            href={`/privado/genero/${genero.codigo}/formulario`}>
                                            <i className="bi bi-pencil-square"></i>
                                        </Link>
                                        <form
                                            action={deleteGenero.bind(null, genero.codigo)}
                                            className="d-inline">
                                            <Button className="btn btn-danger" title="Excluir"
                                                type="submit">
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </form>
                                    </td>
                                    <td>{genero.codigo}</td>
                                    <td>{genero.nome}</td>
                                </tr>
                            ))
                        }

                    </tbody>
                </Table>
            </div>
        </Suspense>
    )
}
