import './App.css';
import IniciarSesion from './IniciarSesion';
import RegistroAlumno from './RegistroAlumno';
import Menu from './Menu';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InscripcionesAlumno from './Inscripcion';
import CrearAsignatura from './CrearAsignatura';
import PreguntasInscritasAlumno from './Preguntas';
import CrearPregunta from './CrearPregunta';
import ContestarPreguntas from './Respuesta';


function App() {
  return (
    <Router> {/*Aqui se ponen las rutas de la web*/}
      <Routes>
        <Route path="/" element={<RegistroAlumno />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/asignaturas" element={<InscripcionesAlumno />} />
        <Route path="/preguntas" element={<PreguntasInscritasAlumno />} />
        <Route path="/respuestas" element={<ContestarPreguntas/>} />
        <Route path="/crear-asignatura" element={<CrearAsignatura />} />
        <Route path="/crear-pregunta" element={<CrearPregunta />} />
      </Routes>
    </Router>
  );
}

export default App;
