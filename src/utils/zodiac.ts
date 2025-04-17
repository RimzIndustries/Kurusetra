// Zodiac signs data and prediction generator

export type ZodiacSign = {
  name: string;
  period: string;
  element: string;
  symbol: string;
  traits: string[];
  description: string;
};

export type ZodiacPrediction = {
  luck: string;
  love: string;
  winChance: number; // Percentage (0-100)
  dailyMessage: string;
};

// Zodiac signs data
export const zodiacSigns: Record<string, ZodiacSign> = {
  aries: {
    name: "Aries",
    period: "March 21 - April 19",
    element: "Fire",
    symbol: "Ram",
    traits: [
      "Courageous",
      "Determined",
      "Confident",
      "Enthusiastic",
      "Impulsive",
    ],
    description:
      "Aries is the first sign of the zodiac. Those born under this sign are passionate, motivated, and confident leaders who build community with their cheerful disposition and relentless determination.",
  },
  taurus: {
    name: "Taurus",
    period: "April 20 - May 20",
    element: "Earth",
    symbol: "Bull",
    traits: ["Reliable", "Patient", "Practical", "Devoted", "Stubborn"],
    description:
      "Taurus is an earth sign represented by the bull. Like their celestial spirit animal, Taureans enjoy relaxing in serene, bucolic environments surrounded by soft sounds, soothing aromas, and succulent flavors.",
  },
  gemini: {
    name: "Gemini",
    period: "May 21 - June 20",
    element: "Air",
    symbol: "Twins",
    traits: ["Gentle", "Affectionate", "Curious", "Adaptable", "Indecisive"],
    description:
      "Gemini is represented by the twins, and these air signs were interested in so many pursuits that they had to double themselves. Appropriately, this air sign was interested in so many pursuits that it had to double itself.",
  },
  cancer: {
    name: "Cancer",
    period: "June 21 - July 22",
    element: "Water",
    symbol: "Crab",
    traits: [
      "Tenacious",
      "Highly Imaginative",
      "Loyal",
      "Emotional",
      "Sympathetic",
    ],
    description:
      "Cancer is a cardinal water sign. Represented by the crab, this oceanic crustacean seamlessly weaves between the sea and shore representing Cancer's ability to exist in both emotional and material realms.",
  },
  leo: {
    name: "Leo",
    period: "July 23 - August 22",
    element: "Fire",
    symbol: "Lion",
    traits: ["Creative", "Passionate", "Generous", "Warm-hearted", "Cheerful"],
    description:
      "Roll out the red carpet because Leo has arrived. Leo is represented by the lion and these spirited fire signs are the kings and queens of the celestial jungle. They're delighted to embrace their royal status.",
  },
  virgo: {
    name: "Virgo",
    period: "August 23 - September 22",
    element: "Earth",
    symbol: "Virgin",
    traits: ["Loyal", "Analytical", "Kind", "Hardworking", "Practical"],
    description:
      "Virgo is an earth sign historically represented by the goddess of wheat and agriculture, an association that speaks to Virgo's deep-rooted presence in the material world.",
  },
  libra: {
    name: "Libra",
    period: "September 23 - October 22",
    element: "Air",
    symbol: "Scales",
    traits: [
      "Diplomatic",
      "Fair-minded",
      "Social",
      "Cooperative",
      "Indecisive",
    ],
    description:
      "Libra is an air sign represented by the scales, an association that reflects Libra's fixation on balance and harmony. Libra is obsessed with symmetry and strives to create equilibrium in all areas of life.",
  },
  scorpio: {
    name: "Scorpio",
    period: "October 23 - November 21",
    element: "Water",
    symbol: "Scorpion",
    traits: ["Resourceful", "Brave", "Passionate", "Stubborn", "Mysterious"],
    description:
      "Scorpio is one of the most misunderstood signs of the zodiac. Because of its incredible passion and power, Scorpio is often mistaken for a fire sign. In fact, Scorpio is a water sign that derives its strength from the psychic, emotional realm.",
  },
  sagittarius: {
    name: "Sagittarius",
    period: "November 22 - December 21",
    element: "Fire",
    symbol: "Archer",
    traits: [
      "Generous",
      "Idealistic",
      "Great sense of humor",
      "Adventurous",
      "Restless",
    ],
    description:
      "Represented by the archer, Sagittarians are always on a quest for knowledge. The last fire sign of the zodiac, Sagittarius launches its many pursuits like blazing arrows, chasing after geographical, intellectual, and spiritual adventures.",
  },
  capricorn: {
    name: "Capricorn",
    period: "December 22 - January 19",
    element: "Earth",
    symbol: "Goat",
    traits: [
      "Responsible",
      "Disciplined",
      "Self-control",
      "Good managers",
      "Reserved",
    ],
    description:
      "The last earth sign of the zodiac, Capricorn is represented by the sea goat, a mythological creature with the body of a goat and tail of a fish. Accordingly, Capricorns are skilled at navigating both the material and emotional realms.",
  },
  aquarius: {
    name: "Aquarius",
    period: "January 20 - February 18",
    element: "Air",
    symbol: "Water Bearer",
    traits: ["Progressive", "Original", "Independent", "Humanitarian", "Aloof"],
    description:
      "Despite the 'aqua' in its name, Aquarius is actually the last air sign of the zodiac. Aquarius is represented by the water bearer, the mystical healer who bestows water, or life, upon the land.",
  },
  pisces: {
    name: "Pisces",
    period: "February 19 - March 20",
    element: "Water",
    symbol: "Fish",
    traits: ["Compassionate", "Artistic", "Intuitive", "Gentle", "Wise"],
    description:
      "Pisces, a water sign, is the last constellation of the zodiac. It's symbolized by two fish swimming in opposite directions, representing the constant division of Pisces' attention between fantasy and reality.",
  },
};

// Luck messages for predictions
const luckMessages = [
  "Extremely favorable. The stars align perfectly for you today.",
  "Very good. Fortune smiles upon your endeavors.",
  "Favorable. Luck is on your side for most activities.",
  "Moderate. Some luck in specific areas, but be cautious.",
  "Challenging. Today may require extra effort to overcome obstacles.",
  "Difficult. The cosmic energies are testing your resilience.",
  "Mixed. Moments of luck interspersed with challenges.",
  "Improving. Your luck gets better as the day progresses.",
  "Fluctuating. Be ready to adapt to changing circumstances.",
  "Unexpected. Surprises may bring unusual opportunities.",
];

// Love messages for predictions
const loveMessages = [
  "Passionate connections are highlighted today. Express your feelings openly.",
  "A deep bond may form with someone unexpected. Keep your heart open.",
  "Existing relationships strengthen through honest communication.",
  "Romance is in the air. Make time for your significant other.",
  "Self-love is important today. Nurture your own needs first.",
  "Patience in matters of the heart will be rewarded soon.",
  "A misunderstanding may create temporary distance. Clear communication helps.",
  "Your charisma is heightened, attracting admirers from unexpected places.",
  "Take time to reflect on what you truly desire in relationships.",
  "Balance giving and receiving in your relationships for harmony.",
];

// Daily messages for predictions
const dailyMessages = [
  "Today is perfect for strategic planning in your kingdom.",
  "Your diplomatic skills will be particularly effective today.",
  "Focus on resource management for optimal results.",
  "Military training yields exceptional results today.",
  "A good day for forming new alliances and strengthening existing ones.",
  "Your intuition about resource locations is heightened today.",
  "Construction projects started today will progress smoothly.",
  "Your leadership abilities shine, inspiring loyalty in your subjects.",
  "Research and development efforts are particularly fruitful today.",
  "A good day for exploration and discovering new territories.",
  "Your defensive strategies are particularly effective today.",
  "Trade negotiations will go in your favor if initiated today.",
];

// Generate a random number between min and max (inclusive)
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate a daily prediction for a zodiac sign
export const generateDailyPrediction = (
  zodiacKey: string,
): ZodiacPrediction => {
  // Use the current date as seed for "randomness" to ensure same predictions for the whole day
  const today = new Date();
  const dateSeed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  // Use the zodiac key and date to create a seeded random number
  const seedValue = dateSeed + zodiacKey.length;

  // Simple seeded random function
  const seededRandom = () => {
    const x = Math.sin(seedValue++) * 10000;
    return x - Math.floor(x);
  };

  // Get index based on seeded random
  const getLuckIndex = Math.floor(seededRandom() * luckMessages.length);
  const getLoveIndex = Math.floor(seededRandom() * loveMessages.length);
  const getDailyIndex = Math.floor(seededRandom() * dailyMessages.length);

  // Generate win chance (between 30 and 85)
  const winChance = Math.floor(seededRandom() * 55) + 30;

  return {
    luck: luckMessages[getLuckIndex],
    love: loveMessages[getLoveIndex],
    winChance: winChance,
    dailyMessage: dailyMessages[getDailyIndex],
  };
};

// Get all zodiac signs with their daily predictions
export const getAllZodiacPredictions = (): Record<
  string,
  ZodiacSign & ZodiacPrediction
> => {
  const predictions: Record<string, ZodiacSign & ZodiacPrediction> = {};

  Object.entries(zodiacSigns).forEach(([key, sign]) => {
    const prediction = generateDailyPrediction(key);
    predictions[key] = {
      ...sign,
      ...prediction,
    };
  });

  return predictions;
};
