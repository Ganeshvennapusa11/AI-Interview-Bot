import groq from "./groqService.js";

export const generateAIQuestions = async (role, round) => {
    const prompt = `Generate 5 ${round} interview questions for ${role}`;

    const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }]
    });

    const text = completion.choices[0].message.content;

    return text.split("\n").filter(q => q.trim());
};

export const evaluateAIAnswer = async (question, answer) => {
    const prompt = `
Question: ${question}
Answer: ${answer}

Give short constructive feedback and improvement tips.
`;

    const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }]
    });

    return completion.choices[0].message.content;
};

export const extractResumeInsights = async (resumeText) => {
    const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            { role: "system", content: "You are an expert resume evaluator." },
            { role: "user", content: `Analyze this resume and give a short summary:\n${resumeText}` }
        ]
    });

    return completion.choices[0].message.content;
};
