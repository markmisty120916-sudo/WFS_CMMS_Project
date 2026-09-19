import { join } from "path";
import { discoverBackendModules } from "./module-loader";
import { wireLockedModuleRouters, type RuntimeExpressApp } from "./router-wiring";

const PORT = 3001;

function structuredRuntimeLog(event: string, detail: string): string {
  return (
    '{"level":"info","message":"wfs cmms backend runtime",' +
    '"event":"' +
    event +
    '","detail":"' +
    detail +
    '"}'
  );
}

const app: RuntimeExpressApp = {
  use(): unknown {
    return undefined;
  },
};

const modulesRoot = join(__dirname, "modules");
const discovered = discoverBackendModules(modulesRoot);
let index = 0;
while (index < discovered.length) {
  const item = discovered[index];
  console.info(
    structuredRuntimeLog(
      "module_discovered",
      item.name +
        " express=" +
        item.expressFiles.join(",") +
        " routes=" +
        item.routeFiles.join(",") +
        " mount=existing_express",
    ),
  );
  index = index + 1;
}

wireLockedModuleRouters(app);

console.info(structuredRuntimeLog("listen", String(PORT)));
