import React, { useState } from 'react';
import axios from 'axios';
import Util from './Recursos/Util';

const CrearAsignatura = () => {
  const [datosAsignatura, setDatosAsignatura] = useState({
    idProfesor: Util.usuario.ID_PROFESOR,
    nombreAsignatura: ''
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDatosAsignatura({ ...datosAsignatura, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/asignaturas', {
        id_profesor: Util.usuario.ID_PROFESOR,
        nombre_asignatura: datosAsignatura.nombreAsignatura
      });
      setMensaje(response.data.message);
      setDatosAsignatura({ idProfesor: '', nombreAsignatura: '' });
    } catch (error) {
      console.error('Error al agregar asignatura:', error);
      setMensaje('Hubo un error al agregar la asignatura. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <><div className='container-fluid'>
      <div className='row'>
        <div className='col-md-4'></div>
        <div className='col-md-4'>
        <div>
      <h2>Crear Nueva Asignatura</h2>
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
