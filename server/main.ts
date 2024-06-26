import http from 'http';
import { cpus } from 'os';
import cluster from 'cluster';
import { EConsoleLog } from './console-log.enum';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

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

      if (req.url === '/') {
        fs.readFile(path.join(__dirname, '../public/index.html'), (error, content) => {
          if (error) {
            res.writeHead(500);
            res.end();
          } else {
            res.writeHead(200, { 'content-type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else if (req.url?.match(/.css$/)) {
        fs.readFile(path.join(__dirname, '../public/', req.url), (error, content) => {
          if (error) {
            res.writeHead(500);
            res.end();
          } else {
            res.writeHead(200, { 'content-type': 'text/css' });
            res.end(content, 'utf-8');
          }
        });
      } else if (req.url?.match(/.js$/)) {
        console.log(req.url);
        fs.readFile(path.join(__dirname, '../public', req.url), (error, content) => {
          if (error) {
            res.writeHead(500);
            res.end();
          } else {
            res.writeHead(200, { 'content-type': 'text/javascript' });
            res.end(content, 'utf-8');
          }
        });
      } else if (req.url?.match(/.png$/)) {
        console.log(req.url);
        fs.readFile(path.join(__dirname, '../public', req.url), (error, content) => {
          if (error) {
            res.writeHead(500);
            res.end();
          } else {
            res.writeHead(200, { 'content-type': 'image/png' });
            res.end(content, 'utf-8');
          }
        });
      }

      if (req.url?.match(/products/)) {
        const urlstring = new URL(`http://${req.headers.host}${req.url}`);
        console.log(urlstring.searchParams);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<p style="color:red;background-color:black;">Página products</p>');
      }
    })
    .listen(3000)
    .on('listening', () => {
      console.log(`${EConsoleLog.fgGreen}Worker process start with ${EConsoleLog.fgCyan}${process.pid}${EConsoleLog.reset}`);
    });
}
