import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ResourceManagement from "./components/game/ResourceManagement";
import Building from "./components/game/Building";
import Military from "./components/game/Military";
import DewanRaja from "./components/game/DewanRaja";
import CombatInterface from "./components/game/CombatInterface";
import KingdomOverview from "./components/game/KingdomOverview";
import GameMap from "./components/game/GameMap";
import Layout from "./components/Layout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import KingdomSetup from "./components/game/KingdomSetup";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { MultiplayerProvider } from "./contexts/MultiplayerContext";
import routes from "tempo-routes";

function AppRoutes() {
  return (
    <AuthProvider>
      <MultiplayerProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <p className="text-lg">Loading...</p>
            </div>
          }
        >
          <>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                {/* Setup routes - outside of main layout */}
                <Route path="/setup-kingdom" element={<KingdomSetup />} />

                {/* Main app routes - only accessible after setup */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/resources" element={<ResourceManagement />} />
                  <Route path="/building" element={<Building />} />
                  <Route path="/military" element={<Military />} />
                  <Route path="/alliance" element={<DewanRaja />} />
                  <Route path="/combat" element={<CombatInterface />} />
                  <Route path="/kingdom" element={<KingdomOverview />} />
                  <Route path="/map" element={<GameMap />} />
                  <Route path="/profile" element={<UserProfile />} />
                </Route>
              </Route>

              {/* Add the tempo route before the catch-all */}
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" />
              )}
            </Routes>
            {/* Ensure Tempo routes are also wrapped in AuthProvider */}
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          </>
        </Suspense>
      </MultiplayerProvider>
    </AuthProvider>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
