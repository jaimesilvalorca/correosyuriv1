import { Router } from 'express'
import empleadoModel from '../dao/models/empleados.models.js'
// const {Router} = require('express')
// const fs = require ('fs')
// import fs from 'fs'
// const filename = './empleadoManager.json'

const router = Router()

router.get("/registrar", async (req, res) => {
    // const empleados = await empleadoModel.find().lean().exec()
    // const limit = req.query.limit || 5
    // res.json(empleados.slice(0, parseInt(limit)))
    res.render('registrarEmpleado')
})

router.get("/search", async (req, res) => {
    // const empleados = await empleadoModel.find().lean().exec()
    // const limit = req.query.limit || 5
    // res.json(empleados.slice(0, parseInt(limit)))
    res.render('searchEmpleado')
})

router.get("/buscar", async (req, res) => {
    try {
      const rut = req.query.rut;
      const empleados = await empleadoModel.find({rut: rut});
      
      if (empleados.length === 0) {
        return res.status(404).json({ message: "No se encontraron empleados" });
      }
      const empleadosPlain = empleados.map(empleado => empleado.toObject());
      
      return res.render("searchokEmpleado", { empleados: empleadosPlain });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error en el servidor al buscar empleados" });
    }
  });


router.get("/view", async (req, res) => {
    const empleados = await empleadoModel.find().lean().exec()
    res.render('realTimeempleados', {
        data: empleados
    })
})

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid
    const empleadoDeleted = await empleadoModel.deleteOne({ _id: id })

    req.io.emit('updatedempleados', await empleadoModel.find().lean().exec());
    res.json({
        status: "Success",
        massage: "empleadoo eliminado",
        empleadoDeleted
    })
})

router.post("/", async (req, res) => {
    try {
        const empleado = req.body
        if (!empleado.nombre) {
            return res.status(400).json({
                message: "Error no se ingresó el nombre"
            })
        }
        if (!empleado.rut) {
            return res.status(400).json({
                message: "Error no se ingresó el rut"
            })
        }
        if (!empleado.fecha) {
            return res.status(400).json({
                message: "Error no se ingresó la fecha"
            })
        }
        if (!empleado.genero) {
            return res.status(400).json({
                message: "Error no se ingresó el genero"
            })
        }
        if (!empleado.salario) {
            return res.status(400).json({
                message: "Error no se ingresó el salario"
            })
        }
        if (!empleado.comuna) {
            return res.status(400).json({
                message: "Error no se ingresó la comuna"
            })
        }
        if (!empleado.direccion) {
            return res.status(400).json({
                message: "Error no se ingresó la dirección"
            })
        }
        if (!empleado.telefono) {
            return res.status(400).json({
                message: "Error no se ingresó el telefono"
            })
        }


        const user = await empleadoModel.findOne({ rut: empleado.rut });

        if (user && empleado.rut === user.rut) {
            console.log('Empleado ya existe');
            return res.status(409).json({ message: "Error, el RUT ya está registrado" });
        }

        const empleadoAdded = await empleadoModel.create(empleado);
        console.log(empleadoAdded)
        
        return res.redirect('/empleados')

    } catch (error) {
        console.log(error)
        res.json({
            error
        })
    }
})

router.put("/:pid", async (req, res) => {
    const id = req.params.pid
    const empleadoToUpdate = req.body

    const empleado = await empleadoModel.updateOne({
        _id: id
    }, empleadoToUpdate)
    req.io.emit('updatedempleados', await empleadoModel.find().lean().exec());
    res.json({
        status: "empleadoo actualizado",
        empleado
    })
})


router.post('/:rut/editar', async (req, res) => {
    try {
      const rut = req.params.rut;
      const { nombre, fecha, genero, cargo, salario } = req.body;
  
      // Realiza la actualización del empleado en la base de datos
      await empleadoModel.findOneAndUpdate({ rut }, { nombre, fecha, genero, cargo, salario });
  
      // Redirige a la página de lista de empleados o a una página de confirmación
      res.redirect('/empleados');
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al actualizar el empleado' });
    }
  });

  
  
  router.get('/:rut/editar', async (req, res) => {
    try {
      const rut = req.params.rut;
      const empleado = await empleadoModel.findOneAndUpdate({ rut }).lean().exec();
      res.render('editarEmpleado', { empleado });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener los detalles del empleado' });
    }
  });
  

  router.post('/:rut/eliminar', async (req, res) => {
    try {
      const rut = req.params.rut;
      const empleado = await empleadoModel.findOneAndDelete({ rut }).lean().exec();
      return res.redirect('/empleados')
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener los detalles del empleado' });
    }
  });


export default router

