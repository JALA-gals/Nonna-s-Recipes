const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
console.log('gemini.js loaded');

export async function structureRecipe(transcript, metadata = {}) {
  const prompt = `
    You are helping preserve a family recipe shared through voice.
    The speaker may be an elder who cooks from memory and uses vague measurements.
    Preserve their voice and personality in the recipe.
    
    Transcript: "${transcript}"
    Additional context: ${JSON.stringify(metadata)}
    
    Return ONLY a JSON object with no markdown or backticks:
    {
      "title": "recipe name",
      "storyteller": "who shared this",
      "memory": "any personal story attached to this dish",
      "cultural_background": "cuisine or cultural origin",
      "region_of_origin": "geographic region if mentioned",
      "ingredients": [
        { "item": "", "amount": "", "note": "keep vague phrasing if used" }
      ],
      "steps": [
        { "step": 1, "instruction": "", "tip": "elder's exact words if meaningful" }
      ],
      "flexibility_notes": "how the recipe can be adjusted to taste"
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