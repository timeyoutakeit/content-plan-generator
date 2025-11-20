import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    const prompt = `
    You are a technical writer who writes documentation for developer tools. Before writing, you analyze
    all the internal information about the topic in order to generate the best developer-focused documentation. Very important: the
    goal of the documentation should always demonstrate how it helps the user and fits into their workflow, rather than simply
    describing the features. Always focus on user needs and how the product helps them.
    
    Based on the folowing content:
    
    ${content}
   
   Generate a content plan for the documentation:

    1. A Description of the changes/ideas. This should be a really short (less than 50 words) and concise description and written in a conversational
    tone that is easy to understand. You don't need to use any uncessary adjectives or adverbs.
    2. Goals of documentation. This should be a short list, that summarizes the high level goals of the documentation.
    3. Intended audience(s). Focus which parts of the documentation should be written for which audience.
    4. Proposed content of all the topics and parts of the documentation that need to be created. Unless it is absolutely
    necessary, do not create an FAQ, instead these should be written as regular content. For our documentation, we have four different content types:
    Conceptual Content, Tutorial, How-To, and Reference:
    - The goal of conceptual and tutorial content is to help users learn and understand the product and even higher level topics surrounding it. 
    Conceptual content is usually just regular prose and headings. Tutorials are usually a series of steps that help users learn how to use the product.
    - The goal of how-to content is for users to achieve a specific task, they do not need to learn about the product itself. How-to content is usually a series of steps that help users learn how to use the product for a specific task.
    - The goal of reference content is to help users look up information about the product. Reference content is usually a list of features and their descriptions, often written API reference style.
    The content plan does not need to include all the content types, but it should be a good mix of them as necessary. They should be detailed enough that any other technical writer can write the content, but not too detailed that they are overwhelming.
    
    Add a relevant emoji to each major heading to make it more engaging. If there are areas that could pose ambiguity for users, create a list of questions to ask of the team.`;

    const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          thinkingConfig: {
            includeThoughts: true,
          },
          tools: [{urlContext: {}}],
        },
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        let hasStartedThinking = false;
        let hasFinishedThinking = false;

        for await (const chunk of response) {
          // Check if chunk has parts
          const parts = chunk.candidates?.[0]?.content?.parts || [];
          
          for (const part of parts) {
            if (part.thought) {
              if (!hasStartedThinking) {
                controller.enqueue(encoder.encode("<thinking>"));
                hasStartedThinking = true;
              }
              controller.enqueue(encoder.encode(part.text));
            } else {
              if (hasStartedThinking && !hasFinishedThinking) {
                controller.enqueue(encoder.encode("</thinking>"));
                hasFinishedThinking = true;
              }
              // If the part is just text, send it through.
              // If it's something else (like tool output), we might want to handle or ignore.
              // For now, assuming text content is what we want.
              if (part.text) {
                controller.enqueue(encoder.encode(part.text));
              }
            }
          }
        }

        // If we ended with thoughts but no content followed (unlikely but possible)
        if (hasStartedThinking && !hasFinishedThinking) {
            controller.enqueue(encoder.encode("</thinking>"));
        }

        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
