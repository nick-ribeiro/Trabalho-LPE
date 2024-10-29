const { pool } = require('../config');
const Generos = require('../entities/Generos');

const getGenerosDB = async () => {

    try {

        const { rows } = await pool.query(`SELECT * FROM generos ORDER BY nome`);
        return rows.map((genero) => new Generos(genero.codigo, genero.nome));
    } 
    catch (err) {
        throw "Erro: " + err;
    }
}

const deleteGeneroDB = async (codigo) => {

    try {
        const results = await pool.query(`DELETE FROM generos
        WHERE codigo = $1`, [codigo]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo} para ser removido`;
        } 
        else {
            return `Gênero de código ${codigo} removida com sucesso!`;
        }

    } 
    catch (err) {
        throw "Erro ao remover o gênero: " + err;
    }
}

const addGeneroDB = async (objeto) => {

    try {
        const { nome } = objeto;
        await pool.query(`INSERT INTO generos (nome) VALUES ($1)`, [nome]);        
    } 
    catch (err) {
        throw "Erro ao inserir o gênero: " + err;
    }
}

const updateGeneroDB = async (objeto) => {

    try {
        const { codigo, nome } = objeto;        
        const results = await pool.query(`UPDATE generos set nome = $2
        WHERE codigo = $1`, [codigo, nome]);

        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo} para ser alterado`;
        }

    } catch (err) {

        throw "Erro ao alterar o gênero: " + err;
    }
}

const getGeneroPorCodigoDB = async (codigo) => {
    try {
        const results = await pool.query(`SELECT * FROM generos
        WHERE codigo = $1`, [codigo]);

        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo}`;
        } 
        else {
            const genero = results.rows[0];
            return new Generos(genero.codigo, genero.nome);
        }

    } catch (err) {
        throw "Erro ao recuperar o gênero: " + err;
    }
}

module.exports = {
    getGenerosDB, addGeneroDB, updateGeneroDB, deleteGeneroDB,
    getGeneroPorCodigoDB
}