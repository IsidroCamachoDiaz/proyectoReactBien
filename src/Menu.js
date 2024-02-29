import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css'; // Importa el archivo CSS para los estilos
import Util from './Recursos/Util.js';

//Componente del menu de la web
export const Menu = () => {
  console.log(Util.usuario);
  const esProfesor = Util.usuario && Util.usuario.ID_PROFESOR;
  //Devolvemos el html
  return (
    <div className="menu">
      <nav>
        <ul>
          <li>
            <Link to="/asignaturas">Asignaturas</Link>
          </li>
          <li>
            <Link to="/preguntas">Preguntas</Link>
          </li>
          <li>
            <Link to="/respuestas">Respuestas</Link>
          </li>
          <li>
          {esProfesor && <li><Link to="/crear-asignatura">Crear Asignatura</Link></li>}
          </li>
          <li>
          {esProfesor && <li><Link to="/crear-pregunta">Crear Pregunta</Link></li>}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
