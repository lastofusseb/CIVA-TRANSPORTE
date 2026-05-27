// ============================================
// INTELLIGENT ANALYTICS ENGINE
// CIVA AI RESEARCH v2.5
// ============================================

export const calculateRouteScore = ({
  traffic,
  time,
  distance,
  cost,
  risk
}: {
  traffic: number;
  time: number;
  distance: number;
  cost: number;
  risk: number;
}) => {

  const score =
    100 -
    (
      (traffic * 0.40) +
      (time * 0.25) +
      (distance * 0.20) +
      (cost * 0.10) +
      (risk * 0.05)
    );

  return Math.max(parseFloat(score.toFixed(1)), 0);
};

// ============================================
// CONGESTION PREDICTION ENGINE
// ============================================

export const predictCongestion = ({
  currentTraffic,
  hour,
  weather
}: {
  currentTraffic: number;
  hour: number;
  weather: string;
}) => {

  let congestion = currentTraffic;

  // Morning peak
  if (hour >= 6 && hour <= 9) {
    congestion += 15;
  }

  // Evening peak
  if (hour >= 17 && hour <= 21) {
    congestion += 20;
  }

  // Weather conditions
  if (weather === 'rain') {
    congestion += 10;
  }

  if (weather === 'heavy_rain') {
    congestion += 20;
  }

  return Math.min(congestion, 100);
};

// ============================================
// DIJKSTRA INSPIRED OPTIMIZATION ENGINE
// ============================================

export interface Route {
  name: string;
  traffic: number;
  time: number;
  distance: number;
  cost: number;
  risk: number;
  score?: number;
}

export const selectOptimalRoute = (routes: Route[]) => {

  const optimizedRoutes = routes.map(route => {

    const score =
      100 -
      (
        (route.traffic * 0.40) +
        (route.time * 0.25) +
        (route.distance * 0.20) +
        (route.cost * 0.10) +
        (route.risk * 0.05)
      );

    return {
      ...route,
      score
    };
  });

  optimizedRoutes.sort((a, b) => (b.score || 0) - (a.score || 0));

  return optimizedRoutes[0];
};

// ============================================
// MOCK ANALYTICS DATA
// ============================================

export const dashboardMetrics = {

  neuralAccuracy: 98.4,

  interactions: "14.2K",

  responseLatency: "0.8s",

  optimizationLevel: 42.5,

  routeScore: 91.2,

  congestionPrediction: 73,

  routeStability: 88.6,

  aiEfficiency: 96.3
};

// ============================================
// EXAMPLE ROUTES
// ============================================

export const sampleRoutes: Route[] = [
  {
    name: "Ruta Javier Prado",
    traffic: 82,
    time: 40,
    distance: 30,
    cost: 20,
    risk: 15
  },

  {
    name: "Ruta Evitamiento",
    traffic: 35,
    time: 32,
    distance: 38,
    cost: 18,
    risk: 10
  },

  {
    name: "Ruta Costa Verde",
    traffic: 60,
    time: 28,
    distance: 40,
    cost: 25,
    risk: 20
  }
];

// ============================================
// MAIN OPTIMAL ROUTE
// ============================================

export const optimalRoute = selectOptimalRoute(sampleRoutes);

// ============================================
// AI STATUS ENGINE
// ============================================

export const getTrafficStatus = (value: number) => {

  if (value <= 30) {
    return "LOW";
  }

  if (value <= 60) {
    return "MEDIUM";
  }

  return "HIGH";
};

// ============================================
// ETA PREDICTION ENGINE
// ============================================

export const predictETA = ({
  baseTime,
  congestion
}: {
  baseTime: number;
  congestion: number;
}) => {

  const delayFactor = congestion * 0.35;

  return Math.round(baseTime + delayFactor);
};
