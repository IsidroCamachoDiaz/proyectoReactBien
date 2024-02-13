import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { encriptarContrasenia } from './Recursos/encriptar.js';

const IniciarSesion = () => {
  const [formulario, setFormulario] = useState({
    correo: '',
    contrasenia: ''
  });

  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Obtener los datos del usuario por correo electrónico
      const response = await axios.get(`http://localhost:3001/alumnos/${formulario.correo}`); // Cambiamos la ruta del endpoint
      const usuario = response.data;
      console.log(usuario);
      if (!usuario) {
        setError('Correo electrónico no registrado');
        return;
      }

      // Verificar si la contraseña encriptada coincide
      const contraseniaEncriptada = encriptarContrasenia(formulario.contrasenia);
      
      if (usuario.contrasenia != contraseniaEncriptada.value) {
        setError('Contraseña incorrecta');
        return;
      }

      // Iniciar sesión exitosa, redirigir a la página principal
      setSesionIniciada(true);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  if (sesionIniciada) {
    console.log("Bien");
    return <Navigate to="/menu" />;
    
  }

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="correo">Correo Electrónico:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formulario.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="contrasenia">Contraseña:</label>
          <input
            type="password"
            id="contrasenia"
            name="contrasenia"
            value={formulario.contrasenia}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default IniciarSesion;
