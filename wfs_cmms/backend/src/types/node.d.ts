declare module "fs" {
  export function existsSync(path: string): boolean;
  export function readdirSync(path: string): string[];
  export function statSync(path: string): { isDirectory(): boolean };
}

declare module "path" {
  export function join(...parts: string[]): string;
}

declare module "http" {
  export class IncomingMessage {
    headers: Record<string, string | string[] | undefined>;
    url?: string;
    method?: string;
    on(event: "data", listener: (chunk: Buffer | string) => void): IncomingMessage;
    on(event: "end" | "error", listener: (err?: Error) => void): IncomingMessage;
    on(event: string, listener: (chunk?: Buffer | string) => void): IncomingMessage;
  }
  export class ServerResponse {
    statusCode: number;
    setHeader(name: string, value: string): ServerResponse;
    end(chunk?: string): ServerResponse;
  }
}

interface Buffer {
  toString(encoding?: string): string;
}

interface BufferConstructor {
  from(data: string | ArrayBuffer | Uint8Array, encoding?: string): Buffer;
  concat(list: readonly Buffer[]): Buffer;
}

declare const Buffer: BufferConstructor;

declare namespace NodeJS {
  type Signals = "SIGTERM" | "SIGINT" | string;
  type ProcessEnv = Record<string, string | undefined>;
  interface Process {
    env: ProcessEnv;
    on(event: string, listener: (...args: unknown[]) => void): Process;
  }
}

declare const process: NodeJS.Process;
declare const __dirname: string;
