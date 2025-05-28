import 'reflect-metadata'; // We need this in order to use @Decorators

import config from '../config';

import express from 'express';

import Logger from './loaders/logger';

import chalk from 'chalk';

async function startServer() {
  const app = express();

  const cors = require('cors');

  const corsOptions = {
    origin: ['http://localhost:5173','http://localhost:8000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permite o envio de cookies e cabeçalhos de autenticação
  };

  app.use(cors(corsOptions)); // ✅ CORS DEVE VIR ANTES

  // Body parser
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // ✅ SÓ DEPOIS carregas os loaders que registam rotas
  await require('./loaders').default({ expressApp: app });

  app.listen(config.port, () => {
    const isepColor = chalk.hex('#a02c0c').bold;

  console.log(`
${isepColor(`🛡️  Server listening on port: ${config.port} 🛡️`)}

${isepColor('██╗')}${'  '} ${isepColor('███████╗')}   ${isepColor('███████╗')}   ${isepColor('██████╗')}
${isepColor('██║')}${'  '} ${isepColor('██╔════╝')}   ${isepColor('██╔════╝')}   ${isepColor('██╔══██╗')}
${isepColor('██║')}${'  '} ${isepColor('███████╗')}   ${isepColor('█████╗')}     ${isepColor('██████╔╝')}
${isepColor('██║')}${'  '} ${isepColor('╚════██║')}   ${isepColor('██╔══╝')}     ${isepColor('██╔═══╝')}
${isepColor('██║')}   ${isepColor('███████║')}   ${isepColor('███████╗')}   ${isepColor('██║')}
${isepColor('╚═╝')}   ${isepColor('╚══════╝')}   ${isepColor('╚══════╝')}   ${isepColor('╚═╝')}

${isepColor('Instituto Superior de Engenharia do Porto')}
`);
});
}

startServer();
