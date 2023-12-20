import mongoose from 'mongoose';
const usuariosSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
//Mismo nombre de coleccion
const UsuariosModelo = mongoose.model('usuarios', usuariosSchema);

export default UsuariosModelo;
