import { notFound } from 'next/navigation';
import { getAvaliacaoPorCodigoDB } from '@/bd/usecases/avaliacoesUseCases';
import Loading from '@/components/comuns/CampoEntradaFloating';
import { Suspense } from 'react';
import AvaliacaoCard from '@/components/avaliacoes/AvaliacaoCard';  // Importar JogoCard
import BotaoVoltar from '@/components/comuns/BotaoVoltar';    // Importar BotaoVoltar

const AvaliacaoDetalhePage = async ({ params }) => {
    let avaliacao = null;

    try {
        avaliacao = await getAvaliacaoPorCodigoDB(params.jogoCodigo);
    } 
    catch (err) {
        return notFound();
    }

    return (
        <Suspense fallback = {<Loading />}>
            <div style = {{ padding: '20px' }}>
                <div className = "container">
                    <div className = "row justify-content-center">
                        <AvaliacaoCard avaliacao = {avaliacao} />
                        <BotaoVoltar />
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

export default AvaliacaoDetalhePage;