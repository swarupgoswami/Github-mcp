import express from 'express'
import dotenv from 'dotenv'
import githubTool from '/tools/github.js'

dotenv/config();

const app=express();
app.use(express.json());

const PORT=process.env.PORT ||3000;
//  mcp endpoints

app.post('/v1/tools/github/invoke',async(req,res)=>{
    try {
        const {tool_action,parameters}=req.body;
        const result = await githubTool(tool_action, parameters);
    res.json({ result });
    } catch (error) {
        res.status(500).json({error: "internal server error"});
        
    }
});

app.listen(PORT,()=>{
    console.log('mcp server is running on local host 3000');
})