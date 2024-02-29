import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Util from './Recursos/Util.js';

const ContestarPreguntas = ({ idAlumno }) => {
  // Estado para almacenar las inscripciones del alumno
  const [inscripciones, setInscripciones] = useState([]);
  // Estado para almacenar las preguntas por asignatura
  const [preguntasPorAsignatura, setPreguntasPorAsignatura] = useState({});
  // Estado para almacenar las respuestas por pregunta
  const [respuestasPorPregunta, setRespuestasPorPregunta] = useState({});
  // Estado para manejar los errores
  const [error, setError] = useState('');
  // Estado para el texto de la respuesta del alumno
  const [textoRespuesta, setTextoRespuesta] = useState('');

  // Efecto para cargar las inscripciones del alumno y las preguntas por asignatura al montar el componente
  useEffect(() => {
    obtenerInscripciones();
  }, []);

  // Función para obtener las inscripciones del alumno
  const obtenerInscripciones = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/inscripciones/${Util.usuario.ID_ALUMNO}`);
      setInscripciones(response.data);
      const idsAsignaturas = response.data.map(inscripcion => inscripcion.ID_ASIGNATURA);
      obtenerPreguntasPorAsignatura(idsAsignaturas);
    } catch (error) {
      console.error('Error al obtener inscripciones del alumno:', error);
      setError('Error al obtener inscripciones del alumno. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  // Función para obtener las preguntas por asignatura
  const obtenerPreguntasPorAsignatura = async (idsAsignaturas) => {
    try {
      const preguntas = {};
      await Promise.all(idsAsignaturas.map(async (idAsignatura) => {
        const response = await axios.get(`http://localhost:3001/preguntas/${idAsignatura}`);
        preguntas[idAsignatura] = response.data;
      }));
      setPreguntasPorAsignatura(preguntas);
    } catch (error) {
      console.error('Error al obtener preguntas por asignatura:', error);
      setError('Error al obtener preguntas por asignatura. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  // Función para obtener las respuestas por pregunta
  const obtenerRespuestasPorPregunta = async (idPregunta) => {
    try {
      const response = await axios.get(`http://localhost:3001/respuestas/${idPregunta}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener respuestas por pregunta:', error);
      setError('Error al obtener respuestas por pregunta. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  // Función para manejar la respuesta del alumno a una pregunta
  const handleResponderPregunta = async (idPregunta) => {
    try {
      await axios.post('http://localhost:3001/respuestas', { id_pregunta: idPregunta, texto: textoRespuesta });
      // Actualizar las respuestas después de responder a la pregunta
      const respuestas = await obtenerRespuestasPorPregunta(idPregunta);
      setRespuestasPorPregunta({ ...respuestasPorPregunta, [idPregunta]: respuestas });
    } catch (error) {
      console.error('Error al responder a la pregunta:', error);
      setError('Error al responder a la pregunta. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  // Función para verificar si el alumno ha respondido a una pregunta específica
  const alumnoHaRespondido = async (idPregunta) => {
    try {
      const response = await axios.get(`http://localhost:3001/ha-respondido/${idPregunta}/${idAlumno}`);
      return response.data.haRespondido;
    } catch (error) {
      console.error('Error al verificar si el alumno ha respondido:', error);
      setError('Error al verificar si el alumno ha respondido. Por favor, inténtalo de nuevo más tarde.');
      return false;
    }
  };

  // Función para cargar las respuestas de otras preguntas si el alumno ha respondido a la pregunta
  const cargarRespuestas = async (idPregunta) => {
    if (!alumnoHaRespondido(idPregunta)) return;
    if (!respuestasPorPregunta[idPregunta]) {
      const respuestas = await obtenerRespuestasPorPregunta(idPregunta);
      setRespuestasPorPregunta({ ...respuestasPorPregunta, [idPregunta]: respuestas });
    }
  };

  // Renderización del componente
  return (
    <div>
      <h2>Contestar Preguntas</h2>
      {/* Mostrar mensaje de error si existe */}
      {error && <p>{error}</p>}
      {/* Mostrar mensaje si el alumno no está inscrito en ninguna asignatura */}
      {inscripciones.length === 0 && <p>No estás inscrito en ninguna asignatura.</p>}
      {/* Iterar sobre las inscripciones para mostrar las preguntas por asignatura */}
      {Object.entries(preguntasPorAsignatura).map(([idAsignatura, preguntas]) => (
        <div key={idAsignatura}>
          <h3>Preguntas de la Asignatura {idAsignatura}</h3>
          <ul>
            {/* Iterar sobre las preguntas para mostrarlas */}
            {preguntas.map((pregunta, index) => (
              <li key={index}>
                {/* Mostrar el texto de la pregunta */}
                {pregunta.TEXTO}
                {/* Mostrar input y botón para responder a la pregunta si el alumno no ha respondido */}
                {!alumnoHaRespondido(pregunta.ID_PREGUNTA) && (
                  <div>
                    <input type="text" value={textoRespuesta} onChange={(e) => setTextoRespuesta(e.target.value)} />
                    <button onClick={() => handleResponderPregunta(pregunta.ID_PREGUNTA)} className='btn btn-primary'>
                      Responder
                    </button>
                  </div>
                )}
                {/* Mostrar botón para ver respuestas si el alumno ha respondido */}
                {alumnoHaRespondido(pregunta.ID_PREGUNTA) && (
                  <button onClick={() => cargarRespuestas(pregunta.ID_PREGUNTA)} className='btn btn-primary'>
                    Ver Respuestas
                  </button>
                )}
                {/* Mostrar respuestas si están cargadas */}
                {alumnoHaRespondido(pregunta.ID_PREGUNTA) && respuestasPorPregunta[pregunta.ID_PREGUNTA] && (
                  <ul>
                    {/* Iterar sobre las respuestas para mostrarlas */}
                    {respuestasPorPregunta[pregunta.ID_PREGUNTA].map((respuesta, index) => (
                      <li key={index}>{respuesta.TEXTO}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ContestarPreguntas;
