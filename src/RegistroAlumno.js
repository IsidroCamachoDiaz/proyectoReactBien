import React, { useState } from 'react';
import axios from 'axios';
import { encriptarContrasenia } from './Recursos/encriptar.js';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Util from './Recursos/Util.js';

const RegistroAlumno = () => {
    const [formulario, setFormulario] = useState({
        correo: '',
        contrasenia: '',
        nombre: '',
        apellidos: ''
    });

    const [tipoUsuario, setTipoUsuario] = useState('alumno');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormulario({ ...formulario, [name]: value });
    };

    const handleTipoUsuarioChange = (event) => {
        setTipoUsuario(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            formulario.contrasenia = await encriptarContrasenia(formulario.contrasenia);

            let endpoint = tipoUsuario === 'alumno' ? 'http://localhost:3001/alumnos' : 'http://localhost:3001/profesores';

            await axios.post(endpoint, formulario);

            alert('Usuario registrado correctamente');

            Util.usuario=formulario;

            setFormulario({
                correo: '',
                contrasenia: '',
                nombre: '',
                apellidos: ''
            });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            alert('Hubo un error al registrar al usuario. Por favor, inténtalo de nuevo más tarde.');
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4">
                    <form onSubmit={handleSubmit}>
                        <h2>Registro de Usuario</h2>
                        <div className="form-group text-left">
                            <label htmlFor="correo">Correo:</label>
                            <input
                                className="form-control"
                                type="email"
                                id="correo"
                                name="correo"
                                value={formulario.correo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contrasenia">Contraseña:</label>
                            <input
                                className="form-control"
                                type="password"
                                id="contrasenia"
                                name="contrasenia"
                                value={formulario.contrasenia}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre:</label>
                            <input
                                className="form-control"
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formulario.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="apellidos">Apellidos:</label>
                            <input
                                className="form-control"
                                type="text"
                                id="apellidos"
                                name="apellidos"
                                value={formulario.apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tipoUsuario">Tipo de Usuario:</label>
                            <select
                                className="form-control"
                                id="tipoUsuario"
                                name="tipoUsuario"
                                value={tipoUsuario}
                                onChange={handleTipoUsuarioChange}
                            >
                                <option value="alumno">Alumno</option>
                                <option value="profesor">Profesor</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3" >Registrar Usuario</button>
                    </form>
                    <button className='btn btn-primary' style={{ margin: '10px' }}>
                        <Link to="/iniciar-sesion" style={{ textDecoration: 'none', color: 'white' }} >Iniciar Sesion</Link>
                    </button>
                </div>
                <div className="col-md-4"></div>
            </div>
        </div>
    );
};

export default RegistroAlumno;
