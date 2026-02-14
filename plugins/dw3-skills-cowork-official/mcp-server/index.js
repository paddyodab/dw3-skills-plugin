#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { spawn } from "child_process";

const server = new Server(
  {
    name: "spice-sql-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "spice_sql",
        description:
          "Execute a Spice SQL query against SpiceAI datasets. Use hybrid RRF (Reciprocal Rank Fusion) search combining vector_search() and text_search() for semantic + keyword matching. Available datasets: cloud_spec, security_spec, quality_spec, ux_design_spec.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                "The SQL query to execute. Use RRF pattern: SELECT path, content, fused_score FROM rrf(vector_search(dataset, 'semantic query'), text_search(dataset, 'keywords', content), join_key => 'path') ORDER BY fused_score DESC LIMIT 10;",
            },
          },
          required: ["query"],
        },
      },
    ],
  };
});

// Register tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "spice_sql") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const query = request.params.arguments?.query;
  if (!query || typeof query !== "string") {
    throw new Error("query parameter is required and must be a string");
  }

  // Build spice command
  const args = ["sql"];
  const apiKey = process.env.SPICE_CLOUD_API_KEY;
  if (apiKey) {
    args.push("--cloud", "--api-key", apiKey);
  }

  return new Promise((resolve, reject) => {
    const proc = spawn("spice", args, {
      env: { ...process.env },
    });

    let stdout = "";
    let stderr = "";

    // Send query to stdin
    proc.stdin.write(query);
    proc.stdin.end();

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        resolve({
          content: [
            {
              type: "text",
              text: `Spice SQL Error (exit code ${code}):\n${
                stderr || stdout
              }`,
            },
          ],
          isError: true,
        });
      } else {
        resolve({
          content: [
            {
              type: "text",
              text: stdout || "(no output)",
            },
          ],
        });
      }
    });

    proc.on("error", (err) => {
      resolve({
        content: [
          {
            type: "text",
            text: `Failed to execute spice command: ${err.message}`,
          },
        ],
        isError: true,
      });
    });
  });
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Spice SQL MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
