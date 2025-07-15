export default async function handler(req, res) {
  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "cognitivecomputations/venice:free",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for college students. You help with assignments, quizzes, discussions, and APA formatting.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ result: data.choices[0].message.content });
    } else {
      console.error("OpenRouter API error:", data);
      res.status(500).json({ error: data.error.message || "API error" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
}