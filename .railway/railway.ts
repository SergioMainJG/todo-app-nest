import { defineRailway, github, postgres, preserve, project, service } from "railway/iac";

export default defineRailway(() => {
  const db = postgres('todo-app-postgres');

  const api = service("todo-app-nest", {
    build:{
      builder: "DOCKERFILE",
      dockerfilePath: "/deploy/Containerfile",
    },
    preDeploy: "bunx prisma migrate deploy",
    env: {
      NODE_ENV: db.env.DATABASE_URL,
      POSTGRES_PASSWORD: 'PROD',
      JWT_EXPIRES_IN: '900000',
      HASH_MEMORY_COST: '19456',
      HASH_TIME_COST: '2',
      JWT_SECRET: preserve(),
      DOMAIN_ORIGIN: preserve(),
      PORT: preserve(),
    },
    source: github('SergioMainJG/todo-app-nest', {branch: 'main'}),
  });

  return project("todo-app", {
    resources: [db, api],
  });
});
