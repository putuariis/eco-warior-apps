const RANKS = [
  { min: 0, name: "Eco Rookie", emoji: "🌱" },
  { min: 500, name: "Green Scout", emoji: "🌿" },
  { min: 1500, name: "Eco Warrior", emoji: "🍃" },
  { min: 3000, name: "Climate Guardian", emoji: "🌳" },
  { min: 6000, name: "Earth Champion", emoji: "🌍" },
  { min: 10000, name: "Planet Legend", emoji: "🏆" },
] as const;

export function getRank(xp: number) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.min) rank = r;
  }
  return rank;
}

export function getLevel(xp: number) {
  return Math.floor(xp / 500) + 1;
}
