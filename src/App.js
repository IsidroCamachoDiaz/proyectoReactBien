import './App.css';
import IniciarSesion from './IniciarSesion';
import RegistroAlumno from './RegistroAlumno';
import Menu from './Menu';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router> {/* Wrap your Routes in a Router component */}
      <Routes>
        <Route path="/" element={<RegistroAlumno />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
  );
}

export default App;
