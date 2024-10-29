const JogoCard = ({ jogo }) => (
    <div className = "col-sm-3" key = {jogo.id}>
        <div className = "card mb-3 text-center">
            <div className = "card-header">
                {jogo.nome}
            </div>
            <div className = "card-body ">
                <h5 className = "card-title"> Código: {jogo.id}</h5>
                <p className = "card-text">{jogo.descricao}</p>
                <p className = "card-text"><small className = "text-muted"> Preço: {jogo.preco}</small></p>
                <p className = "card-text"><small className = "text-muted"> Gênero: {jogo.genero_nome}</small></p>
            </div>
        </div>
    </div>
);

export default JogoCard;