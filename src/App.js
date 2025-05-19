import React, { useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const datosVentas = [
  { mes: 'Enero', ventas: 4000, categoria: 'Electrónica' },
  { mes: 'Febrero', ventas: 3000, categoria: 'Hogar' },
  { mes: 'Marzo', ventas: 2000, categoria: 'Electrónica' },
  { mes: 'Abril', ventas: 2780, categoria: 'Moda' },
  { mes: 'Mayo', ventas: 1890, categoria: 'Electrónica' },
  { mes: 'Junio', ventas: 2390, categoria: 'Moda' },
  { mes: 'Julio', ventas: 3490, categoria: 'Hogar' }
];

const resumenPorCategoria = [
  { name: 'Electrónica', value: 8000 },
  { name: 'Hogar', value: 6490 },
  { name: 'Moda', value: 5170 }
];

const colores = ['#0088FE', '#00C49F', '#FFBB28'];

function App() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [fechaInicio, setFechaInicio] = useState(new Date('2024-01-01'));
  const [fechaFin, setFechaFin] = useState(new Date('2024-12-31'));

  const filtrarDatos = () => {
    let filtrados = datosVentas;

    if (categoriaSeleccionada !== 'Todas') {
      filtrados = filtrados.filter(item => item.categoria === categoriaSeleccionada);
    }

    return filtrados;
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">📈 Panel de Ventas - React Demo</h1>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label>📂 Categoría</label>
          <select className="form-control" onChange={e => setCategoriaSeleccionada(e.target.value)}>
            <option value="Todas">Todas</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Hogar">Hogar</option>
            <option value="Moda">Moda</option>
          </select>
        </div>
        <div className="col-md-4">
          <label>📅 Desde</label>
          <DatePicker selected={fechaInicio} onChange={setFechaInicio} className="form-control" />
        </div>
        <div className="col-md-4">
          <label>📅 Hasta</label>
          <DatePicker selected={fechaFin} onChange={setFechaFin} className="form-control" />
        </div>
      </div>

      {/* Gráfica de línea */}
      <h4>📊 Ventas por Mes</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filtrarDatos()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ventas" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      {/* Gráfica de torta */}
      <h4 className="mt-5">🥧 Ventas por Categoría</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={resumenPorCategoria} dataKey="value" nameKey="name" outerRadius={100} label>
            {resumenPorCategoria.map((entry, index) => (
              <Cell key={index} fill={colores[index % colores.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Tabla de datos */}
      <h4 className="mt-5">📋 Detalle de Ventas</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Ventas</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {filtrarDatos().map((item, index) => (
            <tr key={index}>
              <td>{item.mes}</td>
              <td>${item.ventas}</td>
              <td>{item.categoria}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

