import { create } from 'zustand';

export type ViewState =
  | 'GALAXY_VIEW'
  | 'TRANSITIONING_TO_PLANET'
  | 'PLANET_VIEW'
  | 'TRANSITIONING_TO_GALAXY';

export type QualityLevel = 'high' | 'medium' | 'low';

interface NavigationState {
  currentView: ViewState;
  selectedPlanet: string | null;
  isTransitioning: boolean;
  qualityLevel: QualityLevel;

  selectPlanet: (planetId: string) => void;
  switchPlanet: (planetId: string) => void;
  onZoomComplete: () => void;
  returnToGalaxy: () => void;
  onReturnComplete: () => void;
  setQualityLevel: (level: QualityLevel) => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentView: 'GALAXY_VIEW',
  selectedPlanet: null,
  isTransitioning: false,
  qualityLevel: 'high',

  selectPlanet: (planetId: string) => {
    const { isTransitioning } = get();
    if (isTransitioning) return;

    set({
      selectedPlanet: planetId,
      currentView: 'TRANSITIONING_TO_PLANET',
      isTransitioning: true,
    });
  },

  switchPlanet: (planetId: string) => {
    const { isTransitioning, currentView, selectedPlanet } = get();
    if (isTransitioning) return;
    if (selectedPlanet === planetId) return;

    if (currentView === 'PLANET_VIEW') {
      // Already viewing a planet — transition to the new one
      set({
        selectedPlanet: planetId,
        currentView: 'TRANSITIONING_TO_PLANET',
        isTransitioning: true,
      });
    } else {
      // Galaxy view — normal select
      set({
        selectedPlanet: planetId,
        currentView: 'TRANSITIONING_TO_PLANET',
        isTransitioning: true,
      });
    }
  },

  onZoomComplete: () => {
    set({
      currentView: 'PLANET_VIEW',
      isTransitioning: false,
    });
  },

  returnToGalaxy: () => {
    const { isTransitioning } = get();
    if (isTransitioning) return;

    set({
      currentView: 'TRANSITIONING_TO_GALAXY',
      isTransitioning: true,
    });
  },

  onReturnComplete: () => {
    set({
      currentView: 'GALAXY_VIEW',
      selectedPlanet: null,
      isTransitioning: false,
    });
  },

  setQualityLevel: (level: QualityLevel) => {
    set({ qualityLevel: level });
  },
}));
