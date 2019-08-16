'use strict'
const router = require('express').Router(),
      validator = require('node-input-validator'),
      validar = require('../helpers/validar'),  
      connection = require('../database');


      router.get('/', async (req, res) => {
        await connection.query('SELECT * FROM usuarios', (err, result) => {
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
    
    // Consultar usuarios por  Id
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
        await connection.query('SELECT * FROM usuarios WHERE ID = ?', [id], (err, result) => {
            if (err) {
                res.status(400).send({
                    succes: false,
                    message: 'Error al realizar la consulta'
                })
    
            } else if (result.length === 0) {
                res.status(400).send({
                    succes: false,
                    message: "No existe registro asociado al id enviado "
    
                })
            } else if (result.length === 1) {
                res.status(200).send({
                    succes: true,
                    items: result
                })
            } else {
                res.status(400).send({
                    succes: false,
                    message: "Error al intentar consultar el registro"
                })
            }
        })
    });
    
    //Crear registro de usuario
    router.post('/', async (req, res) => {
        // Validacion de parametros con node-input-validator
        let valida = new validator(req.body, {
            username: 'required',
            password: 'required|password'
        });
    
        let matched = await valida.check();
        if (!matched) {
            res.status(400).send(valida.errors);
            return;
        }
    
        const { username, password } = req.body;
    
        const user = {
           username,
           password
        }
        await connection.query('INSERT INTO usuarios SET ?', [user], (err, result) => {
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
    
    //Actualizar registros usuario
    router.put('/', async (req, res) => {
    
        let valida = new validator(req.body, {
            
            username: 'required',
            password: 'required|password'          
        });
    
        let matched = await valida.check();
        if (!matched) {
            res.status(400).send(valida.errors)
            return
        }
    
        const {username, password } = req.body;
        const user = {
           username,
           password
        }
    
        await connection.query('UPDATE usuarios SET ? WHERE ID = ?', [user, id], (err, result) => {
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
    
    //Eliminar registro usuario
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        let valido = validar.validarId(id);
        if (!valido) {
            res.status(422).send({
                message: 'Id invalido'
            })
            return;
        }
        await connection.query('DELETE FROM usuarios WHERE ID = ?', [id], (err, result) => {
            if (err) {
                res.status(400).send({
                    succes: false,
                    message: 'Error al realizar la consulta',
                    error: err.sqlMessage
                })
            } else if (result.affectedRows == 0) {
                res.status(400).send({
                    succes: false,
                    message: 'No existe registro asociado al Id'
                })
            } else if (result.affectedRows == 1) {
                res.status(200).send({
                    succes: true,
                    message: 'Registro eliminado correctamente',
                    result: result
                })
            } else {
                res.status(400).send({
                    succes: false,
                    message: 'Error al intentar eliminar el registro'
                })
            }
        });
    });
    
module.exports = router;