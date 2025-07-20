import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

const server =new McpServer({
    name:"github-mcp",
    version:"1.0.0",
    capabilities:{
        resources:{},
        tools:{},
        prompts:{},
    }
})

server.tool("createRepo","creates a repo in the github",{
  
})

async function main(){
  const transport =new StdioServerTransport()
  await server.connect(transport);
}


main()