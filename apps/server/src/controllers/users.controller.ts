import type { Request, Response } from "express";
import type { ApiResponse, User } from "@repo/types";
import { listUsers } from "../services/users.service";

export async function getUsers(
  _req: Request,
  res: Response<ApiResponse<User[]>>,
) {
  const users = await listUsers();
  res.json({ data: users });
}
