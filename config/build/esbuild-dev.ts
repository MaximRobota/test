import config from './esbuild-config';
import ESBuild from 'esbuild';
import express from 'express';
import path from 'path';
import { EventEmitter } from 'events';

const app = express();
const emitter = new EventEmitter();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.static(path.resolve(__dirname, '..', '..', 'build')))

app.get('/subscribe', (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    res.write('');

    emitter.on('refresh', () => res.write('data: message \n\n'));
})

const sendMessage = () => emitter.emit('refresh', 'test');

app.listen(PORT);

ESBuild.build({
    ...config,
    watch: {
        onRebuild(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('build is done')
                sendMessage()
            }
        }
    }
})
    .then(() => console.log('Server started on http://localhost:' + PORT))
    .catch(err => console.log(err));
