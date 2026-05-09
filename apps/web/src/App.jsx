
import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import { Footer } from '@/core/components/Footer.jsx';
import { Toaster } from '@/components/ui/toaster.jsx';
import { FavoritesProvider } from '@/contexts/FavoritesContext.jsx';

// Core Providers & Components
import { ThemeProvider } from '@/core/context/ThemeContext.jsx';
import { AuthProvider, DataProvider, DataCacheProvider } from '@/core/context/index.js';
import { Navigation, Breadcrumbs, LegacyRouteHandler, RouteGuard } from '@/core/components/index.js';

// Feature Pages
import { 
  StylishTextGeneratorPage,
  NicknameSymbolsPage,
  HomePage,
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
  GamerBioGeneratorPage,
  FavoritesPage,
  LeaderboardsPage,
} from '@/features/index.js';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import DynamicPage from '@/pages/DynamicPage.jsx';
import TopicHubPage from '@/pages/TopicHubPage.jsx';
import LeagueOfLegendsHubPage from '@/pages/LeagueOfLegendsHubPage.jsx';
import IdentityKitPage from '@/pages/IdentityKitPage.jsx';
import { TOPIC_HUB_ROUTES } from '@/seo/programmatic/topicHubRoutes.js';
import MinimalFavoritesPeek from '@/components/MinimalFavoritesPeek.jsx';

// Lazy Loaded Routes
const RobloxNamesMainPage = lazy(() => import('@/features/robloxNames').then(m => ({ default: m.RobloxNamesPage })));
const RobloxNamesCoolPage = lazy(() => import('@/features/robloxNames').then(m => ({ default: m.RobloxNamesCoolPage })));
const RobloxNamesFunnyPage = lazy(() => import('@/features/robloxNames').then(m => ({ default: m.RobloxNamesFunnyPage })));
const RobloxNamesAestheticPage = lazy(() => import('@/features/robloxNames').then(m => ({ default: m.RobloxNamesAestheticPage })));
const RobloxNamesTryhardPage = lazy(() => import('@/features/robloxNames').then(m => ({ default: m.RobloxNamesTryhardPage })));

const GamerNamesPage = lazy(() => import('@/features/gamerNames').then(m => ({ default: m.GamerNamesPage })));
const GamerNamesCoolPage = lazy(() => import('@/features/gamerNames').then(m => ({ default: m.GamerNamesCoolPage })));
const GamerNamesFunnyPage = lazy(() => import('@/features/gamerNames').then(m => ({ default: m.GamerNamesFunnyPage })));
const GamerNamesProPage = lazy(() => import('@/features/gamerNames').then(m => ({ default: m.GamerNamesProPage })));
const GamerNamesEdgyPage = lazy(() => import('@/features/gamerNames').then(m => ({ default: m.GamerNamesEdgyPage })));

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-muted-foreground font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <DataCacheProvider>
              <Router>
                <RouteGuard>
                  <LegacyRouteHandler>
                    <FavoritesProvider>
                      <ScrollToTop />
                      <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
                        <Navigation />
                        <Breadcrumbs />
                        <main className="flex-grow flex flex-col">
                          <Routes>
                            {/* Core Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/stylish-text-generator" element={<StylishTextGeneratorPage />} />
                            <Route path="/nickname-symbols" element={<NicknameSymbolsPage />} />
                            <Route path="/identity-kit" element={<IdentityKitPage />} />

                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                            <Route path="/gamer-bio-generator" element={<GamerBioGeneratorPage />} />
                            <Route path="/favorites" element={<FavoritesPage />} />
                            <Route path="/leaderboards" element={<LeaderboardsPage />} />
                            <Route path="/404" element={<NotFoundPage />} />

                            {/* Topic Hubs (semantic intent hubs) */}
                            {TOPIC_HUB_ROUTES.map((r) => (
                              <Route key={r.slug} path={r.path} element={<TopicHubPage hubSlug={r.slug} />} />
                            ))}

                            <Route path="/league-of-legends" element={<LeagueOfLegendsHubPage />} />
                            
                            {/* Lazy Loaded Roblox Routes */}
                            <Route path="/roblox-names" element={<Suspense fallback={<PageLoader />}><RobloxNamesMainPage /></Suspense>} />
                            <Route path="/roblox-names/cool" element={<Suspense fallback={<PageLoader />}><RobloxNamesCoolPage /></Suspense>} />
                            <Route path="/roblox-names/funny" element={<Suspense fallback={<PageLoader />}><RobloxNamesFunnyPage /></Suspense>} />
                            <Route path="/roblox-names/aesthetic" element={<Suspense fallback={<PageLoader />}><RobloxNamesAestheticPage /></Suspense>} />
                            <Route path="/roblox-names/tryhard" element={<Suspense fallback={<PageLoader />}><RobloxNamesTryhardPage /></Suspense>} />

                            {/* Lazy Loaded Gamer Routes */}
                            <Route path="/gamer-names" element={<Suspense fallback={<PageLoader />}><GamerNamesPage /></Suspense>} />
                            <Route path="/gamer-names/cool" element={<Suspense fallback={<PageLoader />}><GamerNamesCoolPage /></Suspense>} />
                            <Route path="/gamer-names/funny" element={<Suspense fallback={<PageLoader />}><GamerNamesFunnyPage /></Suspense>} />
                            <Route path="/gamer-names/pro" element={<Suspense fallback={<PageLoader />}><GamerNamesProPage /></Suspense>} />
                            <Route path="/gamer-names/edgy" element={<Suspense fallback={<PageLoader />}><GamerNamesEdgyPage /></Suspense>} />

                            {/* Dynamic Route for Cluster Pages (multi-segment: /category/keyword) */}
                            <Route path="/:category/:keyword" element={<DynamicPage />} />

                            {/* Catch-all 404 Route */}
                            <Route path="*" element={<NotFoundPage />} />
                          </Routes>
                        </main>
                        <Footer />
                      </div>
                      <Toaster />
                      <MinimalFavoritesPeek />
                    </FavoritesProvider>
                  </LegacyRouteHandler>
                </RouteGuard>
              </Router>
            </DataCacheProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
