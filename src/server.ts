import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createRepo  } from "./tools/createRepo.js";
import {getIssues} from "./tools/getIssues.js"
import { listRepos } from "./tools/listRepos.js";
// very top of server.ts
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const server = new McpServer({
  name: "github-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

const inputSchema = z.object({
  owner: z.string(),
  repo: z.string(),
});

server.tool(
  "createRepo",
  "creates a new repository on GitHub",
  {
    name: z.string().describe("name of the repo"),
    description: z.string().optional(),
    private: z.boolean().optional().default(true),
  },
  {
    title: "Create Repository",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  async (
    input: { name: string; description?: string; private?: boolean },
    extra
  ) => {
    console.log("Input received for createRepo:", input);
    const result = await createRepo(input);
    console.log("createRepo called with:", input.name);

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

server.tool("getIssues","get the open issues from a github repository",
  {
    owner:z.string().describe("owner of the github repository"),
    repo:z.string().describe("name of the fithub repository"),
  },
  {
    title:"get repository issues",
    readOnlyHint:true,
    destructiveHint:false,
    idempotentHint:true,
    openWorldHint:true,
  },
  async(
    input:{owner:string;repo:string},extra)=>{

    console.log('input recived for getIssues',input);
    const issues=await getIssues(input);
    console.log("issues fetched",JSON.stringify(issues));

    if(issues.length === 0)
    {
      return{
        content:[
          {
            type:'text',
            text:`no open issues found in the given repo ${input.owner}/${input.repo} `
          }
        ]
      }
    }


    const issuesText= issues.map(
      (issue) => `#${issue.number} - ${issue.title}\n${issue.url}`
    ).join('\n\n');

    return{
      content:[
        {
          type:"text",
          text:`open issues in /${input.owner}/${input.repo}:\n\n${issuesText} `
        }
      ]
    }
  }
)




server.tool("listRepo",
  "list all the repo of a github user",
  {
    username:z.string().describe(" username to list github repositories ")
  },
  {
    title:"list repositories",
    readOnlyHint:true,
    destructiveHint:false,
    idempotentHint:false,
    openWorldHint:true,
  },
  async(
    input:{username:string},extra
  )=>{
    console.log("input revived",input);
    const repos=await listRepos(input);
    console.log("repositories fetched",JSON.stringify(repos));

    if(repos.length === 0){
      return{
        content:[{
          type:"text",
          text:"no repositories found for user "}
        ]
      }
    }

    const reposText=repos.map((repo)=>`$(repo.name) - ${repo.url}`).join('\n\n');
    return{
      content:[
        {
          type:"text",
          text:`repo for ${input.username}:\n\n${reposText}`,
        },
      ],
    };
  }

)

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
