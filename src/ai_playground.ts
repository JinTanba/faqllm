import { ChatAnthropic } from "@langchain/anthropic";
import { z } from "zod";
import { FaqItem,FaqSection,FaqSource } from "./generated/prisma";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { BaseMessage } from "@langchain/core/messages";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();


const claude = new ChatAnthropic({
  model: "claude-opus-4-20250514",
  temperature: 0
});


const systemPrompt = `
You will be responsible for creating FAQs from the provided data. You will need to thoroughly understand the data and create FAQs based on that understanding.
`

// Schema
// step1 get data description and sections
const dataAbstractionSchema = z.object({
    name: z.string().describe("Name of the data"),
    description: z.string().describe("Detailed explanation of the data provided."),
    strategy: z.string().describe("Plan for what kind of FAQ to create based on the data provided"),
    fileType: z.string().describe("File type of the data like csv, json, text, etc."),
});

const sectionSchema = z.object({sections: z.array(
    z.object({
    name: z.string().describe("Name of the section"),
    description: z.string().describe("Description of the section"),
})).describe("Section for categorizing FAQs")});

// step2 get all faq items
const faqItemsSchema = z.array(z.object({
    sectionName: z.string().describe("Name of the section that the FAQ belongs to"),
    question: z.string().describe("Question of the FAQ"),
    answers: z.array(z.string()).describe("Answers of the FAQ"),
})).describe("List of FAQ items");

// Tools
const upsertDataAbstraction = tool(
    async({name, description, strategy, fileType}) => {
        console.log("upsertDataAbstraction", name, description, strategy, fileType)
    },
    {
        name: "upsertDataAbstraction",
        description: "Upsert data abstraction",
        schema: dataAbstractionSchema,
    }
)

const upsertSection = tool(
    async({sections}) => {
        console.log("upsertSection", JSON.stringify(sections, null, 2))
    },
    {
        name: "upsertSection",
        description: "Upsert section",
        schema: sectionSchema,
    }
)

const upsertFaqItems = tool(
    async({faqItems}) => {
        console.log("upsertFaqItems", JSON.stringify(faqItems, null, 2))
    },
    {
        name: "upsertFaqItems",
        description: "Upsert FAQ items",
        schema: z.object({faqItems: faqItemsSchema}),
    }
)

const tools = [upsertDataAbstraction, upsertSection, upsertFaqItems]

// Agent
const agent = createReactAgent({
    llm: claude,
    tools
})

async function exec(messages:any[]) {
    if (messages.length > 0 && messages[0].role !== "system"){
        messages.unshift({
            role: "system",
            content: systemPrompt
        })
    }
    const stream = await agent.stream({
        messages: messages
    })
    let result = ""
    for await (const chunk of stream) {
        console.log(chunk.content)
        result += chunk.content
    }
    return result
}

async function main() {
    console.log("start")
    const dataCsv = fs.readFileSync("./data/data.csv", "utf-8");
    console.log(dataCsv.slice(0, 1000))

    const messages = [
        {
            role: "user",
            content: `Please create a FAQ for the data provided.\n<data>\n${dataCsv}\n</data>`
        }
    ]

    console.log("chat messages", messages)

    const result = await exec(messages)
    console.log(result)
}

console.log("start")
main()









