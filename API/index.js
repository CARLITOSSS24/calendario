import express from 'express';
import cors from 'cors';
import usuariosRouter from './src/routers/usuariosRouter.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api', usuariosRouter);   
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});



