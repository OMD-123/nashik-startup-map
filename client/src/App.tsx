import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { Company, FilterState, Meta, Stats } from "./types";
import { fetchCompanies, fetchMeta, fetchStats } from "./api";
import { ExplorePage } from "./pages/ExplorePage";
import { SubmitPage } from "./pages/SubmitPage";
import { AboutPage } from "./pages/AboutPage";

export default function App() {
  // Keep meta + stats cached for child routes
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}