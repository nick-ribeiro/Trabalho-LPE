class Jogos {
    constructor(codigo, nome, descricao, preco, data_lancamento, genero_id, genero_nome){
        this.codigo = codigo;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.data_lancamento = data_lancamento;
        this.genero_id = genero_id;
        this.genero_nome = genero_nome;
    }
}

module.exports = Jogos;