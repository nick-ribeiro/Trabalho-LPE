const { pool } = require('../config');
const Jogos = require('../entities/Jogos')

const getJogosDB = async () => {

    try{

        const { rows } = await pool.query(`SELECT j.codigo as codigo,
            j.nome as nome, j.descricao as descricao, j.preco as preco,
            to_char(j.data_lancamento,'YYYY-MM-DD') as data_lancamento,
            j.genero_id as genero_id, g.nome as genero_nome
            FROM jogos j
            JOIN generos g on j.genero_id = g.codigo
            ORDER BY j.codigo`);
        
        return rows.map((jogos) =>
            new Jogos(jogos.codigo, jogos.nome, jogos.descricao,
                jogos.preco, jogos.data_lancamento, jogos.genero_id,
                jogos.genero_nome));
    } 
    catch (err) {
        throw "Erro : " + err;
    }
}

const addJogosDB = async (objeto) => {

    try {

        const { nome, descricao, preco, data_lancamento, genero_id } = objeto;

        await pool.query(`INSERT INTO jogos (nome, descricao, 
            preco, data_lancamento, genero_id)
        VALUES ($1, $2, $3, $4, $5) `,
            [nome, descricao, preco,
                data_lancamento, genero_id]);

    } catch (err) {
        throw "Erro ao inserir o jogo: " + err;
    }
}

const updateJogosDB = async (objeto) => {

    try {

        const { codigo, nome, descricao, preco, data_lancamento, genero_id } = objeto;

        const results = await pool.query(`UPDATE jogos SET nome = $2,
                descricao = $3, preco = $4, data_lancamento = $5, genero_id = $6 WHERE codigo = $1 `,
            [codigo, nome, descricao, preco,
                data_lancamento, genero_id]);

        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o codigo ${codigo} para ser alterado`;
        }

    } catch (err) {
        throw "Erro ao alterar o jogo: " + err;
    }
}

const deleteJogosDB = async (codigo) => {

    try {

        const results = await pool.query(`DELETE FROM jogos where codigo = $1`,
            [codigo]);

        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o codigo ${codigo} para ser removido`;
        } 
        else {
            return "Jogo removido com sucesso";
        }

    } catch (err) {
        throw "Erro ao remover o jogo: " + err;
    }
}

const getJogoPorCodigoDB = async (codigo) => {

    try {

        const results = await pool.query(`SELECT j.codigo as codigo, 
            j.nome as nome, j.descricao as descricao, 
            j.preco as preco,  
            to_char(j.data_lancamento,'YYYY-MM-DD') as data_lancamento, 
            j.genero_id as genero_id, g.nome as genero_nome
            FROM jogos j
            JOIN generos g on j.genero_id = g.codigo
            WHERE j.codigo = $1`, [codigo]);

        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo}`;
        } 
        else {
            const jogo = results.rows[0];
            return new Jogos(jogo.codigo, jogo.nome, jogo.descricao,
                jogo.preco, jogo.data_lancamento, jogo.genero_id, jogo.genero_nome);
        }

    } catch (err) {
        throw "Erro ao recuperar o jogo: " + err;
    }
}

module.exports = {
    getJogosDB, addJogosDB, updateJogosDB, deleteJogosDB, getJogoPorCodigoDB
}