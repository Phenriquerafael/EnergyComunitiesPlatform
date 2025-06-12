import 'reflect-metadata'; 

import config from '../config';

import express from 'express';

import chalk from 'chalk';

async function startServer() {
  const app = express();

  const cors = require('cors');

  const corsOptions = {
    origin: ['http://localhost:5173','http://localhost:8000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
  };

  app.use(cors(corsOptions)); 

  // Body parser
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));


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
