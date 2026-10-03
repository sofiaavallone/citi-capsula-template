import "dotenv/config";
import cors from "cors";
import express from "express";
import { prisma } from "./lib/prisma";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { usersRouter } from "./routes/users.route";

const app = express();

app.use(cors({ origin: process.env.WEB_URL ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", usersRouter);

// Sempre por último: 404 em JSON e tratamento de erros.
app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT) || 3002;

async function start() {
  await prisma.$connect();
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
    console.log(`📦 Successfully connected with database`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
