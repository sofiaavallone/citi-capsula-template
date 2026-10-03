export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const isProd = process.env.NODE_ENV === "production";

export function noop(): void {}
