# ClassAI — by Abhishek Toge

This is a minimal **Next.js** starter app for *ClassAI* (branded "ClassAI — by Abhishek Toge").
It provides a simple chat UI and a server-side API route that calls a Hugging Face text generation model.

## What this includes
- `pages/index.js` — frontend chat UI (replace the title/logo text as you like)
- `pages/api/chat.js` — server-side API route that forwards prompts to Hugging Face Inference API
- `.env.local` — you must create this file locally before running (example below)

## Setup (local)
1. Install Node.js (v18+) and npm/yarn.
2. Extract this ZIP and open the folder in terminal.
3. Create a file named `.env.local` with this content:
```
HUGGINGFACE_API_KEY=hf_your_api_key_here
```
Replace `hf_your_api_key_here` with your Hugging Face API token from https://huggingface.co/settings/tokens

4. Install dependencies:
```bash
npm install
# or
# yarn
```

5. Run the dev server:
```bash
npm run dev
```
Open http://localhost:3000

## Deploy (Vercel)
1. Push this repo to GitHub.
2. Sign in to https://vercel.com and import the repository.
3. In Vercel project settings, add Environment Variable:
   - `HUGGINGFACE_API_KEY` = your token
4. Deploy.

## Notes & Security
- **Do not** expose your Hugging Face API key in client-side code. This project uses a server-side API route to keep the key secret.
- You can swap the model in `pages/api/chat.js` to another Hugging Face model or call OpenAI / Gemini APIs by editing that file.

If you'd like, I can:
- Change the UI copy or colors to match a specific style.
- Add Supabase authentication and storage (free tier).
- Add multiple models (Gemini / OpenAI) support (you will need keys).