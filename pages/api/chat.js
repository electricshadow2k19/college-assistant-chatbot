export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const busboy = require("busboy");
  const bb = busboy({ headers: req.headers });

  let message = "";
  bb.on("field", (fieldname, val) => {
    if (fieldname === "message") {
      message = val;
    }
  });

  bb.on("finish", async () => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-ai/deepseek-coder:free",
          messages: [
            { role: "system", content: "You are a helpful assistant for college students." },
            { role: "user", content: message },
          ],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        res.status(200).json({ result: data.choices[0].message.content });
      } else {
        res.status(500).json({ error: data.error.message || "API error" });
      }
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  req.pipe(bb);
}
