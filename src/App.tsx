import { Suspense, lazy, useCallback } from "react";
import { useRoutes, Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import OfflineIndicator from "./components/OfflineIndicator";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import { AuthProvider } from "./contexts/AuthContext";
import { MultiplayerProvider } from "./contexts/MultiplayerContext";
import React from "react";
import routes from "tempo-routes";
import { captureError } from "./utils/sentry";
import { PerformanceMetrics } from "./components/PerformanceMetrics";

// Lazy load components
const Home = lazy(() => import("./components/home"));
const ResourceManagement = lazy(() => import("./components/game/ResourceManagement"));
const Building = lazy(() => import("./components/game/Building"));
const Military = lazy(() => import("./components/game/Military"));
const DewanRaja = lazy(() => import("./components/game/DewanRaja"));
const CombatInterface = lazy(() => import("./components/game/CombatInterface"));
const KingdomOverview = lazy(() => import("./components/game/KingdomOverview"));
const GameMap = lazy(() => import("./components/game/GameMap"));

// Memoized components
const MemoizedLayout = React.memo(Layout);
const MemoizedProtectedRoute = React.memo(ProtectedRoute);

function AppRoutes() {
  const handleError = useCallback((error: Error) => {
    captureError(error, { component: 'App' });
  }, []);

  return (
    <ErrorBoundary onError={handleError}>
      <AuthProvider>
        <MultiplayerProvider>
          <Router>
            <div className="min-h-screen bg-gray-100">
              <OfflineIndicator />
              <PerformanceMetrics />
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <LoadingSpinner size="lg" text="Loading game..." />
                  </div>
                }
              >
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/landing" element={<LandingPage />} />

                  {/* Protected routes */}
                  <Route element={<MemoizedProtectedRoute />}>
                    <Route element={<MemoizedLayout />}>
                      {/* Dashboard routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<Home />} />
                      <Route path="/home" element={<Home />} />

                      {/* Game management routes */}
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
              </Suspense>
            </div>
          </Router>
        </MultiplayerProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const App = React.memo(function App() {
  return <AppRoutes />;
});

export default App;
