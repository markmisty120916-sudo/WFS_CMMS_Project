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
  }
  export class ServerResponse {}
}

declare const __dirname: string;

declare const Buffer: {
  from(data: string, encoding: string): { toString(enc: string): string };
};

declare const process: {
  env: Record<string, string | undefined>;
};
