import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const dataPath = path.join(path.resolve(), 'data', 'sports.json');

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/agregar', (req, res) => {
    const { nombre, precio } = req.query;
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) throw err;
        const sports = JSON.parse(data);
        sports.push({ nombre, precio });
        fs.writeFile(dataPath, JSON.stringify(sports, null, 2), (err) => {
            if (err) throw err;
            res.status(201).json('Deporte creado con éxito');
        });
    });
});

app.get('/deportes', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) throw err;
        res.json({ deportes: JSON.parse(data) });
    });
});

app.get('/editar', (req, res) => {
    const { nombre, precio } = req.query;
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) throw err;
        const sports = JSON.parse(data);
        const sport = sports.find(s => s.nombre === nombre);
        if (sport) {
            sport.precio = precio;
            fs.writeFile(dataPath, JSON.stringify(sports, null, 2), (err) => {
                if (err) throw err;
                res.json('Precio actualizado con éxito');
            });
        } else {
            res.status(404).json('Deporte no encontrado');
        }
    });
});

app.get('/eliminar', (req, res) => {
    const { nombre } = req.query;
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) throw err;
        let sports = JSON.parse(data);
        sports = sports.filter(s => s.nombre !== nombre);
        fs.writeFile(dataPath, JSON.stringify(sports, null, 2), (err) => {
            if (err) throw err;
            res.json('Deporte eliminado con éxito');
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
