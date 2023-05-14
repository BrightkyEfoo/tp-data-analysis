import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import cors from 'cors';
import { spawn } from 'child_process';

const app = express();
const port = 9000;

app
  .use(
    cors({
      origin: '*',
    })
  )
  .use(morgan('dev'))
  .use(express.json());

app.get('/', (req, res) => {
  res.json('bienvenue sur le testeur de variances');
});



app.post('/test', (req, res) => {
  const echantillons = req.body.echantillons;
  const seuil = req.body.seuil || 0.05

  if (!echantillons) {
    return res.status(400).json({ msg: 'erreur de traitement veuillez fournir les echantillons' });
  }
  if(echantillons.length === 1){
    return res.status(400).json({msg : 'Vous devez fournir au moins deux echantillons'})
  }
  console.log('echantillons', echantillons);
  fs.writeFile('shared/tmp.json', JSON.stringify({echantillons , seuil}), err => {
    if (err) throw err;
    console.log('les donnees entrentes ont bien ete ecrites');
    const python = spawn('python3', ['python/main.py']);

    python.on('close', code => {
      console.log(`child process close all stdio with code ${code}`);
      fs.readFile('shared/result.json', (err, data) => {
        const Data = JSON.parse(data)
        console.log('result from python', Data);

        res.json({ msg: 'success' , data : Data});
      });
    });
  });
});

app.listen(port, () => {
  console.log(`notre serveur http tourne sur le port ${port}`);
});
