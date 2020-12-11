const { startDevServer, createConfiguration } = require('snowpack');
const express = require('express');
const expressServer = express();
const puppeteer = require('puppeteer');
const { ConsoleWriter } = require('istanbul-lib-report');


const userConfig = {
    mount: {
      public: "/",
      src: "/_dist_",
    },
    plugins: [
      "@snowpack/plugin-babel",
      "@snowpack/plugin-react-refresh",
      "@snowpack/plugin-dotenv",
      "@snowpack/plugin-typescript",
      "snowpack-plugin-mdx",
    ],
    install: ["react/jsx-runtime"]
  };

  async function init() {
    const browser = await puppeteer.launch();
    
    const devserver = await startDevServer({
      cwd: process.cwd(),
      config: createConfiguration(userConfig)[1],
      lockfile: null,
      pkgManifest: null
    });

    expressServer.get('*', async (req, res) => {
      try {
        const page = await browser.newPage();
        const buildResult = await devserver.loadUrl(req.url);
        await page.exposeFunction('superLink', link => {
          console.log('server has link: ', link);
        });
        console.log('original: ', req.originalUrl)
        await page.goto(`http://localhost:8080${req.originalUrl}`);
        const html = await page.content(); // serialized HTML of page DOM.
        await browser.close();
        console.log('closed')
        res.set('Content-Type', 'text/html');
        res.send(Buffer.from(html));
        console.log('result send')
      } catch (err) {
        console.error(err);
      }
    });

    expressServer.listen('8090', () => {
      console.log(`Example app listening at http://localhost:8090`)
    })
  }

  init();

 
  


