import express from 'express';
import usuariosRouter from './src/routers/usuariosRouter.js';

const app = express();

app.use(express.json());
app.use('api', usuariosRouter);

app.use((req, res, err, next) => {
    console.error(err);
    res.status(500).json({ error: 'Error interno en el servidor' });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});



