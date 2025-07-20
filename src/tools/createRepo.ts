import { Octokit } from "@octokit/rest";
import dotenv from'dotenv';

dotenv.config();

console.log("token:",process.env.GITHUB_TOKEN);
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function createRepo(input: {name:string;
    description?:string;
    private?:boolean}){


        const {name, description =" ",private: isPrivate=true}= input;

        const res = await octokit.repos.createForAuthenticatedUser({
            name,
            description,
            private:isPrivate,
        });


        return {
            message: ` Repository '${res.data.full_name}' created succesfully`,
            url:res.data.html_url,
        }
    }


