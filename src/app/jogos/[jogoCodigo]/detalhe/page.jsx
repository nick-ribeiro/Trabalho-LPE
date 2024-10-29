import { notFound } from 'next/navigation';
import { getJogoPorCodigoDB } from '@/bd/usecases/jogosUseCases';
import Loading from '@/components/comuns/CampoEntradaFloating';
import { Suspense } from 'react';
import JogoCard from '@/components/jogos/JogoCard';  // Importar JogoCard
import BotaoVoltar from '@/components/comuns/BotaoVoltar';    // Importar BotaoVoltar

const JogoDetalhePage = async ({ params }) => {
    let jogo = null;

    try {
        jogo = await getJogoPorCodigoDB(params.jogoCodigo);
    } 
    catch (err) {
        return notFound();
    }

    return (
        <Suspense fallback = {<Loading />}>
            <div style = {{ padding: '20px' }}>
                <div className = "container">
                    <div className = "row justify-content-center">
                        <JogoCard jogo = {jogo} />
                        <BotaoVoltar />
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

export default JogoDetalhePage;