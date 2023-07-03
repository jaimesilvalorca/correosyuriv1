import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const cargasFamiliaresCollection = "cargasFamiliares"

const cargasFamiliaresSchema = new mongoose.Schema({
    rut_empleado: String,
    nombre_carga: String,
    parentesco: String,
    genero: String,
    rut_carga: String
})

mongoose.set("strictQuery", false)
cargasFamiliaresSchema.plugin(mongoosePaginate)
const cargasFamiliaresModel = mongoose.model(cargasFamiliaresCollection, cargasFamiliaresSchema)

export default cargasFamiliaresModel