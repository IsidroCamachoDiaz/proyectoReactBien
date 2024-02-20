import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Util from './Recursos/Util.js';

const PreguntasAlumno = ({ idAlumno }) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [preguntasPorAsignatura, setPreguntasPorAsignatura] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerAsignaturas();
  }, []);

  const obtenerAsignaturas = async () => {
    try {
      // Obtener las inscripciones del alumno
      const responseInscripciones = await axios.get(`http://localhost:3001/inscripciones/${Util.usuario.ID_ALUMNO}`);
      const inscripciones = responseInscripciones.data;

      // Extraer los IDs de asignatura de las inscripciones
      const idsAsignaturas = inscripciones.map(inscripcion => inscripcion.ID_ASIGNATURA);

      // Filtrar las asignaturas del servidor utilizando los IDs obtenidos
      const responseAsignaturas = await axios.get('http://localhost:3001/asignaturas');
      const asignaturasFiltradas = responseAsignaturas.data.filter(asignatura => idsAsignaturas.includes(asignatura.ID_ASIGNATURA));

      // Establecer las asignaturas en el estado
      setAsignaturas(asignaturasFiltradas);

      // Obtener las preguntas por cada asignatura
      obtenerPreguntasPorAsignatura(idsAsignaturas);
    } catch (error) {
      console.error('Error al obtener asignaturas:', error);
      setError('Error al obtener asignaturas. Por favor, inténtalo de nuevo más tarde.');
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

  return (
    <div>
      <h2>Preguntas del Alumno</h2>
      {error && <p>{error}</p>}
      {asignaturas.length === 0 && <p>No estás inscrito en ninguna asignatura.</p>}
      {asignaturas.map(asignatura => (
        <div key={asignatura.ID_ASIGNATURA}>
          <h3>Preguntas de la Asignatura {asignatura.NOMBRE_ASIGNATURA}</h3>
          <ul>
            {preguntasPorAsignatura[asignatura.ID_ASIGNATURA]?.map((pregunta, index) => (
              <li key={index}>{pregunta.TEXTO}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PreguntasAlumno;
