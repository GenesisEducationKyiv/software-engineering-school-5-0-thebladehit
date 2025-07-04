# How to run tests

## Prerequisites
1. You must have installed `Node JS` and `Docker`,

2. Install dependencies:
```bash
npm i
```
3. Generate Prisma Client:
```bash 
npm run prisma:generate
```

## Unit tests
```bash
npm run test
```

## Integration tests
```bash
npm run test:integration
```

## E2E tests
```bash
npm run test:e2e
```

## Architecture tests
```bash
npm run test:arch
```