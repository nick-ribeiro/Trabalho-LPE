import { getJogosDB } from '@/bd/usecases/jogosUseCases';
import { getAvaliacaoDB } from '@/bd/usecases/avaliacoesUseCases';
import Link from 'next/link';

export const revalidate = 60;

export default async function Home() {
  const jogos = await getJogosDB();
  const avaliacoes = await getAvaliacaoDB();

  return (
    <div style={{ padding: '20px' }}>
      <div className="row">
        {jogos.length > 0 ? (
          jogos.map((objeto) => {
            const avaliacoesDoJogo = avaliacoes.filter(avaliacao => avaliacao.jogo_id === objeto.codigo);

            return (
              <div className="col-sm-3" key={objeto.codigo}>
                <div className="card mb-3 text-center">
                  <div className="card-header">
                    {objeto.nome}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{objeto.nome}</h5>
                    <p className="card-text">
                      <small className="text-muted">Preço: {objeto.preco}</small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">Gênero: {objeto.genero_nome}</small>
                    </p>
                    {avaliacoesDoJogo.length > 0 ? (
                      <div>
                        <h6>Avaliações:</h6>
                        <ul className="list-unstyled">
                          {avaliacoesDoJogo.map(avaliacao => (
                            <li key={avaliacao.id}>
                              <p><strong>{avaliacao.usuario_nome}:</strong> {avaliacao.comentario} ({avaliacao.nota}/5)</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-muted">Sem avaliações.</p>
                    )}
                  </div>
                  <div className="card-footer text-muted">
                    <Link type="button" className="btn btn-secondary" href={`/jogos/${objeto.codigo}/detalhe`}>Detalhes do produto</Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>Nenhum jogo disponível.</p>
        )}
      </div>
    </div>
  );
}
