export const SCENE_KEYS = Object.freeze({
  BOOT: 'Boot',
  MENU: 'Menu',
  GAME: 'Game',
  PAUSE: 'Pause',
});

export const TEXTURES = Object.freeze({
  BACKGROUND: 'placeholder-background',
  FOOD: 'placeholder-food',
  MOJARRITA: 'placeholder-mojarrita',
  SURUBI: 'placeholder-surubi',
  PAUSE: 'placeholder-pause',
});

export const TOOL_KEYS = Object.freeze({
  FOOD: 'food',
  MOJARRITA: 'mojarrita',
  SURUBI: 'surubi',
});

export const SPECIES = Object.freeze({
  MOJARRITA: 'mojarrita',
  SURUBI: 'surubi',
  DIENTUDO: 'dientudo',
});

export const GROWTH_STAGES = Object.freeze({
  LARV: 'larva',
  JUVENILE: 'juvenile',
  ADULT: 'adult',
  OLD: 'old',
});

export const FISH_RULES = Object.freeze({
  SCALE: Object.freeze({ MIN: 0.7, MAX: 1.3 }),
  INSTINCT: Object.freeze({ MIN: 2, MAX: 8 }),
  DISPLAY_WIDTH: Object.freeze({
    [SPECIES.MOJARRITA]: 84,
    [SPECIES.SURUBI]: 126,
  }),
  DISPLAY_HEIGHT_RATIO: 0.5,
  MAX_DISPLAY_WIDTH_RATIO: 0.2,
  INITIAL_DISPLAY_WIDTH_RATIO: 0.14,
  INITIAL_DISPLAY_WIDTH_MIN: 90,
  INITIAL_DISPLAY_WIDTH_MAX: 180,
  DEPTH: 10,
});

export const FISH_BY_TOOL = Object.freeze({
  [TOOL_KEYS.MOJARRITA]: SPECIES.MOJARRITA,
  [TOOL_KEYS.SURUBI]: SPECIES.SURUBI,
});

export const FISH_TEXTURE = Object.freeze({
  [SPECIES.MOJARRITA]: TEXTURES.MOJARRITA,
  [SPECIES.SURUBI]: TEXTURES.SURUBI,
});

export const ECONOMY = Object.freeze({
  INITIAL_BALANCE: 100,
  COSTS: Object.freeze({
    [TOOL_KEYS.FOOD]: 2,
    [TOOL_KEYS.MOJARRITA]: 5,
    [TOOL_KEYS.SURUBI]: 20,
  }),
});

export const FOOD_RULES = Object.freeze({
  RADIUS: 9,
  FALL_SPEED: 70,
  REST_DURATION: 4000,
  BOTTOM_PADDING: 4,
});

export const HUD_HEIGHT_RATIO = 0.2;
