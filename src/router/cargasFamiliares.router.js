import { Router } from 'express'
import cargasFamiliaresModel from '../dao/models/cargasFamiliares.models.js'
// const {Router} = require('express')
// const fs = require ('fs')
// import fs from 'fs'
// const filename = './cargasFamiliaresManager.json'

const router = Router()

router.get("/registrar", async (req, res) => {
    // const cargasFamiliares = await cargasFamiliaresModel.find().lean().exec()
    // const limit = req.query.limit || 5
    // res.json(cargasFamiliaress.slice(0, parseInt(limit)))
    res.render('registrarCargas')
})
router.get("/search", async (req, res) => {
    // const cargasFamiliares = await cargasFamiliaresModel.find().lean().exec()
    // const limit = req.query.limit || 5
    // res.json(cargasFamiliares.slice(0, parseInt(limit)))
    res.render('searchCargas')
})

router.get("/buscar", async (req, res) => {
    try {
      const rutEmpleado = req.query.rut_empleado;
      const cargasFamiliares = await cargasFamiliaresModel.find({rut_empleado: rutEmpleado});
      
      if (cargasFamiliares.length === 0) {
        return res.status(404).json({ message: "No se encontraron Cargas Familiares" });
      }
      const cargasFamiliaresPlain = cargasFamiliares.map(cargasFamiliares => cargasFamiliares.toObject());
      
      return res.render("searchokCarga", { cargasFamiliares: cargasFamiliaresPlain });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error en el servidor al buscar cargasFamiliares" });
    }
  });

router.get("/view", async (req, res) => {
    const cargasFamiliares = await cargasFamiliaresModel.find().lean().exec()
    res.render('realTimecargasFamiliares', {
        data: cargasFamiliares
    })
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const cargasFamiliares = await cargasFamiliaresModel.findOne({ _id: id })
    res.json({
        cargasFamiliares
    })
})

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid
    const cargasFamiliaresDeleted = await cargasFamiliaresModel.deleteOne({ _id: id })

    req.io.emit('updatedcargasFamiliares', await cargasFamiliaresModel.find().lean().exec());
    res.json({
        status: "Success",
        massage: "cargasFamiliares eliminado",
        cargasFamiliaresDeleted
    })
})

router.post("/", async (req, res) => {
    try {
        const cargasFamiliares = req.body
        if (!cargasFamiliares.rut_empleado) {
            return res.status(400).json({
                message: "Error no se ingresó el rut del Empleado"
            })
        }
        if (!cargasFamiliares.nombre_carga) {
            return res.status(400).json({
                message: "Error no se ingresó el nombre de la Carga Familiar"
            })
        }
        if (!cargasFamiliares.parentesco) {
            return res.status(400).json({
                message: "Error no se ingresó la Parentesco"
            })
        }
        if (!cargasFamiliares.genero) {
            return res.status(400).json({
                message: "Error no se ingresó el genero"
            })
        }
        if (!cargasFamiliares.rut_carga) {
            return res.status(400).json({
                message: "Error no se ingresó el rut de la Carga Familiar"
            })
        }

        const user = await cargasFamiliaresModel.findOne({ rut: cargasFamiliares.rut_carga });

        if (user && cargasFamiliares.rut_carga === user.rut) {
            console.log('cargasFamiliares ya existe');
            return res.status(409).json({ message: "Error, el RUT de la carga ya está registrado" });
        }

        const cargasFamiliaresAdded = await cargasFamiliaresModel.create(cargasFamiliares);
        console.log(cargasFamiliaresAdded)
        
        return res.redirect('/cargas')

    } catch (error) {
        console.log(error)
        res.json({
            error
        })
    }
})

router.put("/:pid", async (req, res) => {
    const id = req.params.pid
    const cargasFamiliaresToUpdate = req.body

    const cargasFamiliares = await cargasFamiliaresModel.updateOne({
        _id: id
    }, cargasFamiliaresToUpdate)
    req.io.emit('updatedcargasFamiliares', await cargasFamiliaresModel.find().lean().exec());
    res.json({
        status: "cargasFamiliares actualizado",
        cargasFamiliares
    })
})

router.post('/:rut_empleado/editar', async (req, res) => {
    try {
      const rut = req.params.rut_empleado;
      const { rut_empleado, nombre_carga, parentesco, genero, rut_carga } = req.body;
  
      // Realiza la actualización del cargas en la base de datos
      await cargasFamiliaresModel.findOneAndUpdate({ rut_empleado }, { rut_empleado, nombre_carga, parentesco, genero, rut_carga });
  
      // Redirige a la página de lista de empleados o a una página de confirmación
      res.redirect('/cargas');
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al actualizar el cargas familiares' });
    }
  });

  
  
  router.get('/:rut_empleado/editar', async (req, res) => {
    try {
      const rut_empleado = req.params.rut_empleado;
      const cargas = await cargasFamiliaresModel.findOneAndUpdate({ rut_empleado }).lean().exec();
      res.render('editarCarga', { cargas });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener los detalles del Cargas' });
    }
  });
  

  router.post('/:rut_empleado/eliminar', async (req, res) => {
    try {
      const rut_empleado = req.params.rut_empleado;
      const cargas = await cargasFamiliaresModel.findOneAndDelete({ rut_empleado }).lean().exec();
      res.redirect('/cargas')
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener los detalles del cargas familiares' });
    }
  });

export default router

