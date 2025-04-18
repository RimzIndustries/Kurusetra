# Kingdom Wars

A multiplayer strategy game where players build kingdoms, form alliances, and wage wars in a fantasy world.

## Features

- Race Selection (Human, Elf, Dwarf, Orc)
- Daily Zodiac Predictions
- Kingdom Building
- Resource Management
- Military System
- Alliance System
- War System
- Real-time Multiplayer

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Supabase
- Database: PostgreSQL
- Authentication: Supabase Auth
- Real-time: Supabase Realtime

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kingdom-wars.git
cd kingdom-wars
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_API_URL=http://localhost:3000/api
VITE_TEMPO=false
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/         # React components
├── contexts/          # React contexts
├── hooks/            # Custom hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── App.tsx           # Main application component
```

## Database Schema

The project uses Supabase with the following main tables:

- users
- kingdoms
- resources
- buildings
- units
- alliances
- wars
- zodiac_predictions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
