// import * as ora from 'ora'
import chalk from 'chalk'
import loading from 'loading-cli';
import Loading from 'loading-cli';

/* eslint-disable */
export const spinner = {
  start(text?: string) {
    loading(text).start();
  },
  stopAndPersist(a?: any) { },
  fail(text?: string){
    loading().fail(text);
  },
  succeed(text?: string) {
    loading().succeed(text);
  },
}

export const startSpinner = (text?: string) => {
  const msg = `${text}...\n`
  spinner.start(msg)
  spinner.stopAndPersist({
    symbol: '✨',
    text: msg,
  })
}

export const succeedSpiner = (text?: string) => {
  spinner.stopAndPersist({
    symbol: '🎉',
    text: `${text}\n`
  })
}

export const failSpinner = (text?: string) => {
  spinner.fail(chalk.red(text))
}
