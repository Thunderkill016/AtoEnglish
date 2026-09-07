import { execFileSync } from "node:child_process";
execFileSync("npm", ["uninstall", "resend", "--ignore-scripts"], { stdio: "inherit" });
