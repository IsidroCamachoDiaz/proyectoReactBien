import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Util from './Recursos/Util.js';

// Componente funcional para crear una nueva pregunta
const CrearPregunta = () => {

   // Estados para almacenar datos relacionados con la pregunta y el mensaje de respuesta
  const [asignaturas, setAsignaturas] = useState([]);
  const [idAsignaturaSeleccionada, setIdAsignaturaSeleccionada] = useState('');
  const [textoPregunta, setTextoPregunta] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Efecto para cargar las asignaturas del profesor al cargar el componente
  useEffect(() => {
    obtenerAsignaturasProfesor();
  }, []);

   // Función para obtener las asignaturas del profesor desde el servidor
  const obtenerAsignaturasProfesor = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/asignaturas?idProfesor=${Util.usuario.id_profesor}`);
      setAsignaturas(response.data);
    } catch (error) {
      console.error('Error al obtener asignaturas del profesor:', error);
      setMensaje('Error al obtener asignaturas del profesor. Por favor, inténtalo de nuevo más tarde.');
    }
  };

   // Función para manejar el envío del formulario y agregar una nueva pregunta
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
       // Enviar una solicitud POST al servidor para agregar la pregunta
      await axios.post('http://localhost:3001/preguntas', { id_asignatura: idAsignaturaSeleccionada, texto: textoPregunta });
      // Actualizar el estado mensaje con el mensaje de éxito
      setMensaje('Pregunta agregada correctamente'); 
      // Limpiar el campo de texto de la pregunta después de agregarla
      setTextoPregunta('');
    } catch (error) {
      console.error('Error al agregar pregunta:', error);
      setMensaje('Hubo un error al agregar la pregunta. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  // Renderización del componente en el fomulario enseñamos las asignaturas del profesor
  return (
    <div>
      <h2>Crear Nueva Pregunta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="idAsignatura" className="form-label">Asignatura:</label>
          <select id="idAsignatura" value={idAsignaturaSeleccionada} onChange={(e) => setIdAsignaturaSeleccionada(e.target.value)} className="form-select">
            <option value="">Selecciona una asignatura</option>
            {asignaturas.map((asignatura) => (
              <option key={asignatura.ID_ASIGNATURA} value={asignatura.ID_ASIGNATURA}>{asignatura.NOMBRE_ASIGNATURA}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="textoPregunta" className="form-label">Texto de la Pregunta:</label>
          <input type="text" className="form-control" id="textoPregunta" value={textoPregunta} onChange={(e) => setTextoPregunta(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Crear Pregunta</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default CrearPregunta;
