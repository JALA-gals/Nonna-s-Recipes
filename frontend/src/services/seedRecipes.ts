// frontend/src/services/seedRecipes.ts
console.log("LOADED seedRecipes.ts");

import { auth } from "../lib/firebase";
import { createRecipe, type CreateRecipeInput } from "./recipes";

// ✅ Direct, stable-ish image URLs from Wikimedia Commons.
// This returns the actual image file via redirect.
const commons = (filename: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;

// ✅ Map dish -> real photo URL (matches the food)
const PHOTO_URLS = {
  shakshuka: commons("Shakshuka picture.jpg"),
  jollof: commons("Jollof rice.jpg"),
  adobo: commons("Chicken adobo.jpg"),
  pastor: commons("Tacos al pastor - Taquería Tizne 01.jpg"),
  ragu: commons("Ragu alla napoletana 008.jpg"),
  bibimbap: commons("Korean.food-Bibimbap-01.jpg"),
  paoDeQueijo: commons("Pão de Queijo (Brazilian Cheese Bread).jpg"),
  goulash: commons("Gulyas080.jpg"),
  padThai: commons("Pad Thai in Thailand.jpg"),
  baklava: commons("Baklava - Turkish special, 80-ply.JPEG"),
  bobotie: commons("Bobotie South Africa.jpg"),
  pierogi: commons("Pierogi 07-01.JPG"),
  falafel: commons("Falafels 2.jpg"),
  clamChowder: commons("Clam chowder.jpg"),
  laksa: commons("Laksa Noodle Soup.jpg"),
} as const;

type DummyRecipe = Omit<CreateRecipeInput, "createdBy">;

const DUMMY_RECIPES: DummyRecipe[] = [
  {
    title: "Shakshuka",
    visibility: "public",
    origin: { name: "Jerusalem", countryCode: "IL", lat: 31.7683, lng: 35.2137 },
    description: "Eggs poached in spiced tomato-pepper sauce.",
    region: "Middle East",
    tags: ["eggs", "tomato", "one-pan"],
    ingredients: [{ item: "eggs", amount: "4" }, { item: "tomatoes", amount: "28 oz" }],
    steps: [{ step: 1, instruction: "Simmer sauce." }, { step: 2, instruction: "Poach eggs." }],
    story: "A cozy weekend breakfast tradition.",
    storyteller: "Teta Miriam",
    languageDetected: "ar",
    photoUrl: PHOTO_URLS.shakshuka,
  },
  {
    title: "Jollof Rice",
    visibility: "public",
    origin: { name: "Lagos", countryCode: "NG", lat: 6.5244, lng: 3.3792 },
    description: "Tomato-pepper rice with warm spices.",
    region: "Africa",
    tags: ["rice", "party"],
    ingredients: [{ item: "rice", amount: "2 cups" }, { item: "tomato base", amount: "2 cups" }],
    steps: [
      { step: 1, instruction: "Cook down tomato base." },
      { step: 2, instruction: "Cook rice in sauce." },
    ],
    story: "Every celebration started with this smell.",
    storyteller: "Auntie Kemi",
    languageDetected: "en",
    photoUrl: PHOTO_URLS.jollof,
  },
  {
    title: "Chicken Adobo",
    visibility: "public",
    origin: { name: "Manila", countryCode: "PH", lat: 14.5995, lng: 120.9842 },
    description: "Soy-vinegar braised chicken with garlic and bay.",
    region: "Asia",
    tags: ["braise", "garlic"],
    ingredients: [{ item: "chicken thighs", amount: "2 lb" }, { item: "soy sauce", amount: "1/2 cup" }],
    steps: [
      { step: 1, instruction: "Simmer chicken in sauce." },
      { step: 2, instruction: "Reduce until glossy." },
    ],
    story: "Better the next day, so we always made extra.",
    storyteller: "Mama Joy",
    languageDetected: "en",
    photoUrl: PHOTO_URLS.adobo,
  },
  {
    title: "Tacos al Pastor",
    visibility: "public",
    origin: { name: "Mexico City", countryCode: "MX", lat: 19.4326, lng: -99.1332 },
    description: "Achiote pork with pineapple, street-style.",
    region: "Americas",
    tags: ["tacos", "street-food"],
    ingredients: [{ item: "pork", amount: "2 lb" }, { item: "pineapple", amount: "1 cup" }],
    steps: [{ step: 1, instruction: "Marinate pork." }, { step: 2, instruction: "Sear and serve." }],
    story: "The pineapple makes it happy food.",
    storyteller: "Tío Rafa",
    languageDetected: "es",
    photoUrl: PHOTO_URLS.pastor,
  },
  {
    title: "Neapolitan Ragù",
    visibility: "public",
    origin: { name: "Naples", countryCode: "IT", lat: 40.8518, lng: 14.2681 },
    description: "Slow Sunday sauce simmered for hours.",
    region: "Europe",
    tags: ["italian", "sunday"],
    ingredients: [{ item: "tomato passata", amount: "28 oz" }, { item: "beef", amount: "1.5 lb" }],
    steps: [
      { step: 1, instruction: "Start the sauce low and slow." },
      { step: 2, instruction: "Simmer 2–3 hours." },
    ],
    story: "If you can smell it from the hallway, it’s working.",
    storyteller: "Nonna Lucia",
    languageDetected: "it",
    photoUrl: PHOTO_URLS.ragu,
  },

  {
    title: "Bibimbap",
    visibility: "public",
    origin: { name: "Seoul", countryCode: "KR", lat: 37.5665, lng: 126.978 },
    description: "Rice bowl topped with vegetables, beef, and spicy gochujang.",
    region: "Asia",
    tags: ["korean", "rice", "bowl"],
    ingredients: [
      { item: "cooked rice", amount: "2 cups" },
      { item: "spinach", amount: "1 cup" },
      { item: "carrots", amount: "1 cup", preparation: "julienned" },
      { item: "beef", amount: "8 oz" },
      { item: "gochujang", amount: "2 tbsp" },
    ],
    steps: [
      { step: 1, instruction: "Cook vegetables separately." },
      { step: 2, instruction: "Assemble over rice and top with sauce." },
    ],
    story: "My grandmother said every color brings balance.",
    storyteller: "Halmeoni Sun",
    languageDetected: "ko",
    photoUrl: PHOTO_URLS.bibimbap,
  },
  {
    title: "Pão de Queijo",
    visibility: "public",
    origin: { name: "Belo Horizonte", countryCode: "BR", lat: -19.9167, lng: -43.9345 },
    description: "Brazilian cheese bread with crispy outside and soft inside.",
    region: "Americas",
    tags: ["brazilian", "bread", "cheese"],
    ingredients: [
      { item: "tapioca flour", amount: "2 cups" },
      { item: "milk", amount: "1 cup" },
      { item: "cheese", amount: "1 cup" },
      { item: "egg", amount: "1" },
    ],
    steps: [
      { step: 1, instruction: "Mix all ingredients into dough." },
      { step: 2, instruction: "Bake at 375°F until golden." },
    ],
    story: "We always made these before school.",
    storyteller: "Vovó Clara",
    languageDetected: "pt",
    photoUrl: PHOTO_URLS.paoDeQueijo,
  },
  {
    title: "Goulash",
    visibility: "public",
    origin: { name: "Budapest", countryCode: "HU", lat: 47.4979, lng: 19.0402 },
    description: "Paprika-rich beef stew with deep warmth.",
    region: "Europe",
    tags: ["hungarian", "stew", "paprika"],
    ingredients: [
      { item: "beef chuck", amount: "2 lb" },
      { item: "paprika", amount: "2 tbsp" },
      { item: "onion", amount: "2" },
      { item: "potatoes", amount: "2 cups" },
    ],
    steps: [
      { step: 1, instruction: "Brown beef and onions." },
      { step: 2, instruction: "Add paprika and simmer until tender." },
    ],
    story: "Paprika must go in after the heat drops — never burn it.",
    storyteller: "Nagymama Ilona",
    languageDetected: "hu",
    photoUrl: PHOTO_URLS.goulash,
  },
  {
    title: "Pad Thai",
    visibility: "public",
    origin: { name: "Bangkok", countryCode: "TH", lat: 13.7563, lng: 100.5018 },
    description: "Sweet, sour, and savory stir-fried rice noodles.",
    region: "Asia",
    tags: ["thai", "noodles", "street-food"],
    ingredients: [
      { item: "rice noodles", amount: "8 oz" },
      { item: "shrimp", amount: "1 lb" },
      { item: "bean sprouts", amount: "1 cup" },
      { item: "tamarind paste", amount: "2 tbsp" },
    ],
    steps: [
      { step: 1, instruction: "Soak noodles." },
      { step: 2, instruction: "Stir-fry shrimp, add sauce, toss noodles." },
    ],
    story: "Street vendors always made it taste better.",
    storyteller: "Mae Lin",
    languageDetected: "th",
    photoUrl: PHOTO_URLS.padThai,
  },
  {
    title: "Baklava",
    visibility: "public",
    origin: { name: "Istanbul", countryCode: "TR", lat: 41.0082, lng: 28.9784 },
    description: "Layered phyllo pastry with nuts and honey syrup.",
    region: "Middle East",
    tags: ["dessert", "pastry", "nuts"],
    ingredients: [
      { item: "phyllo dough", amount: "1 package" },
      { item: "walnuts", amount: "2 cups" },
      { item: "honey", amount: "1 cup" },
      { item: "butter", amount: "1 cup" },
    ],
    steps: [
      { step: 1, instruction: "Layer phyllo with butter and nuts." },
      { step: 2, instruction: "Bake and pour syrup over hot pastry." },
    ],
    story: "It’s never too sweet if shared with family.",
    storyteller: "Teyze Aylin",
    languageDetected: "tr",
    photoUrl: PHOTO_URLS.baklava,
  },
  {
    title: "Bobotie",
    visibility: "public",
    origin: { name: "Cape Town", countryCode: "ZA", lat: -33.9249, lng: 18.4241 },
    description: "Spiced minced meat baked with egg custard topping.",
    region: "Africa",
    tags: ["south african", "baked", "spiced"],
    ingredients: [
      { item: "ground beef", amount: "1 lb" },
      { item: "curry powder", amount: "1 tbsp" },
      { item: "milk", amount: "1 cup" },
      { item: "egg", amount: "2" },
    ],
    steps: [{ step: 1, instruction: "Cook spiced meat mixture." }, { step: 2, instruction: "Top with custard and bake." }],
    story: "This dish reminds me of Sunday lunches.",
    storyteller: "Ouma Elise",
    languageDetected: "af",
    photoUrl: PHOTO_URLS.bobotie,
  },
  {
    title: "Pierogi",
    visibility: "public",
    origin: { name: "Kraków", countryCode: "PL", lat: 50.0647, lng: 19.945 },
    description: "Soft dumplings stuffed with potato and cheese.",
    region: "Europe",
    tags: ["polish", "dumplings"],
    ingredients: [
      { item: "flour", amount: "3 cups" },
      { item: "potatoes", amount: "2 cups mashed" },
      { item: "cheese", amount: "1 cup" },
    ],
    steps: [{ step: 1, instruction: "Prepare dough." }, { step: 2, instruction: "Fill, seal, and boil dumplings." }],
    story: "We always pinched the edges carefully together.",
    storyteller: "Babcia Zofia",
    languageDetected: "pl",
    photoUrl: PHOTO_URLS.pierogi,
  },
  {
    title: "Falafel",
    visibility: "public",
    origin: { name: "Amman", countryCode: "JO", lat: 31.9454, lng: 35.9284 },
    description: "Crispy fried chickpea patties served with tahini.",
    region: "Middle East",
    tags: ["vegetarian", "street-food"],
    ingredients: [
      { item: "chickpeas", amount: "2 cups soaked" },
      { item: "parsley", amount: "1/2 cup" },
      { item: "garlic", amount: "3 cloves" },
    ],
    steps: [{ step: 1, instruction: "Blend ingredients into coarse paste." }, { step: 2, instruction: "Shape and fry until golden." }],
    story: "Crunchy outside, soft inside — that’s the rule.",
    storyteller: "Um Khaled",
    languageDetected: "ar",
    photoUrl: PHOTO_URLS.falafel,
  },
  {
    title: "Clam Chowder",
    visibility: "public",
    origin: { name: "Boston", countryCode: "US", lat: 42.3601, lng: -71.0589 },
    description: "Creamy clam soup with potatoes and herbs.",
    region: "Americas",
    tags: ["seafood", "soup"],
    ingredients: [
      { item: "clams", amount: "1 lb" },
      { item: "potatoes", amount: "2 cups diced" },
      { item: "cream", amount: "1 cup" },
    ],
    steps: [{ step: 1, instruction: "Cook clams and potatoes." }, { step: 2, instruction: "Add cream and simmer gently." }],
    story: "We ate this by the harbor in winter.",
    storyteller: "Grandpa Joe",
    languageDetected: "en",
    photoUrl: PHOTO_URLS.clamChowder,
  },
  {
    title: "Laksa",
    visibility: "public",
    origin: { name: "Singapore", countryCode: "SG", lat: 1.3521, lng: 103.8198 },
    description: "Spicy coconut noodle soup with shrimp.",
    region: "Asia",
    tags: ["spicy", "soup", "noodles"],
    ingredients: [
      { item: "rice noodles", amount: "8 oz" },
      { item: "coconut milk", amount: "2 cups" },
      { item: "shrimp", amount: "1 lb" },
    ],
    steps: [{ step: 1, instruction: "Simmer curry paste with coconut milk." }, { step: 2, instruction: "Add noodles and shrimp." }],
    story: "The broth must be bold and fragrant.",
    storyteller: "Ah Ma",
    languageDetected: "en",
    photoUrl: PHOTO_URLS.laksa,
  },
];

// ✅ THIS is what your UI should call:
export async function seedDummyRecipes(count = 20) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not logged in");

  const slice = DUMMY_RECIPES.slice(0, Math.min(count, DUMMY_RECIPES.length));
  for (const r of slice) {
    await createRecipe({ ...r, createdBy: uid });
  }

  return { seeded: slice.length };
}