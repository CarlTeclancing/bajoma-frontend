// Storage configuration for authentication
// Controls whether tabs share sessions (localStorage) or are isolated (sessionStorage)

const isDevelopment = process.env.NODE_ENV === 'development';

// Change this to switch between modes:
// 'session' = Tab-isolated (each tab can have different user)
// 'local' = Tab-shared (all tabs show same user)
const STORAGE_MODE = isDevelopment ? 'session' : 'local';

// Use sessionStorage for development (isolated tabs) or localStorage for production (shared tabs)
export const authStorage = STORAGE_MODE === 'session' ? sessionStorage : localStorage;

// Enable cross-tab sync only in production mode
export const ENABLE_CROSS_TAB_SYNC = STORAGE_MODE === 'local';

export const storageConfig = {
  mode: STORAGE_MODE,
  storage: authStorage,
  enableCrossTabSync: ENABLE_CROSS_TAB_SYNC
};
