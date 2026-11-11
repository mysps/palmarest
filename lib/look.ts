// How a venue looks: an emoji for its category and one of five sticker colours.

const RULES: [RegExp, string][] = [
  [/tapas|pintxo/i, "🍢"],
  [/cocktail/i, "🍸"],
  [/beer|cervec|pub/i, "🍺"],
  [/wine|bodega|vermut/i, "🍷"],
  [/pizza/i, "🍕"],
  [/ramen|noodle/i, "🍜"],
  [/japan|sushi/i, "🍣"],
  [/burger/i, "🍔"],
  [/mexic|taco/i, "🌮"],
  [/korean/i, "🥢"],
  [/thai|indian|asian|chinese|vietnam/i, "🍛"],
  [/steak|grill|asador/i, "🥩"],
  [/vegan|vegetarian|plant/i, "🥗"],
  [/caf[eé]|coffee|brunch/i, "☕"],
  [/baker|pastr|cake/i, "🥐"],
  [/ice cream|gelat/i, "🍦"],
  [/italian|pasta/i, "🍝"],
  [/mediterr|mallorc|spanish/i, "🫒"],
  [/beach|chiringuito/i, "🏖️"],
  [/\bbar\b/i, "🍻"],
];

export const emojiFor = (category: string) => RULES.find(([re]) => re.test(category))?.[1] ?? "🍽️";

const COLOURS = ["pink", "lemon", "sea", "orange", "lilac"] as const;

export function colourFor(seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return COLOURS[h % COLOURS.length];
}
