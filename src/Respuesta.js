import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Util from './Recursos/Util.js';

const ContestarPreguntas = ({ idAlumno }) => {
    const [inscripciones, setInscripciones] = useState([]);
    const [preguntasPorAsignatura, setPreguntasPorAsignatura] = useState({});
    const [respuestasPorPregunta, setRespuestasPorPregunta] = useState({});
    const [error, setError] = useState('');
    const [textoRespuesta, setTextoRespuesta] = useState('');
  
    useEffect(() => {
      obtenerInscripciones();
    }, []);
  
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
  
    const obtenerRespuestasPorPregunta = async (idPregunta) => {
      try {
        const response = await axios.get(`http://localhost:3001/respuestas/${idPregunta}`);
        return response.data;
      } catch (error) {
        console.error('Error al obtener respuestas por pregunta:', error);
        setError('Error al obtener respuestas por pregunta. Por favor, inténtalo de nuevo más tarde.');
      }
    };
  
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
  
    // Verificar si el alumno ha respondido a una pregunta específica
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
  
    // Cargar las respuestas de otras preguntas si el alumno ha respondido a la pregunta
    const cargarRespuestas = async (idPregunta) => {
      if (!alumnoHaRespondido(idPregunta)) return;
      if (!respuestasPorPregunta[idPregunta]) {
        const respuestas = await obtenerRespuestasPorPregunta(idPregunta);
        setRespuestasPorPregunta({ ...respuestasPorPregunta, [idPregunta]: respuestas });
      }
    };
  
    return (
      <div>
        <h2>Contestar Preguntas</h2>
        {error && <p>{error}</p>}
        {inscripciones.length === 0 && <p>No estás inscrito en ninguna asignatura.</p>}
        {Object.entries(preguntasPorAsignatura).map(([idAsignatura, preguntas]) => (
          <div key={idAsignatura}>
            <h3>Preguntas de la Asignatura {idAsignatura}</h3>
            <ul>
              {preguntas.map((pregunta, index) => (
                <li key={index}>
                  {pregunta.TEXTO}
                  {!alumnoHaRespondido(pregunta.ID_PREGUNTA) && (
                    <div>
                      <input type="text" value={textoRespuesta} onChange={(e) => setTextoRespuesta(e.target.value)} />
                      <button onClick={() => handleResponderPregunta(pregunta.ID_PREGUNTA)} className='btn btn-primary'>
                        Responder
                      </button>
                    </div>
                  )}
                  {alumnoHaRespondido(pregunta.ID_PREGUNTA) && (
                    <button onClick={() => cargarRespuestas(pregunta.ID_PREGUNTA)} className='btn btn-primary'>
                      Ver Respuestas
                    </button>
                  )}
                  {alumnoHaRespondido(pregunta.ID_PREGUNTA) && respuestasPorPregunta[pregunta.ID_PREGUNTA] && (
                    <ul>
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