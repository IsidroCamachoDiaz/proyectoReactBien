import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export const Menu = () => {
  return (
    <h2>Hola</h2>
  );
};

const Asignaturas = () => <h2>Asignaturas</h2>;
const Preguntas = () => <h2>Preguntas</h2>;
const Respuestas = () => <h2>Respuestas</h2>;

export default Menu;
