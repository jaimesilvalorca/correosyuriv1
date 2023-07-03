import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const empleadoCollection = "empleados"

const empleadoSchema = new mongoose.Schema({
    rut: String,
    nombre: String,
    fecha: String,
    genero: String,
    cargo: String,
    salario: Number,
    comuna: String,
    direccion: String,
    telefono: Number,
    afp: String,
    isapre: String
})

mongoose.set("strictQuery", false)
empleadoSchema.plugin(mongoosePaginate)
const empleadoModel = mongoose.model(empleadoCollection, empleadoSchema)

export default empleadoModel