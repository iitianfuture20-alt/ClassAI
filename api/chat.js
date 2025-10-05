export default async function handler(req, res) {
  const { message } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: message }),
      }
    );

    const data = await response.json();

    const reply =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      "Sorry, I couldn’t reply.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error connecting to Hugging Face:", error);
    res.status(500).json({ reply: "Error connecting to AI." });
  }
}
