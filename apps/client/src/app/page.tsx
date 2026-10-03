import type { User } from "@repo/types";
import { apiGet } from "@/lib/api";
import { mockUsers } from "@/lib/mocks";

// Página inicial provisória: só confirma que o front conversa com o server.
// Ela vai ser substituída pela página da Cápsula do tempo durante o curso.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: users, isMocked } = await apiGet<User[]>("/users", mockUsers);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold">Cápsula do tempo</h1>
      {isMocked ? (
        <div className="max-w-md rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-center text-sm text-yellow-900">
          <strong>Modo offline:</strong> sem comunicação com o servidor. Os
          dados abaixo são de exemplo.
        </div>
      ) : (
        <div className="max-w-md rounded-lg border border-green-300 bg-green-50 p-3 text-center text-sm text-green-900">
          Tudo certo: o front está conversando com o servidor.
        </div>
      )}
      <p className="max-w-md text-center text-sm text-gray-600">
        Usuários de exemplo vindos de{" "}
        <code className="rounded bg-gray-100 px-1">GET /users</code>.
      </p>
      <ul className="flex w-72 flex-col gap-2 rounded-lg border border-gray-200 p-4">
        {users.map((user) => (
          <li key={user.id} className="text-sm">
            <strong>{user.name ?? "(sem nome)"}</strong> ({user.email})
          </li>
        ))}
      </ul>
    </main>
  );
}
