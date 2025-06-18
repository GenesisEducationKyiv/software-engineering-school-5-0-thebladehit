import { execSync } from 'child_process';

import { GenericContainer, StartedTestContainer } from 'testcontainers';

let container: StartedTestContainer;

export const setupDbContainer = async (): Promise<void> => {
  container = await new GenericContainer('postgres')
    .withEnvironment({
      POSTGRES_USER: 'test',
      POSTGRES_PASSWORD: 'test',
      POSTGRES_DB: 'test',
    })
    .withExposedPorts(5432)
    .start();

  process.env.DATABASE_URL = `postgresql://test:test@${container.getHost()}:${container.getMappedPort(5432)}/test`;

  execSync('npm run prisma:migrate:deploy', {
    env: process.env,
  });
};

export const stopDbContainer = async (): Promise<void> => {
  await container.stop();
};
