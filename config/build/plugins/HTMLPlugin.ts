import path from 'path';
import { Plugin } from 'esbuild';
import { rm, writeFile } from 'fs/promises';

interface HTMLPluginOptions {
    cssPath?: string[];
    jsPath?: string[];
    template?: string;
    title?: string;
}

const renderHtml = (options: HTMLPluginOptions): string => {
    return options.template || `
      <!doctype html>
      <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Test</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${options?.cssPath?.map(path => `<link href=${path} rel="stylesheet">`).join(" ")}
        </head>
        <body>
          <button id='undo'>Undo</button>
          <button id='redo'>Redo</button>
          <div id="content"></div>
          ${options?.jsPath?.map(path => `<script src=${path}></script>`).join(" ")}
          <script>
          if (window.location.port === '3000') {
            const evtSource = new EventSource('http://localhost:3000/subscribe')
            evtSource.onopen = function () { console.warn('Dev environment...') }
            evtSource.onerror = function () { console.warn('error') }
            evtSource.onmessage = function () { 
                window.location.reload();
            }
          }
          </script>
        </body>
      </html>`
}

const preparePaths = (outputs: string[]) => {
    return outputs.reduce<Array<string[]>>((acc, path) => {
        const [js, css] = acc;
        const splittedFileName = path.split('/').pop();

        if(splittedFileName?.endsWith('.js')) {
            js.push(splittedFileName)
        } else if(splittedFileName?.endsWith('.css')) {
            css.push(splittedFileName)
        }

        return acc;
    }, [[], []])
}

export const HTMLPlugin = (options: HTMLPluginOptions): Plugin => {
  return {
      name: 'HTMLPlugin',
      setup: function (build) {
          const outdir = build.initialOptions.outdir;

          build.onStart(async () => {
              try {
                  if (outdir) {
                      await rm(outdir, {recursive: true})
                  }
              } catch (e) {
                  console.log('Не удалось очистить папку')
              }
          })
          build.onEnd(async (result) => {
              const outputs = result.metafile?.outputs;
              const [jsPath, cssPath] = preparePaths(Object.keys(outputs || {}));

              if (outdir) {
                  await writeFile(
                      path.resolve(outdir, 'index.html'),
                      renderHtml({jsPath, cssPath, ...options})
                  )
              }
          })
      },
  }
}


