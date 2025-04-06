import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ResourceManagement from "./components/game/ResourceManagement";
import Building from "./components/game/Building";
import Military from "./components/game/Military";
import DewanRaja from "./components/game/DewanRaja";
import CombatInterface from "./components/game/CombatInterface";
import KingdomOverview from "./components/game/KingdomOverview";
import Layout from "./components/Layout";
import routes from "tempo-routes";

function AppRoutes() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<ResourceManagement />} />
            <Route path="/building" element={<Building />} />
            <Route path="/military" element={<Military />} />
            <Route path="/alliance" element={<DewanRaja />} />
            <Route path="/combat" element={<CombatInterface />} />
            <Route path="/kingdom" element={<KingdomOverview />} />
          </Route>
          {/* Add the tempo route before the catch-all */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
