import {Octokit} from '@octokit/rest';

const octokit=new Octokit({
    auth:process.env.GITHUB_TOKEN,
})



// EXPORTING THE GETIISues function from here to server.ts


export async function getIssues(input:{owner:string,repo:string}){
    console.log("GitHub username:", input.owner);
    console.log("Repo being accessed:", input.repo);
    try {
        const response=await octokit.rest.issues.listForRepo({
            owner : input.owner,
            repo  : input.repo,
            state : 'open',
        });

        return response.data.map((issue: typeof response.data[number]) => ({
            number: issue.number,
            title: issue.title,
            url: issue.html_url,
        }));
    } catch (error:any) {
        console.error("Full error object:", error); // add this
        console.error("error fetcing",error.message || error);
        throw new Error('failed to fetch issue')
        
    }
}