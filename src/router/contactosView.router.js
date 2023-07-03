import { Router } from 'express'
import contactosModel from '../dao/models/contactos.models.js'
// import fs from 'fs'
// const {Router} = require('express')
// const fs = require ('fs')
// const filename = './empleadoManager.json'

const router = Router()


router.get("/", async (req, res) => {

    const limit = req.query?.limit || 10
    const page = req.query?.page || 1
    const filter = req.query?.filter || ''
    const sortQuery = req.query?.sort || ''
    const sortQueryOrder = req.query?.sortorder || 'desc'

    const search = {}
    if(filter) {
        search.title = filter
    }
    const sort = {}
    if (sortQuery) {
        sort[sortQuery] = sortQueryOrder
    }

    const options = {
        limit, 
        page, 
        sort,
        lean: true
    }
    
    const data = await contactosModel.paginate(search, options)
    console.log(JSON.stringify(data, null, 2, '\t'));
    const user = req.user.user
    const front_pagination = []
    for (let index = 1; index <= data.totalPages; index++) {
        front_pagination.push({
            page: index,
            active: index == data.page
        })
        
    }
    res.render('contactos', {data,user,front_pagination})

    // if(req.session.email === 'jaimesilvalorca@gmail.com' && req.session.password==='Darkshadow.12') return res.render('empleados', {data, user})
})

router.get('/:rut/editar', async (req, res) => {
    try {
      const rut = req.params.rut;
      const empleado = await empleadoModel.findOne({ rut }).lean().exec();
      res.render('editar-empleado', { empleado });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener los detalles del empleado' });
    }
  });
  
  router.post('/:rut', async (req, res) => {
    try {
      const rut = req.params.rut;
      const empleado = req.body;
      await empleadoModel.findOneAndUpdate({ rut }, empleado);
      res.redirect('/empleados');
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al actualizar el empleado' });
    }
  });
  

  router.post('/:rut/eliminar', async (req, res) => {
    try {
      const rut = req.params.rut;
      const empleado = await empleadoModel.findOneAndDelete({ rut }).lean().exec();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener los detalles del empleado' });
    }
  });

export default router