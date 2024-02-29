import bcrypt from 'bcryptjs';

// Función asincrónica para encriptar una contraseña utilizando bcrypt
export const encriptarContrasenia = async (contrasenia) => {
  try {
     // Generar una sal para el hash
    const salt = await bcrypt.genSalt(10); // Generar una sal para el hash
    // Generar el hash de la contraseña utilizando la sal generada
    const hash = await bcrypt.hash(contrasenia, salt); // Generar el hash de la contraseña
    // Devolver el hash resultante
    return hash;
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    throw error;
  }
};
