import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { FaqItem,FaqSection,FaqSource } from "./generated/prisma";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { BaseMessage } from "@langchain/core/messages";
import fs from "fs";
import dotenv from "dotenv";
import type { ToolInterface } from "@langchain/core/tools";

dotenv.config();


const gpt = new ChatOpenAI({
    model: "gpt-5-nano-2025-08-07"
})

const systemPrompt = `
You will be responsible for creating FAQs from the provided data. You will need to thoroughly understand the data and create FAQs based on that understanding.
If it is already structured to a certain extent, try to understand the author's intent and reflect it in the FAQ's Q&A and section divisions.

YOU MUST ALWAYS USE THE TOOLS PROVIDED TO YOU.
** upsertSection **: Upsert section and qa list
** getQABySection **: Get qa list by section name
** getSectionNameList **: Get section name list
`

const sectionSchema = z.object({
    name: z.string().describe("Name of the section"),
    qaList: z.array(z.object({
        question: z.string().describe("Question of the FAQ"),
        answers: z.array(z.string()).describe("Answers of the FAQ"),
    })).describe("Q&A list of the section"),
}).describe("Section-based QA.");

//local db
const qas = new Map<string, {question: string, answers: string[]}>()

// Tools
const upsertSection = tool(
    async({name, qaList}) => {
        console.log("⚙️upsertSection", name, qaList)
        qas.set(name, qaList)
    },
    {
        name: "upsertSection",
        description: "Upsert section",
        schema: sectionSchema as z.ZodTypeAny,
    }
)

const getQABySection = tool(
    async({sectionName}:{sectionName: string}) => {
        console.log("⚙️getQABySection", sectionName)
        return qas.get(sectionName)
    },
    {
        name: "getQABySection",
        description: "Get QA by section name",
    }
)

const getSectionNameList = tool(
    async() => {
        console.log("⚙️getSectionList")
        return Array.from(qas.keys())
    },
    {
        name: "getSectionList",
        description: "Get section list",
    }
)
// fuck you zod
const tools: ToolInterface[] = [upsertSection, getQABySection, getSectionNameList]

// Agent
const agent = createReactAgent({
    llm: gpt,
    tools
})

async function exec(messages:any[]) {
    console.log("[exec] --start--")
    if (messages.length > 0 && messages[0].role !== "system"){
        messages.unshift({
            role: "system",
            content: systemPrompt
        })
    }
    const res = await agent.stream({
        messages: messages
    },{
        streamMode: "messages"
    })
    let result = ""
    for await (const chunk of res){
        console.log(chunk[0].content)
        result += chunk[0].content
    }
    console.log(result);
    return [result]
}

async function main() {
    console.log("start")
    const dataCsv = fs.readFileSync("./data/data.csv", "utf-8");

    let messages = [
        {
            role: "user",
            content: `Please create a FAQ for the data provided.\n<data>\n${dataCsv}\n</data>`
        }
    ]

    let result = await exec(messages)
    messages = [...messages,...result] as any[]
    while(true) {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        const cliPrompt = await new Promise<string>((resolve) => {
            rl.question('Enter your message: ', (answer: string) => {
                resolve(answer);
            });
        });
        
        const human = cliPrompt
        messages = [...messages, { role: "user", content: human }]
        result = await exec(messages)
        console.log(JSON.stringify(qas, null, 2))
        messages = [...messages,...result] as any[]
        
        rl.close();
    }
    

}

console.log("start")
main()









