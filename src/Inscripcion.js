import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Util from './Recursos/Util.js';

const InscripcionesAlumno = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);
  const [idAsignaturaSeleccionada, setIdAsignaturaSeleccionada] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerInscripciones();
  }, []);

  useEffect(() => {
    obtenerAsignaturasDisponibles();
  }, [inscripciones]);

  const obtenerInscripciones = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/inscripciones/${Util.usuario.ID_ALUMNO}`);
      console.log("Inscripciones:", response.data);
      setInscripciones(response.data);
    } catch (error) {
      console.error('Error al obtener inscripciones del alumno:', error);
    }
  };

  const obtenerAsignaturasDisponibles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/asignaturas');
      console.log("Asignaturas disponibles:", response.data);
      // Filtrar las asignaturas disponibles para inscripción
      const asignaturasFiltradas = response.data.filter(asignatura => !inscripciones.find(inscripcion => inscripcion.ID_ASIGNATURA === asignatura.ID_ASIGNATURA));
      setAsignaturasDisponibles(asignaturasFiltradas);
    } catch (error) {
      console.error('Error al obtener asignaturas disponibles:', error);
    }
  };

  const inscribirseAsignatura = async () => {
    try {
      await axios.post('http://localhost:3001/inscripciones', { idAlumno: Util.usuario.ID_ALUMNO, idAsignatura: idAsignaturaSeleccionada });
      console.log("Inscripción realizada correctamente");
      setMensaje('Inscripción realizada correctamente');
      obtenerInscripciones();
      setIdAsignaturaSeleccionada('');
    } catch (error) {
      console.error('Error al inscribirse a la asignatura:', error);
      setMensaje('Hubo un error al inscribirse a la asignatura. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <div>
            <h2>Inscripciones del alumno</h2>
            <ul>
              {inscripciones.map((inscripcion, index) => (
                <li key={index}>ID Inscripción: {inscripcion.ID_INSCRIPCION}, ID Asignatura: {inscripcion.ID_ASIGNATURA}</li>
              ))}
            </ul>
            <h2>Inscribirse a una asignatura</h2>
            <select value={idAsignaturaSeleccionada} onChange={(e) => setIdAsignaturaSeleccionada(e.target.value)} className="form-select">
              <option value="">Selecciona una asignatura</option>
              {asignaturasDisponibles.map((asignatura) => (
                <option key={asignatura.ID_ASIGNATURA} value={asignatura.ID_ASIGNATURA}>{asignatura.NOMBRE_ASIGNATURA}</option>
              ))}
            </select>
            <button onClick={inscribirseAsignatura} className='btn btn-primary' style={{ margin: '10px' }}>Inscribirse</button>
            {mensaje && <p>{mensaje}</p>}
          </div>
        </div>
        <div className="col-md-4"></div>
      </div>
    </div>
  );
};

export default InscripcionesAlumno;
