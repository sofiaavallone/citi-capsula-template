import type { User } from "@repo/types";

const now = new Date().toISOString();

// Exemplo de service: só esta camada fala com o banco.
// Para usar o banco de verdade: import { prisma } from "../lib/prisma"; return prisma.user.findMany();
const mockUsers: User[] = [
  {
    id: "1",
    email: "maria@example.com",
    name: "Maria Silva",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "2",
    email: "ana@example.com",
    name: "Ana Souza",
    createdAt: now,
    updatedAt: now,
  },
];

export async function listUsers(): Promise<User[]> {
  return mockUsers;
}
