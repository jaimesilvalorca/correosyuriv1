import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const contactosCollection = "contactos"

const contactosSchema = new mongoose.Schema({
    rut_empleado: String,
    nombre_contacto: String,
    relacion: String,
    telefono: Number,
})

mongoose.set("strictQuery", false)
contactosSchema.plugin(mongoosePaginate)
const contactosModel = mongoose.model(contactosCollection, contactosSchema)

export default contactosModel