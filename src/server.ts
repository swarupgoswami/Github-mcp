import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { createRepo } from "./tools/createRepo.js"
 // very top of server.ts
import {z } from 'zod';
import dotenv from 'dotenv';



dotenv.config(); // Load environment variables from .env file


const server =new McpServer({
    name:"github-mcp",
    version:"1.0.0",
    capabilities:{
        resources:{},
        tools:{},
        prompts:{},
    }
})

const inputSchema = z.object({
  owner: z.string(),
  repo: z.string(),
});

server.tool(
  "createRepo",
  {
    name: z.string().describe("name of the repo"),
    description: z.string().optional(),
    private: z.boolean().optional().default(true),
  },
  async (
    input: { name: string; description?: string; private?: boolean },
    extra
  ) => {
    const result = await createRepo(input);
    return {
      content: [
        {
          type: "text",
          text: `Repository created: ${result.message}\nURL: ${result.url}`,
        },
      ],
    };
  }
);

async function main(){
  const transport =new StdioServerTransport()
  await server.connect(transport);
}


main()