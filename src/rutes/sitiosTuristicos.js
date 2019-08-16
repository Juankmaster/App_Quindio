'use strict'
const router = require('express').Router(),
    validator = require('node-input-validator'),
    validar = require('../helpers/validar'),
    connection = require('../database');

// Consultar todos los sitios turisticos
router.get('/', async (req, res) => {
    await connection.query('SELECT * FROM sitio_turisticos', (err, result) => {
        if (err) {
            res.status(400).send({
                succes: false,
                message: "Error al realizar la consulta"
            })

        } else if (result.length === 0) {
            res.status(400).send({
                succes: false,
                message: "No hay registros para consultar"
            })
        } else if (result.length > 0) {
            res.status(200).send({
                succes: true,
                items: result
            })
        } else {
            res.status(400).send({
                succes: false,
                message: "Error al intentar obtener el registro"
            })
        }
    })

});
// Consultar sitio por  Id
router.get('/:id', async (req, res) => {
    const { id } = req.params,
        valido = validar.validarId(id);
    if (!valido) {
        res.status(400).send({
            succes: false,
            message: "Parametro invalido"
        });
        return;
    }

    await connection.query('SELECT * FROM sitio_turisticos WHERE ID = ?', [id], (err, result) => {
        if (err) {
            res.status(400).send({
                succes: false,
                message: 'Error al realizar la consulta'
            })

        }else if(result.length === 0){
            res.status(400).send({
                succes: false,
                message:"No existe registro asociado al id enviado "

            })
        }else if(result.length === 1){
            res.status(200).send({
                succes: true,
                items: result
            })
        }else {
            res.status(400).send({
                succes: false,
                message:"Error al intentar consultar el registro"
            })
        }
    })
});

//Crear registro de sitio turisticos
router.post('/', async (req, res) => {
    // Validacion de parametros con node-input-validator
    let valida = new validator(req.body, {
        nombre: 'required',
        direccion: 'required',
        sitio_web: 'required',
        correo: 'required|email',
        telefono: 'required',
        celular: 'required'
    });

    let matched = await valida.check();
    if (!matched) {
        res.status(400).send(valida.errors);
        return;
    }

    const { nombre, direccion, sitio_web, correo, telefono, celular } = req.body;

    const sitioT = {
        nombre,
        direccion,
        sitio_web,
        correo,
        telefono,
        celular
    }
    await connection.query('INSERT INTO sitio_turisticos SET ?', [sitioT], (err, result) => {
        if (err) {
            res.status(400).send({
                succes: false,
                message: 'Error al intentar guardar el registro'
            })
        } else {
            res.status(200).send({
                succes: true,
                message: 'registro guardado correctamente',
                item: result
            })
        }
    });
});

//Actualizar registros operadores turisticos
router.put('/', async (req, res) => {

    let valida = new validator(req.body, {
        id: 'required',
        nombre: 'required',
        direccion: 'required',
        sitio_web: 'required',
        correo: 'required|email',
        telefono: 'required',
        celular: 'required'
    });

    let matched = await valida.check();
    if (!matched) {
        res.status(400).send(valida.errors)
        return
    }

    const { id, nombre, direccion, sitio_web, correo, telefono, celular } = req.body;
    const sitioT = {
        nombre,
        direccion,
        sitio_web,
        correo,
        telefono,
        celular
    }

    console.log(sitioT);

    await connection.query('UPDATE sitio_turisticos SET ? WHERE ID = ?', [sitioT, id], (err, result) => {
        if (err) {
            res.status(400).send({
                succes: false,
                message: 'Error al tratar de actualizar el registro'
            })
        } else if (result.affectedRows == 0) {
            res.status(400).send({
                succes: false,
                message: 'No existe el id'
            })
        } else if (result.affectedRows == 1) {
            res.status(200).send({
                succes: true,
                message: 'Registro actualizado correctamente',
                item: result
            })
        }
    })
})

//Eliminar registro operadores turisticos
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    let valido = validar.validarId(id);
    if (!valido) {
        res.status(422).send({
            message: 'Id invalido'
        })
        return;
    }
    await connection.query('DELETE FROM sitio_turisticos WHERE ID = ?', [id], (err, result) => {
        if (err) {
            res.status(400).send({
                succes:false,
                message:'Error al realizar la consulta',
                error:err.sqlMessage
            })           
        } else if(result.affectedRows == 0){
            res.status(400).send({
                succes:false,
                message:'No existe registro asociado al Id'
            })
        }else if (result.affectedRows == 1){
            res.status(200).send({
                succes:true,
                message:'Registro eliminado correctamente',
                result:result
            })
        }else{
            res.status(400).send({
                succes:false,
                message:'Error al intentar eliminar el registro'
            })
        }
    });
});

module.exports = router;

module.exports = router;