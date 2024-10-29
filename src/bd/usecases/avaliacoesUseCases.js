const { pool } = require('../config');
const Avaliacoes = require('../entities/Avaliacoes')

const getAvaliacaoDB = async () => {

    try{

        const { rows } = await pool.query(`SELECT a.codigo as codigo,
            u.email as usuario_email, u.nome as usuario_nome, j.codigo as jogo_id,
            j.nome as jogo_nome, a.nota as nota, a.comentario as comentario,
            to_char(a.data_avaliacao,'YYYY-MM-DD') as data_avaliacao
            FROM avaliacoes a
            JOIN usuarios u on a.usuario_email = u.email
            JOIN jogos j on a.jogo_id = j.codigo
            ORDER BY a.codigo`);
        
        return rows.map((avaliacoes) =>
            new Avaliacoes(avaliacoes.codigo, avaliacoes.usuario_email, avaliacoes.usuario_nome,
                avaliacoes.jogo_id, avaliacoes.jogo_nome, avaliacoes.nota, avaliacoes.comentario,
                avaliacoes.data_avaliacao));
    } 
    catch (err) {
        throw "Erro : " + err;
    }
}

const addAvaliacaoDB = async (objeto) => {

    try {

        const { usuario_email, jogo_id, nota, comentario, data_avaliacao } = objeto;

        await pool.query(`INSERT INTO avaliacoes (usuario_email, jogo_id, 
            nota, comentario, data_avaliacao)
        VALUES ($1, $2, $3, $4, $5) `,
            [usuario_email, jogo_id, nota,
                comentario, data_avaliacao ]);

    } catch (err) {
        throw "Erro ao inserir a avaliação: " + err;
    }
}

const updateAvaliacaoDB = async (objeto) => {

    try {

        const { codigo, usuario_email, jogo_id, nota, comentario, data_avaliacao } = objeto;

        const results = await pool.query(`UPDATE avaliacoes SET usuario_email = $2,
                jogo_id = $3, nota = $4, comentario = $5, data_avaliacao = $6 WHERE codigo = $1 `,
            [codigo, usuario_email, jogo_id, nota,
                comentario, data_avaliacao]);

        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o codigo ${codigo} para ser alterado`;
        }

    } catch (err) {
        throw "Erro ao alterar a avaliação: " + err;
    }
}

const deleteAvaliacaoDB = async (codigo) => {

    try {

        const results = await pool.query(`DELETE FROM avaliacoes where codigo = $1`,
            [codigo]);

        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o codigo ${codigo} para ser removido`;
        } 
        else {
            return "Avaliação removida com sucesso";
        }

    } catch (err) {
        throw "Erro ao remover a avaliação: " + err;
    }
}

const getAvaliacaoPorCodigoDB = async (codigo) => {

    try {

        const results = await pool.query(`SELECT a.codigo as codigo,
            u.email as usuario_email, u.nome as usuario_nome, j.codigo as jogo_id,
            j.nome as jogo_nome, a.nota as nota, a.comentario as comentario,
            to_char(a.data_avaliacao,'YYYY-MM-DD') as data_avaliacao
            FROM avaliacoes a
            JOIN usuarios u on a.usuario_email = u.email
            JOIN jogos j on a.jogo_id = j.codigo
            WHERE a.codigo = $1`, [codigo]);

        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo}`;
        } 
        else {
            const avaliacao = results.rows[0];
            return new Avaliacoes(avaliacao.codigo, avaliacao.usuario_email, avaliacao.usuario_nome,
                avaliacao.jogo_id, avaliacao.jogo_nome, avaliacao.nota, avaliacao.comentario,
                avaliacao.data_avaliacao);
        }

    } catch (err) {
        throw "Erro ao recuperar a avaliação: " + err;
    }
}

module.exports = {
    getAvaliacaoDB, addAvaliacaoDB, updateAvaliacaoDB, deleteAvaliacaoDB, getAvaliacaoPorCodigoDB
}