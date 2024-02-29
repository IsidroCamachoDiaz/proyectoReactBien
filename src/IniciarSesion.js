import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { encriptarContrasenia } from './Recursos/encriptar.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Util from './Recursos/Util.js';

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
    let usuario;
    try {
      // Obtener los datos del usuario por correo electrónico
      const response = await axios.get(`http://localhost:3001/alumnos/${formulario.correo}`); // Cambiamos la ruta del endpoint
      usuario = response.data;
      console.log(usuario);
      if (!usuario) {
        setError('Correo electrónico no registrado');
        setSesionIniciada(false);
        return <Navigate to="/" />;
      }

      // Verificar si la contraseña encriptada coincide
      const contraseniaEncriptada = encriptarContrasenia(formulario.contrasenia);

      if (usuario.contrasenia == contraseniaEncriptada.value) {
        setSesionIniciada(true);

      }
      else{
        setError('Contraseña incorrecta');
        setSesionIniciada(false);
        return <Navigate to="/" />;
      }

      //Asignamos el usuario a la variable estatica
      Util.usuario=usuario;
      console.log(usuario);
      // Iniciar sesión exitosa, redirigir a la página principal
      

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
      setSesionIniciada(false);
    }
    try {
      // Obtener los datos del usuario por correo electrónico
      const response = await axios.get(`http://localhost:3001/profesores/${formulario.correo}`); // Cambiamos la ruta del endpoint
      //Asignamos el usuario
      usuario = response.data;
      console.log(usuario);

      //Si no hay usuario avisamos al usuario
      if (!usuario) {
        setError('Correo electrónico no registrado');
        setSesionIniciada(false);
        return <Navigate to="/" />;
      }

      // Verificar si la contraseña encriptada coincide
      const contraseniaEncriptada = encriptarContrasenia(formulario.contrasenia);

      //Comprobamos si la contraseña es la correcta
      if (usuario.contrasenia == contraseniaEncriptada.value) {
        setSesionIniciada(true);

      }
      else{
        setError('Contraseña incorrecta');
        setSesionIniciada(false);
        return <Navigate to="/" />;
      }

      //Asiganmos el usuario
      Util.usuario=usuario;
      console.log(usuario);
      // Iniciar sesión exitosa, redirigir a la página principal

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
      setSesionIniciada(false);
    }


  };

  //Si esta la sesion inicada se lleva al menu
  if (sesionIniciada) {
    console.log("Bien");
    return <Navigate to="/menu" />;

  }

  //Devolvemos el html
  return (
    <><div className="container-fluid"><div className="row">
      <div className="col-md-4"></div>
      <div className="col-md-4">
      <h2>Iniciar Sesión</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group text-left">
          <label htmlFor="correo">Correo Electrónico:</label>
          <input className="form-control"
            type="email"
            id="correo"
            name="correo"
            value={formulario.correo}
            onChange={handleChange}
            required />
        </div>
        <div className="form-group text-left">
          <label htmlFor="contrasenia">Contraseña:</label>
          <input className="form-control"
            type="password"
            id="contrasenia"
            name="contrasenia"
            value={formulario.contrasenia}
            onChange={handleChange}
            required />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Iniciar Sesión</button>
      </form>
      <button className='btn btn-primary'>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' ,margin: '10px'}} >Registrarse</Link>
      </button>
      </div>
      <div className="col-md-4"></div>      
    </div>
    </div></>
  );
};

export default IniciarSesion;
