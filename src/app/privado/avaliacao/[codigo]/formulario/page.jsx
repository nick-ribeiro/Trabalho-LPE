import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getUsuariosDB } from '@/bd/usecases/usuariosUseCases';
import { getJogosDB } from '@/bd/usecases/jogosUseCases';
import { getAvaliacaoPorCodigoDB, updateAvaliacaoDB, addAvaliacaoDB } from '@/bd/usecases/avaliacoesUseCases';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Loading from '@/components/comuns/CampoEntradaFloating';
import { Suspense } from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";

const FormularioPage = async ({ params }) => {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const usuarios = await getUsuariosDB();
    const jogos = await getJogosDB();

    let avaliacao = null;
    if (params.codigo == 0) {
        avaliacao = {
            codigo: 0,
            usuario_email: "",
            jogo_id: "",
            nota: "",
            comentario: "",
            data_avaliacao : new Date().toISOString().slice(0, 10)
        };
    } else {
        try {
            avaliacao = await getAvaliacaoPorCodigoDB(params.codigo);
        } catch (err) {
            return notFound();
        }
    }

    const salvarAvaliacao = async (formData) => {
        'use server';
        const objeto = {
            codigo: formData.get('codigo'),
            usuario_email: formData.get('usuario_email'),
            jogo_id: formData.get('jogo_id'),
            nota: formData.get('nota'),
            comentario: formData.get('comentario'),
            data_avaliacao: formData.get('data_avaliacao')
        }
        try {
            if (objeto.codigo == 0) {
                await addAvaliacaoDB(objeto)
            } else {
                await updateAvaliacaoDB(objeto)
            }

        } catch (err) {
            throw new Error('Erro: ' + err);
        }
        revalidatePath('/privado/avaliacao/');
        redirect('/privado/avaliacao/');

    };

    return (
        <Suspense fallback={<Loading />}>
            <div>
                <div style={{ textAlign: 'center' }}>
                    <h2>Avaliação</h2>
                </div>
                <form action={salvarAvaliacao}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-6">
                                <FloatingLabel controlId="campoCodigo" label="Código" className="mb-3">
                                    <Form.Control type="number" defaultValue={avaliacao.codigo} readOnly name="codigo" />
                                </FloatingLabel>
                                <FloatingLabel controlId="selectUsuario" label="Usuário" className="mb-3">
                                    <Form.Select defaultValue={avaliacao.usuario_email} required name="usuario_email">
                                        <option disabled value="">Selecione o Usuário</option>
                                        {usuarios.map((us) => (
                                            <option key={us.email} value={us.email}>{us.nome}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                                <FloatingLabel controlId="selectJogo" label="Jogo" className="mb-3">
                                    <Form.Select defaultValue={avaliacao.jogo_id} required name="jogo_id">
                                        <option disabled value="">Selecione o Jogo</option>
                                        {jogos.map((jog) => (
                                            <option key={jog.codigo} value={jog.codigo}>{jog.nome}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                                <FloatingLabel controlId="campoNota" label="Nota" className="mb-3">
                                    <Form.Control type="number" defaultValue={avaliacao.nota} required name="nota" />
                                </FloatingLabel>
                                <FloatingLabel controlId="campoComentario" label="Comentário" className="mb-3">
                                    <Form.Control type="text" defaultValue={avaliacao.comentario} required name="comentario" as="textarea" style={{ height: '100px' }} />
                                </FloatingLabel>
                                <FloatingLabel controlId="campoData" label="Data de Avaliação" className="mb-3">
                                    <Form.Control type="date" defaultValue={avaliacao.data_avaliacao} required name="data_avaliacao" />
                                </FloatingLabel>
                                <div className="form-group text-center mt-3">
                                    <button type="submit" className="btn btn-success">
                                        Salvar <i className="bi bi-save"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Suspense>
    )
};

export default FormularioPage;
