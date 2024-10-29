import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { getAvaliacaoDB, deleteAvaliacaoDB } from '@/bd/usecases/avaliacoesUseCases';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';
import Loading from '@/components/comuns/CampoEntradaFloating';


const deleteAvaliacao = async (codigo) => {
    'use server';
    try {
        await deleteAvaliacaoDB(codigo);
    } catch (err) {
        console.log(err);
        throw new Error('Erro: ' + err);
    }
    revalidatePath('/privado/avaliacao/');
    redirect('/privado/avaliacao/');
};

export default async function Avaliacao() {
    revalidatePath('/privado/avaliacao/');

    const avaliacoes = await getAvaliacaoDB();

    return (
        <Suspense fallback={<Loading />}>
            <div style={{ padding: '20px' }}>
                <h1>Avaliações</h1>
                <Link className="btn btn-primary" href={`/privado/avaliacao/${0}/formulario`}>
                    Novo <i className="bi bi-file-earmark-plus"></i>
                </Link>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>Ações</th>
                            <th>Código</th>
                            <th>Nome de Usuário</th>
                            <th>Nome do Jogo</th>
                            <th>Nota</th>
                            <th>Comentário</th>
                            <th>Data da Avaliação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {avaliacoes.map((avaliacao) => (
                            <tr key={avaliacao.codigo}>
                                <td align="center">
                                    <Link className="btn btn-info" href={`/privado/avaliacao/${avaliacao.codigo}/formulario`}>
                                        <i className="bi bi-pencil-square"></i>
                                    </Link>
                                    <form action={deleteAvaliacao(null, avaliacao.codigo)} className="d-inline">
                                        <Button variant="danger" type='submit'>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </form>
                                </td>
                                <td>{avaliacao.codigo}</td>
                                <td>{avaliacao.usuario_nome}</td>
                                <td>{avaliacao.jogo_nome}</td>
                                <td>{avaliacao.nota}</td>
                                <td>{avaliacao.comentario}</td>
                                <td>{avaliacao.data_avaliacao}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Suspense>
    )
}