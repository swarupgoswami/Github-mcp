import {Octokit} from "@octokit/rest";


const octokit= new Octokit({
    auth:process.env.GITHUB_TOKEN,
})


export async function listRepos(input:{username:string}){
    console.log("Tool invoked with username:", input.username);

    // return {
    //   debug: `🔥 Tool triggered with username: ${input.username}`,
    // };
    try {
        const response=await octokit.repos.listForUser({
            username:input.username,
            per_page:100, //max items per page
        });

        const repos=response.data.map((repo)=>({
            name:repo.name,
            url:repo.html_url,
        }));

        return repos;

    } catch (error) {

        console.log("error fetching repositories:",error);
        return [];
        
    }
}