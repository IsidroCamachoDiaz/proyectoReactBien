import React, { useState } from 'react';
import axios from 'axios';
import Util from './Recursos/Util';

const CrearAsignatura = () => {
  //Le asignamos el id del profesor
  const [datosAsignatura, setDatosAsignatura] = useState({
    idProfesor: Util.usuario.ID_PROFESOR,
    nombreAsignatura: ''
  });
  // Definición del estado 'mensaje' y la función 'setMensaje' para manejar el mensaje de respuesta
  const [mensaje, setMensaje] = useState('');

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (event) => {
    const { name, value } = event.target;
    setDatosAsignatura({ ...datosAsignatura, [name]: value });
  };

// Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
       // Enviar una solicitud POST al servidor con los datos de la nueva asignatura
      const response = await axios.post('http://localhost:3001/asignaturas', {
        id_profesor: Util.usuario.ID_PROFESOR,
        nombre_asignatura: datosAsignatura.nombreAsignatura
      });
      // Actualizar el estado mensaje con el mensaje de respuesta del servidor
      setMensaje(response.data.message);
       // Limpiar el estado 'datosAsignatura' después de agregar la asignatura
      setDatosAsignatura({ idProfesor: '', nombreAsignatura: '' });
    } catch (error) {
      console.error('Error al agregar asignatura:', error);
      setMensaje('Hubo un error al agregar la asignatura. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    //Se devuelve el html
    <><div className='container-fluid'>
      <div className='row'>
        <div className='col-md-4'></div>
        <div className='col-md-4'>
        <div>
      <h2>Crear Nueva Asignatura</h2>
      {/* Aquí comienza el formulario para crear una nueva asignatura  llamaremos al metodo handlesubmit*/}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombreAsignatura" className="form-label">Nombre de la Asignatura:</label>
          <input type="text" className="form-control" id="nombreAsignatura" name="nombreAsignatura" value={datosAsignatura.nombreAsignatura} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Crear Asignatura</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
        </div>
        <div className='col-md-4'></div>
      </div>
    </div>
  </>
  );
};

export default CrearAsignatura;
