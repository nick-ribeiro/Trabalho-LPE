const AvaliacaoCard = ({ avaliacao }) => (
    <div className = "col-sm-3" key = {avaliacao.codigo}>
        <div className = "card mb-3 text-center">
            <div className = "card-header">
                {avaliacao.nome}
            </div>
            <div className = "card-body ">
                <h5 className = "card-title"> Código: {avaliacao.id}</h5>
                <p className = "card-text"><small className = "text-muted"> Usuário: {avaliacao.usuario_nome}</small></p>
                <p className = "card-text">{avaliacao.comentario}</p>
                <p className = "card-text"><small className = "text-muted"> Nota: {avaliacao.nota}</small></p>
                <p className = "card-text"><small className = "text-muted"> Jogo: {avaliacao.jogo_nome}</small></p>
            </div>
        </div>
    </div>
);

export default AvaliacaoCard;