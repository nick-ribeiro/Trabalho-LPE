import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getGenerosDB } from '@/bd/usecases/generosUseCases';
import { getJogoPorCodigoDB, addJogosDB, updateJogosDB } from '@/bd/usecases/jogosUseCases';
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

    const generos = await getGenerosDB();

    let jogo = null;
    if (params.codigo == 0) {
        jogo = {
            codigo: 0,
            nome: "",
            descricao: "",
            preco: "",
            data_lancamento: new Date().toISOString().slice(0, 10),
            genero_id: ""
        };
    } else {
        try {
            jogo = await getJogoPorCodigoDB(params.codigo);
        } catch (err) {
            return notFound();
        }
    }

    const salvarJogo = async (formData) => {
        'use server';
        const objeto = {
            codigo: formData.get('codigo'),
            nome: formData.get('nome'),
            descricao: formData.get('descricao'),
            preco: formData.get('preco'),
            data_lancamento: formData.get('data_lancamento'),
            genero_id: formData.get('genero_id')
        }
        try {
            if (objeto.codigo == 0) {
                await addJogosDB(objeto)
            } else {
                await updateJogosDB(objeto)
            }

        } catch (err) {
            throw new Error('Erro: ' + err);
        }
        revalidatePath('/privado/jogo/');
        redirect('/privado/jogo');

    };

    return (
        <Suspense fallback={<Loading />}>
            <div>
                <div style={{ textAlign: 'center' }}>
                    <h2>Jogo</h2>
                </div>
                <form action={salvarJogo}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-6">
                                <FloatingLabel controlId="campoCodigo" label="Código" className="mb-3">
                                    <Form.Control type="number" defaultValue={jogo.codigo} readOnly name="codigo" />
                                </FloatingLabel>
                                <FloatingLabel controlId="campoNome" label="Nome" className="mb-3">
                                    <Form.Control type="text" defaultValue={jogo.nome} required name="nome" />
                                </FloatingLabel>
                                <FloatingLabel controlId="campoDescricao" label="Descrição" className="mb-3">
                                    <Form.Control type="text" defaultValue={jogo.descricao} required name="descricao" as="textarea" style={{ height: '100px' }} />
                                </FloatingLabel>
                                <FloatingLabel controlId="campoPreco" label="Preço" className="mb-3">
                                    <Form.Control type="number" defaultValue={jogo.preco} required name="preco" />
                                </FloatingLabel>
                                <FloatingLabel controlId="campoData" label="Data de Lançamento" className="mb-3">
                                    <Form.Control type="date" defaultValue={jogo.data_lancamento} required name="data_lancamento" />
                                </FloatingLabel>
                                <FloatingLabel controlId="selectGenero" label="Gênero" className="mb-3">
                                    <Form.Select defaultValue={jogo.genero_id} required name="genero_id">
                                        <option disabled value="">Selecione o gênero</option>
                                        {generos.map((gen) => (
                                            <option key={gen.codigo} value={gen.codigo}>{gen.nome}</option>
                                        ))}
                                    </Form.Select>
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
