import net from 'net';

const PORT = 3000;

const server = net.createServer();
server.listen(PORT, () => {
    console.log(`Port ${PORT} is open and listening!`);
});
server.on('error', (err) => {
    console.error(`Error: ${err.code} - ${err.message}`);
});
