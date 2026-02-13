#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { spawn } from "child_process";

const server = new McpServer({
  name: "spice-sql",
  version: "1.0.0",
});

server.tool(
  "spice_sql",
  "Execute a Spice SQL query against SpiceAI datasets. Use for hybrid RRF searches across cloud_spec, security_spec, quality_spec, and ux_design_spec datasets.",
  {
    query: z.string().describe("The SQL query to execute via spice sql"),
  },
  async ({ query }) => {
    const args = ["sql"];
    const apiKey = process.env.SPICE_CLOUD_API_KEY;
    if (apiKey) {
      args.push("--cloud", "--api-key", apiKey);
    }

    return new Promise((resolve) => {
      const proc = spawn("spice", args, {
        env: { ...process.env },
      });

      let stdout = "";
      let stderr = "";

      proc.stdin.write(query);
      proc.stdin.end();

      proc.stdout.on("data", (data: Buffer) => {
        stdout += data.toString();
      });

      proc.stderr.on("data", (data: Buffer) => {
        stderr += data.toString();
      });

      proc.on("close", (code: number | null) => {
        if (code !== 0) {
          resolve({
            content: [
              {
                type: "text" as const,
                text: `Error (exit code ${code}):\n${stderr || stdout}`,
              },
            ],
            isError: true,
          });
        } else {
          resolve({
            content: [
              {
                type: "text" as const,
                text: stdout || "(no output)",
              },
            ],
          });
        }
      });

      proc.on("error", (err: Error) => {
        resolve({
          content: [
            {
              type: "text" as const,
              text: `Failed to spawn spice: ${err.message}`,
            },
          ],
          isError: true,
        });
      });
    });
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
