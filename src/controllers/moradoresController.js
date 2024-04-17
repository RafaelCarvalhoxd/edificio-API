const database = require('../services/database')

const { validateNome, validateEdfCadastrado } = require('../utils/fieldsvalidationUtils')

exports.getAllMoradores = async (req, res) => {
    try {
        const result = await database.query('SELECT * FROM morador');
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}

exports.getMorador = async (req, res) => {
    try {
        const result = await database.query({
            text: 'SELECT * FROM morador WHERE id_morador = $1',
            values: [req.params.id]

    })
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: 'Server error!' });
    }
}

exports.createMorador = async (req, res) => {
    validateNome(req, res);
    validateEdfCadastrado(req, res);
    
    const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM edificio WHERE id = $1)',
            values: [req.body.edf_cadastrado]
        });

        if (!existsResult.rows[0].exists) {
            return res.status(422).json({ succes: false, error: 'Edificio already exists!' });
        }
    
    try {
        const result = await database.query({
            text: `INSERT INTO morador (edf_cadastrado, nome, descricao)
                VALUES ($1,$2,$3)
                RETURNING *`,
            values: [
                req.body.edf_cadastrado,
                req.body.nome,
                req.body.descricao || null
            ]
        })
     return res.status(201).json({ succes: true, data: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ succes: false, error: 'Server error!' });
    }
}

exports.updateMorador = async (req, res) => {
    if (!req.body.nome || !req.body.edf_cadastrado || !req.body.descricao) {
            return res.status(422).json({ succes: false, error: 'All fields are required' })
        }

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM edificio WHERE id_morador = $1)',
            values: [req.body.edf_cadastrado]
        });

        if (!existsResult.rows[0].exists) {
            return res.status(422).json({ succes: false, error: 'Edificio not found' });
        }
    
    try {
        const result = await database.query({
            text: `UPDATE morador
                    SET edf_cadastrado = $1, nome = $2, descricao = $3
                    WHERE id = $4
                    RETURNING *`,
            values: [
                req.body.edf_cadastrado,
                req.body.nome,
                req.params.descricao,
                req.params.id
            ]
        })
        if (result.rowCount == 0) {
            return res.status(404).json({ succes: false, error: 'Morador not found' })
        } 

        return res.status(200).json({ succes: true, data: result.rows[0]} );

    } catch (error) {
        return res.status(500).json({ succes: false, error: 'Server error!' })
    }
}


exports.deleteMorador = async (req, res) => {
    try {
        const result = await database.query({
            text: `DELETE FROM morador WHERE id_morador = $1
            RETURNING *`,
            values: [
                req.params.id
            ]
        })
    
        if (result.rowCount == 0) {
            return res.status(404).json({ succes: false, error: 'Morador not found' })
        }

        return res.status(200).json({ success: true, message: 'Morador deleted' })
    } catch (error) {
        return res.status(500).json({ succes: false, error: 'Server error!' })
    }
}
