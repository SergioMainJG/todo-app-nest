export default [{
        name: 'short-1s',
        ttl: 1000,
        limit: 3,
        blockDuration: 5000,
      },
      {
        name: 'medium-10s',
        ttl: 10000,
        limit: 20,
        blockDuration: 50_000,
      },
      {
        name: 'long-1m',
        ttl: 60000,
        limit: 100,
        blockDuration: 60_0000,
      },
];