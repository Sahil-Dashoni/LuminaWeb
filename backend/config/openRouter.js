const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions"

const model = "deepseek/deepseek-chat"

export const generateResponse = async (prompt) => {
    const response = await fetch(openRouterUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: "You must return ONLY valid raw JSON. " },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.2,
        }),
    });
    if(!response.ok){
        throw new Error(`OpenRouter API error: ${await response.text()}`);
    }
    const data = await response.json();
    const content = data.choices[0].message.content;

    return content;
}

