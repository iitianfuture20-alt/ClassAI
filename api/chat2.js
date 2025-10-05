export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Only POST allowed" });
  }

  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "No message provided" });

  try {
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: message })
      }
    );

    const data = await hfResponse.json();

    const reply =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      (typeof data === "string" ? data : null) ||
      "Sorry, I couldn’t reply.";

    if (data?.error) {
      console.error("HF error:", data.error);
      return res.status(500).json({ reply: "Model error: " + data.error });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error connecting to Hugging Face:", err);
    return res.status(500).json({ reply: "Server error connecting to AI." });
  }
}
