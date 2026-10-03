import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ApiResponse } from "@repo/types";

// Express 4 não captura erros de handlers async; este wrapper os repassa ao errorHandler.
export function asyncHandler<P>(
  handler: (req: Request<P>, res: Response) => Promise<unknown>,
): RequestHandler<P> {
  return (req, res, next) => {
    handler(req, res).catch(next);
  };
}

// Erros do body-parser (corpo grande demais, charset inválido...) trazem o status HTTP certo.
function clientErrorStatus(error: unknown): number | null {
  if (typeof error !== "object" || error === null || !("status" in error))
    return null;
  const { status } = error;
  return typeof status === "number" && status >= 400 && status < 500
    ? status
    : null;
}

export function notFoundHandler(
  req: Request,
  res: Response<ApiResponse<null>>,
) {
  res.status(404).json({
    data: null,
    error: `Rota não encontrada: ${req.method} ${req.path}`,
  });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response<ApiResponse<null>>,
  _next: NextFunction,
) {
  if (error instanceof SyntaxError) {
    return res
      .status(400)
      .json({ data: null, error: "JSON inválido no corpo da requisição" });
  }
  const status = clientErrorStatus(error);
  if (status === 413) {
    return res
      .status(413)
      .json({ data: null, error: "Corpo da requisição grande demais" });
  }
  if (status) {
    return res
      .status(status)
      .json({ data: null, error: "Requisição inválida" });
  }
  console.error(error);
  res.status(500).json({ data: null, error: "Erro interno do servidor" });
}
