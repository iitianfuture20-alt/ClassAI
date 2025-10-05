// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  try {
    const { message, model } = req.body || {};
    if (!message) return res.status(400).json({ error: "No message provided" });

    console.log("Request received:", { model });

    // Hugging Face route
    if (model === "huggingface") {
      if (!process.env.HUGGINGFACE_API_KEY) {
        return res.status(500).json({ error: "HUGGINGFACE_API_KEY not set in environment" });
      }

      const hfModel = "facebook/blenderbot-400M-distill";
      const hfRes = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      });

      const hfData = await hfRes.json();
      if (!hfRes.ok) {
        return res.status(500).json({ error: JSON.stringify(hfData) });
      }

      const hfReply =
        hfData?.generated_text ||
        hfData?.[0]?.generated_text ||
        JSON.stringify(hfData);

      return res.status(200).json({ reply: hfReply });
    }

    // OpenAI route
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY not set in environment" });
    }

    const modelName = model === "gpt4" ? "gpt-4" : "gpt-3.5-turbo";
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: "You are ClassAI built by Abhishek Toge." },
          { role: "user", content: message },
        ],
        max_tokens: 600,
      }),
    });

    const openaiData = await openaiRes.json();
    if (!openaiRes.ok) {
      return res.status(500).json({ error: openaiData?.error?.message || JSON.stringify(openaiData) });
    }

    const openaiReply = openaiData?.choices?.[0]?.message?.content;
    return res.status(200).json({ reply: openaiReply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
