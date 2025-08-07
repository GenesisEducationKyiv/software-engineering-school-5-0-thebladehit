# HTTP vs gRPC

## Prerequisites
This benchmark only involves testing transport, a function was chosen for testing that validates input parameters and returns a randomly generated number.

HTTP endpoint
```ts
@Get()
@UsePipes(new ValidationPipe({ transform: true }))
getWeather(@Query() query: CityQueryDto): number {
  return Math.random();
}
```

benchmark
```js
async function benchmark(name, fn) {
  console.time(name);
  for (let i = 0; i < iterations; i++) {
    await fn();
  }
  console.timeEnd(name);
}

async function main() {
  await benchmark('HTTP', async () => {
    await axios.get('http://localhost:3001/api/weather?city=33333');
  });
}

main();
```

gRPC endpoint
```ts
async getWeather(query: CityRequest): Promise<WeatherResponse> {
  try {
    const dto = await validateAndGetDto(CityQueryDto, query);
    const rand = Math.random();
    return {} as WeatherResponse;
  } catch (err) {
    mapGrpcError(err);
  }
}
```

benchmark
```js
async function benchmark(name, fn) {
  console.time(name);
  for (let i = 0; i < iterations; i++) {
    await fn();
  }
  console.timeEnd(name);
}

async function main() {
  await benchmark('gRPC', async () => {
    await new Promise((resolve, reject) => {
      grpcClient.getWeather({ city: '33333' }, (err, res) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}
```


## HTTP results
1000 synchronous requests - **1.791s**

10000 synchronous requests - **14.686s**

100000 synchronous requests - **122.142s**

## gRPC results
1000 synchronous requests - **1.833s**

10000 synchronous requests - **13.960s**

100000 synchronous requests - **120.159**

## Result
HTTP and gRPC communications almost the same in speed.