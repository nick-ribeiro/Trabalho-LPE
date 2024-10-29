import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getGeneroPorCodigoDB, addGeneroDB, updateGeneroDB }
    from "@/bd/usecases/generosUseCases";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Suspense } from 'react';
import Loading from '@/components/comuns/CampoEntradaFloating';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";

const FormularioPage = async ({ params }) => {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    let genero = null;
    if (params.codigo == 0) {
        genero = { codigo: 0, nome: "" }
    } else {
        try {
            genero = await getGeneroPorCodigoDB(params.codigo);
        } catch (err) {
            return notFound();
        }
    }

    const salvarGenero = async (formData) => {
        'use server';
        const objeto = {
            codigo: formData.get('codigo'),
            nome: formData.get('nome')
        }

        // Validação atualizada para permitir caracteres especiais
        const nomeRegex = /^[A-Za-zÀ-ÿ\s^~´`]{3,50}$/;
        if (!nomeRegex.test(objeto.nome)) {
            throw new Error('O nome deve ter entre 3 e 50 caracteres e pode conter letras, acentos e caracteres especiais como ^, ~, ç.');
        }

        try {
            if (objeto.codigo == 0) {
                await addGeneroDB(objeto);
            } else {
                await updateGeneroDB(objeto);
            }
        } catch (err) {
            throw new Error('Erro: ' + err);
        }
        revalidatePath('/privado/genero/');
        redirect('/privado/genero');
    }

    return (
        <>
            <Suspense fallback={<Loading />}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Gênero</h2>
                </div>
                <form action={salvarGenero}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-6">
                                <div>
                                    <FloatingLabel controlId="campoCodigo"
                                        label="Código" className="mb-3">
                                        <Form.Control type="number"
                                            defaultValue={genero.codigo} readOnly
                                            name="codigo" />
                                    </FloatingLabel>
                                </div>
                                <div>
                                    <FloatingLabel controlId="campoNome"
                                        label="Nome" className="mb-3">
                                        <Form.Control type="text"
                                            defaultValue={genero.nome} required
                                            name="nome"
                                            pattern="[A-Za-zÀ-ÿ\s^~´`]{3,50}" // Atualiza o regex para permitir acentos e caracteres especiais
                                            title="O nome deve ter entre 3 e 50 caracteres e pode conter letras, acentos e caracteres especiais como ^, ~, ç."
                                        />
                                    </FloatingLabel>
                                </div>
                                <div className="form-group text-center mt-3">
                                    <button type="submit" className="btn btn-success">
                                        Salvar <i className="bi bi-save"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                </form>
            </Suspense>
        </>
    )
}

export default FormularioPage;