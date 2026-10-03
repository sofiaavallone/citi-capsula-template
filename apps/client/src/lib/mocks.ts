import type { User } from "@repo/types";

const now = new Date().toISOString();

export const mockUsers: User[] = [
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
