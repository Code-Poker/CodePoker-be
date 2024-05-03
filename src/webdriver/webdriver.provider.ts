import { remote } from 'webdriverio';

export const webdriverProvider = {
  provide: 'WEBDRIVER',
  useFactory: async () => {
    return remote({
      capabilities: {
        webSocketUrl: true,
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: [
            '--headless',
            '--single-process',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-javascript',
            'user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          ],
        },
      },
    });
  },
};
