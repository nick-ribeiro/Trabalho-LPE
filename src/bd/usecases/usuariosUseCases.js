const { pool } = require('../config');
const Usuario = require('../entities/Usuarios')

const autenticaUsuarioDB = async (objeto) => {

    try {

        const { email, senha } = objeto;
        console.log('Email: ' + email + " Senha: " + senha)

        const results = await pool.query(`SELECT * FROM usuarios 
            WHERE email = $1 AND senha = $2`, [email, senha]);

        if (results.rowCount == 0){
            throw "Usuário ou senha inválidos";
        }

        const usuario = results.rows[0];

        return new Usuario(usuario.email, usuario.tipo,
                            usuario.telefone, usuario.nome);

    }
    catch(err){

        throw "Erro ao autenticar o usuário: " + err;
    }
};

const registraUsuarioDB = async (objeto) => {
    try {
        const { email, senha, tipo, telefone, nome } = objeto;

        await pool.query(
            `INSERT INTO usuarios (email, senha, tipo, telefone, nome) VALUES ($1, $2, $3, $4, $5)`, 
            [email, senha, tipo, telefone, nome]
        );

        return { message: 'Usuário registrado com sucesso!' };
    } catch (err) {
        throw "Erro ao registrar o usuário: " + err;
    }
};

const updateUsuarioDB = async (objeto) => {
    try {
        const { email, tipo, nome } = objeto;

        const results = await pool.query(
            `UPDATE usuarios SET tipo = $2, nome = $3 WHERE email = $1`,
            [email, tipo, nome]
        );

        if (results.rowCount === 0) {
            throw `Nenhum registro encontrado com o email ${email} para ser alterado`;
        }

        return { message: 'Dados do usuário atualizados com sucesso!' };
    } catch (err) {
        throw "Erro ao atualizar os dados do usuário: " + err;
    }
};

const getUsuariosDB = async () => {
    try {
        const { rows } = await pool.query(`SELECT * FROM usuarios ORDER BY nome`);

        return rows.map((usuario) => new Usuario(usuario.email, usuario.tipo, usuario.telefone, usuario.nome));
    } 
    catch (err) {
        throw "Erro ao recuperar usuários: " + err;
    }
};


module.exports = { autenticaUsuarioDB, registraUsuarioDB, updateUsuarioDB, getUsuariosDB }