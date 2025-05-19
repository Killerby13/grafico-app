import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

// Función para formatear fecha
const formatearFecha = (valor) => {
  const fecha = new Date(valor);
  return isNaN(fecha.getTime()) ? valor : fecha.toLocaleDateString('es-ES');
};

// Mostrar cualquier valor como string legible
const mostrarValor = (valor) => {
  if (valor instanceof Date) return formatearFecha(valor);
  if (typeof valor === 'object') return JSON.stringify(valor);
  return valor?.toString() ?? '';
};

function App() {
  const [data, setData] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [colX, setColX] = useState('');
  const [colY, setColY] = useState('');
  const [tipoGrafico, setTipoGrafico] = useState('line');

  const handleFileUpload = (e) => {
    const archivo = e.target.files[0];
    const nombre = archivo.name.toLowerCase();

    const procesarDatos = (datos) => {
      const cols = Object.keys(datos[0] || {});
      const primeraColumna = cols[0]; // Solo la primera se trata como fecha

      datos.forEach(row => {
        if (row[primeraColumna]) {
          const posibleFecha = new Date(row[primeraColumna]);
          if (!isNaN(posibleFecha.getTime())) {
            row[primeraColumna] = posibleFecha;
          }
        }
      });

      setData(datos);
      setColumnas(cols);
      setColX(primeraColumna);
      setColY(cols[1] || '');
    };

    if (nombre.endsWith('.xlsx') || nombre.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const workbook = XLSX.read(evt.target.result, { type: 'binary' });
        const hoja = workbook.SheetNames[0];
        const datos = XLSX.utils.sheet_to_json(workbook.Sheets[hoja]);
        procesarDatos(datos);
      };
      reader.readAsBinaryString(archivo);
    } else if (nombre.endsWith('.csv')) {
      Papa.parse(archivo, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          procesarDatos(results.data);
        }
      });
    } else {
      alert('Solo se permiten archivos .csv o .xlsx');
    }
  };

  const renderGrafico = () => {
    if (!colX || !colY || data.length === 0) return null;

    const datosFiltrados = data
      .filter(row => row[colX] !== undefined && row[colY] !== undefined)
      .slice(0, 30);

    switch (tipoGrafico) {
      case 'line':
        return (
          <LineChart data={datosFiltrados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={colX} tickFormatter={mostrarValor} />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => `X: ${mostrarValor(label)}`}
              formatter={(value) => mostrarValor(value)}
            />
            <Line type="monotone" dataKey={colY} stroke="#8884d8" />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={datosFiltrados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={colX} tickFormatter={mostrarValor} />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => `X: ${mostrarValor(label)}`}
              formatter={(value) => mostrarValor(value)}
            />
            <Bar dataKey={colY} fill="#82ca9d" />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={datosFiltrados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={colX} tickFormatter={mostrarValor} />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => `X: ${mostrarValor(label)}`}
              formatter={(value) => mostrarValor(value)}
            />
            <Area type="monotone" dataKey={colY} stroke="#ffc658" fill="#ffc658" />
          </AreaChart>
        );
      case 'pie':
        const pieData = datosFiltrados
          .map(row => ({
            name: mostrarValor(row[colX]),
            value: row[colY]
          }))
          .filter(item => typeof item.value === 'number');

        return (
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={colores[index % colores.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>📂 Cargar archivo (.csv / .xlsx)</h2>
      <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} className="form-control" />

      {data.length > 0 && (
        <>
          <div style={{ marginTop: 30, marginBottom: 20 }}>
            <label>📈 Tipo de gráfico:&nbsp;</label>
            <select value={tipoGrafico} onChange={e => setTipoGrafico(e.target.value)}>
              <option value="line">Línea</option>
              <option value="bar">Barras</option>
              <option value="area">Área</option>
              <option value="pie">Torta</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label>Eje X:&nbsp;</label>
            <select value={colX} onChange={e => setColX(e.target.value)}>
              {columnas.map((col, i) => (
                <option key={i} value={col}>{col}</option>
              ))}
            </select>
            &nbsp;&nbsp;&nbsp;
            <label>Eje Y:&nbsp;</label>
            <select value={colY} onChange={e => setColY(e.target.value)}>
              {columnas.map((col, i) => (
                <option key={i} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <h4>📊 Visualización de datos</h4>
          <ResponsiveContainer width="100%" height={300}>
            {renderGrafico()}
          </ResponsiveContainer>

          <h4 className="mt-5">📋 Datos cargados (primeras filas)</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                {columnas.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, idx) => (
                <tr key={idx}>
                  {columnas.map((col, jdx) => (
                    <td key={jdx}>{mostrarValor(row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
