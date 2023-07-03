import { Router } from 'express'
import contactosModel from '../dao/models/contactos.models.js'
// const {Router} = require('express')
// const fs = require ('fs')
// import fs from 'fs'
// const filename = './contactosManager.json'

const router = Router()

router.get("/registrar", async (req, res) => {
    // const contactos = await contactosModel.find().lean().exec()
    // const limit = req.query.limit || 5
    // res.json(contactoss.slice(0, parseInt(limit)))
    res.render('registrarContactos')
})

router.get("/search", async (req, res) => {
    // const contactos = await contactosModel.find().lean().exec()
    // const limit = req.query.limit || 5
    // res.json(contactos.slice(0, parseInt(limit)))
    res.render('searchContactos')
})

router.get("/buscar", async (req, res) => {
    try {
      const rutEmpleado = req.query.rut_empleado;
      const contactos = await contactosModel.find({rut_empleado: rutEmpleado});
      
      if (contactos.length === 0) {
        return res.status(404).json({ message: "No se encontraron Contactos" });
      }
      const contactosPlain = contactos.map(contacto => contacto.toObject());
      
      return res.render("searchokContactos", { contactos: contactosPlain });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error en el servidor al buscar contactos" });
    }
  });

router.get("/view", async (req, res) => {
    const contactos = await contactosModel.find().lean().exec()
    res.render('realTimecontactos', {
        data: contactos
    })
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const contactos = await contactosModel.findOne({ _id: id })
    res.json({
        contactos
    })
})

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid
    const contactosDeleted = await contactosModel.deleteOne({ _id: id })

    req.io.emit('updatedcontactos', await contactosModel.find().lean().exec());
    res.json({
        status: "Success",
        massage: "contactos eliminado",
        contactosDeleted
    })
})

router.post("/", async (req, res) => {
    try {
        const contactos = req.body
        if (!contactos.rut_empleado) {
            return res.status(400).json({
                message: "Error no se ingresó el rut del Empleado"
            })
        }
        if (!contactos.nombre_contacto) {
            return res.status(400).json({
                message: "Error no se ingresó el nombre del contacto"
            })
        }
        if (!contactos.relacion) {
            return res.status(400).json({
                message: "Error no se ingresó la Relacion"
            })
        }
        if (!contactos.telefono) {
            return res.status(400).json({
                message: "Error no se ingresó el telefono"
            })
        }

        const user = await contactosModel.findOne({ telefono: contactos.telefono });

        if (user && contactos.telefono === user.telefono) {
            console.log('contactos ya existe');
            return res.status(409).json({ message: "Error, el telefono del contacto ya está registrado" });
        }

        const contactosAdded = await contactosModel.create(contactos);
        console.log(contactosAdded)
        
        return res.redirect('/contactos')

    } catch (error) {
        console.log(error)
        res.json({
            error
        })
    }
})

router.put("/:pid", async (req, res) => {
    const id = req.params.pid
    const contactosToUpdate = req.body

    const contactos = await contactosModel.updateOne({
        _id: id
    }, contactosToUpdate)
    req.io.emit('updatedcontactos', await contactosModel.find().lean().exec());
    res.json({
        status: "contactos actualizado",
        contactos
    })
})





router.post('/:rut_empleado/editar', async (req, res) => {
    try {
      const rut = req.params.rut_empleado;
      const {rut_empleado, nombre_contacto, relacion, telefono } = req.body;
  
      // Realiza la actualización del contactos en la base de datos
      await contactosModel.findOneAndUpdate({ rut_empleado }, {rut_empleado,nombre_contacto, relacion, telefono });
  
      // Redirige a la página de lista de empleados o a una página de confirmación
      res.redirect('/contactos');
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al actualizar el Contactos de Emergencia' });
    }
  });

  
  
  router.get('/:rut_empleado/editar', async (req, res) => {
    try {
      const rut_empleado = req.params.rut_empleado;
      const contactos = await contactosModel.findOneAndUpdate({ rut_empleado }).lean().exec();
      res.render('editarContacto', { contactos });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener los detalles del contactos' });
    }
  });
  

  router.post('/:rut_empleado/eliminar', async (req, res) => {
    try {
      const rut_empleado = req.params.rut_empleado;
      const contactos = await contactosModel.findOneAndDelete({ rut_empleado }).lean().exec();
      return res.redirect('/contactos')
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener los detalles del contactos' });
    }
  });


export default router

