import bcrypt from 'bcryptjs';

export const encriptarContrasenia = async (contrasenia) => {
  try {
    const salt = await bcrypt.genSalt(10); // Generar una sal para el hash
    const hash = await bcrypt.hash(contrasenia, salt); // Generar el hash de la contraseña
    return hash;
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    throw error;
  }
};
