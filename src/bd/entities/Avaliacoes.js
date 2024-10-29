class Avaliacoes {
    constructor(codigo, usuario_email, usuario_nome, jogo_id, jogo_nome, nota, comentario, data_avaliacao){
        this.codigo = codigo;
        this.usuario_email = usuario_email;
        this.usuario_nome = usuario_nome;
        this.jogo_id = jogo_id;
        this.jogo_nome = jogo_nome;
        this.nota = nota;
        this.comentario = comentario;
        this.data_avaliacao = data_avaliacao;
    }
}

module.exports = Avaliacoes;