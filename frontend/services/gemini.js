const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
console.log('gemini.js loaded');

export async function structureRecipe(transcript, metadata = {}) {
const prompt = `
  You are a professional recipe archivist helping preserve family recipes shared through voice recordings.
  The speaker is sharing a recipe that may vary in detail and description. The recipe could be culturally specific, use regional terms, be described in another language, or use informal and vague language. Treat every recording with equal respect regardless of background or style.

  Transcript: "${transcript}"
  Additional context: ${JSON.stringify(metadata)}

  Your job is to transform this voice recording into a standardized, detailed recipe card.

  Rules:
  - For ingredients, keep the original cultural term AND add an English translation in parentheses. Example: "Masa (corn dough)", "Sofrito (herb and vegetable base)"
  - Convert ALL vague measurements into specific estimates. Example: "a handful" → "¼ cup (approx. 30g)", "cook until done" → "cook for 8-10 minutes until golden brown"
  - Prefer weight measurements (grams/oz) alongside volume for accuracy
  - Steps must be numbered, detailed, and specific. Include exact times and temperatures
  - If temperature or time is not mentioned, provide a professional estimate based on the dish type
  - List ingredients in the exact order they are used
  - Detect the language spoken and note it, but write the recipe in English
  - If a crucial ingredient is missing but standard for this type of dish, add it and mark it with "inferred"
  - If a necessary step is missing (e.g. resting dough, blooming spices), add it and mark it with "inferred"
  - Only infer what is clearly missing — do not change the character of the dish

  Return ONLY a valid JSON object with absolutely no markdown, backticks, or extra text:
  {
    "title": "Clear descriptive recipe name",
    "language_detected": "language the user spoke",
    "cultural_background": "cuisine or cultural origin",
    "region_of_origin": "geographic region if mentioned",
    "storyteller": "who shared this recipe",
    "memory": "any personal story or memory attached to this dish",
    "description": "2-3 sentence description of the dish",
    "yield": {
      "total": "total amount produced e.g. 24 tamales or 2 liters",
      "serving_size": "size of one portion e.g. 2 tamales or 1 cup"
    },
    "prep_time": "estimated prep time e.g. 30 minutes",
    "cook_time": "estimated cook time e.g. 1 hour 30 minutes",
    "difficulty": "Easy / Medium / Hard",
    "equipment": [
      "specific tool e.g. 10-inch sauté pan",
      "specific tool e.g. standard mixing bowl"
    ],
    "ingredients": [
      {
        "item": "cultural name (English translation)",
        "amount": "precise measurement with weight preferred e.g. 2 cups (240g)",
        "preparation": "how to prep e.g. finely diced",
        "note": "inferred — if this ingredient was not mentioned by the user, otherwise leave blank"
      }
    ],
    "steps": [
      {
        "step": 1,
        "instruction": "Detailed, specific instruction with time and temperature e.g. Heat olive oil in a 10-inch pan over medium heat (350°F) for 2 minutes",
        "tip": "preserve user's exact words or wisdom if meaningful",
        "note": "inferred — if this step was not mentioned by the user, otherwise leave blank"
      }
    ],
    "flexibility_notes": "How the recipe can be adjusted for dietary needs, substitutions, or taste preferences",
    "tags": ["e.g. Mexican", "vegetarian", "holiday", "breakfast"]
  }
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();
  console.log('Gemini raw response:', JSON.stringify(data));
  const text = data.candidates[0].content.parts[0].text;
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}