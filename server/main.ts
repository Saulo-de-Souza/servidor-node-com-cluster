import http from 'http';
import { cpus } from 'os';
import cluster from 'cluster';
import { EConsoleLog } from './console-log.enum';

process.on('uncaughtException', (e: Error) => {
  console.log(`${EConsoleLog.bgBlack}${EConsoleLog.fgRed}Erro: ${EConsoleLog.fgYellow}${e}${EConsoleLog.reset}`);
});
process.on('unhandledRejection', () => {
  console.log(`${EConsoleLog.bgBlack}${EConsoleLog.fgRed}Erro${EConsoleLog.reset}`);
});

const cpusLenght = cpus().length;

if (cluster.isPrimary) {
  console.log(`${EConsoleLog.fgBlack}${EConsoleLog.bgWhite}Master process ${process.pid} is running${EConsoleLog.reset}`);

  for (let x = 0; x < cpusLenght * 2; x++) {
    cluster.fork();
  }

  cluster.on('exit', () => {
    console.log(`${EConsoleLog.fgBlue}Worker ${process.pid} died${EConsoleLog.reset}`);
    console.log(`${EConsoleLog.fgBlue}Starting a new cluster${EConsoleLog.reset}`);
    cluster.fork();
  });
} else {
  const server = http
    .createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      console.log(req.url);
      res.end(`Hello World from Worker ${process.pid}\n`);
    })
    .listen(3000)
    .on('listening', () => {
      console.log(`${EConsoleLog.fgGreen}Worker process start with ${EConsoleLog.fgCyan}${process.pid}${EConsoleLog.reset}`);
    });
}
