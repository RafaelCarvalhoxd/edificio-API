const database = require('../services/database')

const { validateNome, validateLocalizacao, validateCnpj, validateImagem } = require('../utils/fieldsvalidationUtils')

exports.getAllEdificios = async (req, res) => {
    try {
        const result = await database.query('SELECT * FROM edificio');
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
}

exports.getEdificio = async (req, res) => {
    try {
        const result = await database.query({
            text: 'SELECT * FROM edificio WHERE id_edificio = $1',
            values: [req.params.id]
        });
        
        if (result.rowsCount === 0) {
            return res.status(404).json({succes: false, error: 'Edificio not found' })
        };

        return res.status(200).json({ succes: true, data: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ succes: false, error: 'Server error!' })
    }
}

exports.createEdificio = async (req, res) => {
    try {
        
        validateCnpj(req, res);
        validateNome(req, res);
        validateImagem(req, res);
        validateLocalizacao(req, res);

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM edificio WHERE cnpj = $1)',
            values: [req.body.cnpj]
        })

        if (existsResult.rows[0].exists) {
            return res.status(409).json({ succes: false, error: `This CNPJ already exists` })
        }
        
        const result = await database.query({
            text: `INSERT INTO edificio (nome, localizacao, qnt_moradores, cnpj, imagem, descricao)
                    VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [
                req.body.nome,
                req.body.localizacao,
                req.body.qnt_moradores,
                req.body.cnpj,
                req.body.imagem,
                req.body.descricao || null
            ]
        })

        return res.status(201).json({ succes: true, data: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ succes: false, error: 'Server error!' });
    }
}

exports.updateEdificio = async (req, res) => {
    try {

        if (!req.body.nome || !req.body.localizacao || !req.body.descricao || !req.body.imagem || !req.body.cnpj || req.body.qnt_moradores) {
            return res.status(422).json({ succes: false, error: 'All fields are required' })
        }

         const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM edificio WHERE cnpj = $1)',
            values: [req.body.cnpj]
        })

        if (existsResult.rows[0].exists) {
            return res.status(409).json({ succes: false, error: ` ${req.body.name} already exists` })
        }

        const result = await database.query({
            text: `UPDATE edificio
                    SET nome = $1, localizacao = $2, qnt_moradores = $3, cnpj = $4, imagem = $5, descricao = $6
                    WHERE id_edificio = $7
                    RETURNING *`,
            values: [
                req.body.nome,
                req.body.localizacao,
                req.body.qnt_moradores,
                req.body.cnpj,
                req.body.imagem,
                req.body.descricao,
                req.params.id
            ]
        })
    
        if (result.rowCount == 0) {
            return res.status(404).json({ succes: false, error: 'Edificio not found' })
        }

        return res.status(200).json({ succes: true, data: result.rows[0] });

    } catch (error) {
        return res.status(500).json({ succes: false, error: 'Server error!' })
    }
}

exports.deleteEdificio = async (req, res) => {
    try {
        const result = await database.pool.query({
            text: 'DELETE FROM edificio WHERE id_edificio  = $1 RETURNING *',
            values: [req.params.id]
        })

        if (result.rowCount == 0) {
            return res.status(404).json({ succes: false, error: 'Edificio not found' })
        }

        return res.status(200).json({ success: true, message: 'Edificio deleted' })
    } catch (erro) {
        return res.status(500).json({ succes: false, error: 'Server error!' })
    }
}

