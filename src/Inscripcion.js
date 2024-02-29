import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Util from './Recursos/Util.js';

// Componente funcional para manejar las inscripciones de un alumno a asignaturas
const InscripcionesAlumno = () => {
   // Estados para almacenar datos relacionados con las inscripciones y las asignaturas disponibles
  const [inscripciones, setInscripciones] = useState([]);
  const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);
  const [idAsignaturaSeleccionada, setIdAsignaturaSeleccionada] = useState('');
  const [mensaje, setMensaje] = useState('');

   // Efecto para cargar las inscripciones del alumno al cargar el componente
  useEffect(() => {
    obtenerInscripciones();
  }, []);

  // Efecto para obtener las asignaturas disponibles cada vez que las inscripciones del alumno cambian
  useEffect(() => {
    obtenerAsignaturasDisponibles();
  }, [inscripciones]);

  // Función para obtener las inscripciones del alumno desde el servidor
  const obtenerInscripciones = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/inscripciones/${Util.usuario.ID_ALUMNO}`);
      // Mostrar las inscripciones en la consola para fines de depuración
      console.log("Inscripciones:", response.data);
      // Actualizar el estado 'inscripciones' con las inscripciones obtenidas
      setInscripciones(response.data);
    } catch (error) {
      console.error('Error al obtener inscripciones del alumno:', error);
    }
  };

  // Función para obtener las asignaturas disponibles para inscripción desde el servidor
  const obtenerAsignaturasDisponibles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/asignaturas');
      // Mostrar las asignaturas disponibles en la consola para fines de depuración
      console.log("Asignaturas disponibles:", response.data);
      // Filtrar las asignaturas disponibles para inscripción
      const asignaturasFiltradas = response.data.filter(asignatura => !inscripciones.find(inscripcion => inscripcion.ID_ASIGNATURA === asignatura.ID_ASIGNATURA));
      // Actualizar el estado asignaturasDisponibles con las asignaturas filtradas
      setAsignaturasDisponibles(asignaturasFiltradas);
    } catch (error) {
      console.error('Error al obtener asignaturas disponibles:', error);
    }
  };

  // Función para inscribir al alumno en una asignatura seleccionada
  const inscribirseAsignatura = async () => {
    try {
      // Enviar una solicitud POST al servidor para realizar la inscripción
      await axios.post('http://localhost:3001/inscripciones', { idAlumno: Util.usuario.ID_ALUMNO, idAsignatura: idAsignaturaSeleccionada });
      console.log("Inscripción realizada correctamente");
       // Actualizar el estado mensaje con un mensaje de éxito
      setMensaje('Inscripción realizada correctamente');
       // Actualizar las inscripciones del alumno
      obtenerInscripciones();
       // Limpiar el ID de la asignatura seleccionada después de la inscripción
      setIdAsignaturaSeleccionada('');
    } catch (error) {
      console.error('Error al inscribirse a la asignatura:', error);
      setMensaje('Hubo un error al inscribirse a la asignatura. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  //Mostramos el html
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
