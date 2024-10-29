import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { getJogosDB, deleteJogosDB } from '@/bd/usecases/jogosUseCases';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';
import Loading from '@/components/comuns/CampoEntradaFloating';


const deleteJogo = async (codigo) => {
    'use server';
    try {
        await deleteJogosDB(codigo);
    } catch (err) {
        console.log(err);
        throw new Error('Erro: ' + err);
    }
    revalidatePath('/privado/jogo/');
    redirect('/privado/jogo/');
};

export default async function Jogo() {
    revalidatePath('/privado/jogo/');

    const jogos = await getJogosDB();

    return (
        <Suspense fallback={<Loading />}>
            <div style={{ padding: '20px' }}>
                <h1>Jogos</h1>
                <Link className="btn btn-primary" href={`/privado/jogo/${0}/formulario`}>
                    Novo <i className="bi bi-file-earmark-plus"></i>
                </Link>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>Ações</th>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Data Lançamento</th>
                            <th>Gênero</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jogos.map((jogo) => (
                            <tr key={jogo.codigo}>
                                <td align="center">
                                    <Link className="btn btn-info" href={`/privado/jogo/${jogo.codigo}/formulario`}>
                                        <i className="bi bi-pencil-square"></i>
                                    </Link>
                                    <form action={deleteJogo(null, jogo.codigo)} className="d-inline">
                                        <Button variant="danger" type='submit'>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </form>
                                </td>
                                <td>{jogo.codigo}</td>
                                <td>{jogo.nome}</td>
                                <td>{jogo.descricao}</td>
                                <td>{jogo.preco}</td>
                                <td>{jogo.data_lancamento}</td>
                                <td>{jogo.genero_nome}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Suspense>
    )
}