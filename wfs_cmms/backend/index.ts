import cors from "cors";
import express from "express";
import { join } from "path";
import { discoverBackendModules } from "./module-loader";

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

const app = express();
app.use(cors());
app.use(express.json());

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
        " mount=none",
    ),
  );
  index = index + 1;
}

app.listen(PORT, () => {
  console.info(structuredRuntimeLog("listen", String(PORT)));
});
