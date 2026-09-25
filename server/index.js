require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Conexión con Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET: obtener todas las tareas
app.get('/tasks', async (req, res) => {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST: crear una tarea nueva
app.post('/tasks', async (req, res) => {
  const { text, category } = req.body;

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ text, category, completed: false }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// PUT: actualizar una tarea (marcar completada/pendiente)
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const { data, error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// DELETE: eliminar una tarea
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});