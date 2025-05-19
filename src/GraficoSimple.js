// src/GraficoSimple.js
import React from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const datos = [
  { nombre: 'Enero', ventas: 400 },
  { nombre: 'Febrero', ventas: 300 },
  { nombre: 'Marzo', ventas: 500 },
  { nombre: 'Abril', ventas: 200 },
  { nombre: 'Mayo', ventas: 600 }
];

function GraficoSimple() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={datos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <Line type="monotone" dataKey="ventas" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="nombre" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default GraficoSimple;
