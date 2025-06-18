import { spawn } from 'child_process';

let nestProcess: ReturnType<typeof spawn>;

export const startServer = async (): Promise<void> => {
  nestProcess = spawn('node', ['dist/main.js'], {
    env: {
      ...process.env,
      NODE_ENV: 'test',
      PORT: '3000',
      BACK_BASE_URL: 'http://localhost:3000',
    },
  });
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await fetch('http://localhost:3000');
      if (res.ok) break;
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
};

export const stopServer = async (): Promise<void> => {
  nestProcess.kill();
};
