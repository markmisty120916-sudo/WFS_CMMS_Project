import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

export type DiscoveredBackendModule = {
  readonly name: string;
  readonly expressFiles: readonly string[];
  readonly routeFiles: readonly string[];
};

function isExpressFile(fileName: string): boolean {
  if (fileName === "express.ts") {
    return true;
  }
  if (fileName.length > 11 && fileName.slice(fileName.length - 11) === ".express.ts") {
    return true;
  }
  return false;
}

function isRouteFile(fileName: string): boolean {
  if (fileName === "routes.ts") {
    return true;
  }
  if (fileName.length > 10 && fileName.slice(fileName.length - 10) === ".routes.ts") {
    return true;
  }
  return false;
}

export function discoverBackendModules(modulesRoot: string): readonly DiscoveredBackendModule[] {
  if (existsSync(modulesRoot) === false) {
    return Object.freeze([]);
  }
  const entries = readdirSync(modulesRoot);
  const discovered: DiscoveredBackendModule[] = [];
  let index = 0;
  while (index < entries.length) {
    const name = entries[index];
    const folder = join(modulesRoot, name);
    if (statSync(folder).isDirectory() === true) {
      const files = readdirSync(folder);
      const expressFiles: string[] = [];
      const routeFiles: string[] = [];
      let fileIndex = 0;
      while (fileIndex < files.length) {
        const fileName = files[fileIndex];
        if (isExpressFile(fileName) === true) {
          expressFiles.push(fileName);
        }
        if (isRouteFile(fileName) === true) {
          routeFiles.push(fileName);
        }
        fileIndex = fileIndex + 1;
      }
      discovered.push(
        Object.freeze({
          name,
          expressFiles: Object.freeze(expressFiles),
          routeFiles: Object.freeze(routeFiles),
        }),
      );
    }
    index = index + 1;
  }
  return Object.freeze(discovered);
}
