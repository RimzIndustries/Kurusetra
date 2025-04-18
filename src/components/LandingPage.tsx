import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllZodiacPredictions } from '../utils/zodiac';
import { cn } from '../utils/cn';
import LoginMenu from './auth/LoginMenu';

type Race = {
  name: string;
  description: string;
  strengths: string[];
  image: string;
};

const races: Race[] = [
  {
    name: "Human",
    description: "Balanced and adaptable, humans excel in diplomacy and trade. Their kingdoms are known for rapid technological advancement.",
    strengths: ["Diplomatic Relations", "Trade Efficiency", "Fast Learning", "Resource Management"],
    image: "/races/human.jpg"
  },
  {
    name: "Elf",
    description: "Masters of nature and magic, elves build their kingdoms in harmony with the environment. Their defenses are enhanced by natural barriers.",
    strengths: ["Magic Mastery", "Nature Affinity", "Enhanced Defense", "Archery Excellence"],
    image: "/races/elf.jpg"
  },
  {
    name: "Dwarf",
    description: "Expert miners and craftsmen, dwarven kingdoms are built deep within mountains. Their fortifications and weapons are unmatched.",
    strengths: ["Mining Efficiency", "Crafting Mastery", "Fortress Building", "Artillery Power"],
    image: "/races/dwarf.jpg"
  },
  {
    name: "Orc",
    description: "Warriors by nature, orc kingdoms thrive on conquest. Their military might and aggressive expansion strategies are feared by all.",
    strengths: ["Military Power", "Rapid Expansion", "Resource Raiding", "Intimidation Tactics"],
    image: "/races/orc.jpg"
  }
];

export default function LandingPage() {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [zodiacPredictions, setZodiacPredictions] = useState<any>(null);
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);
  const [showLoginMenu, setShowLoginMenu] = useState(false);

  useEffect(() => {
    const predictions = getAllZodiacPredictions();
    setZodiacPredictions(predictions);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 bg-opacity-50 fixed w-full z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Kingdom Wars</Link>
          <div className="space-x-4">
            <button
              onClick={() => setShowLoginMenu(true)}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            <Link
              to="/register"
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-5xl font-bold text-center mb-8">Welcome to Kingdom Wars</h1>
        <p className="text-xl text-center text-gray-300 mb-12">
          Choose your race and discover your destiny through the stars
        </p>
      </div>

      {/* Race Selection */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Choose Your Race</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {races.map((race) => (
            <div
              key={race.name}
              className={cn(
                "p-6 rounded-lg cursor-pointer transition-all",
                "bg-gray-800 hover:bg-gray-700",
                selectedRace?.name === race.name && "ring-2 ring-blue-500"
              )}
              onClick={() => setSelectedRace(race)}
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <img
                  src={race.image}
                  alt={race.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{race.name}</h3>
              <p className="text-gray-400 mb-4">{race.description}</p>
              <div>
                <h4 className="font-semibold mb-2">Strengths:</h4>
                <ul className="list-disc list-inside text-gray-400">
                  {race.strengths.map((strength) => (
                    <li key={strength}>{strength}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Zodiac Predictions */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Daily Zodiac Predictions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {zodiacPredictions && Object.entries(zodiacPredictions).map(([key, zodiac]: [string, any]) => (
            <div
              key={key}
              className={cn(
                "p-6 rounded-lg cursor-pointer transition-all",
                "bg-gray-800 hover:bg-gray-700",
                selectedZodiac === key && "ring-2 ring-purple-500"
              )}
              onClick={() => setSelectedZodiac(key)}
            >
              <h3 className="text-xl font-bold mb-2">{zodiac.name}</h3>
              <p className="text-gray-400 mb-2">{zodiac.period}</p>
              {selectedZodiac === key && (
                <div className="mt-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-purple-400">Luck Today:</h4>
                    <p className="text-gray-300">{zodiac.luck}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-400">Love Forecast:</h4>
                    <p className="text-gray-300">{zodiac.love}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400">Battle Victory Chance:</h4>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${zodiac.winChance}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-300 mt-1">{zodiac.winChance}%</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-400">Daily Message:</h4>
                    <p className="text-gray-300">{zodiac.dailyMessage}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
        <p className="text-xl text-gray-400 mb-8">
          Join thousands of players in the ultimate kingdom building experience
        </p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            Create Account
          </Link>
          <button
            onClick={() => setShowLoginMenu(true)}
            className="inline-block px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            Login
          </button>
        </div>
      </section>

      {/* Login Menu */}
      {showLoginMenu && <LoginMenu />}
    </div>
  );
}
