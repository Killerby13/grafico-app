import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [data, setData] = useState([]);
  const [columnas, setColumnas] = useState([]);

  const handleFileUpload = (e) => {
    const archivo = e.target.files[0];
    const nombre = archivo.name.toLowerCase();

    if (nombre.endsWith('.xlsx') || nombre.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const workbook = XLSX.read(evt.target.result, { type: 'binary' });
        const hoja = workbook.SheetNames[0];
        const datos = XLSX.utils.sheet_to_json(workbook.Sheets[hoja]);
        setData(datos);
        setColumnas(Object.keys(datos[0] || {}));
      };
      reader.readAsBinaryString(archivo);
    } else if (nombre.endsWith('.csv')) {
      Papa.parse(archivo, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          setData(results.data);
          setColumnas(Object.keys(results.data[0] || {}));
        }
      });
    } else {
      alert('Solo se permiten archivos .csv o .xlsx');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>📂 Cargar archivo (.csv / .xlsx)</h2>
      <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} className="form-control" />

      {data.length > 0 && columnas.length >= 2 && (
        <>
          <h4 style={{ marginTop: 40 }}>📈 Vista previa (primeras columnas)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.slice(0, 20)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={columnas[0]} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey={columnas[1]} stroke="#8884d8" />
            </LineChart>
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
                    <td key={jdx}>{row[col]}</td>
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
