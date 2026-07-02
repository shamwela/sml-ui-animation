/** The preloader always shows at least this long, so fast loads still get the branded moment. */
export const MIN_PRELOAD_MS = 1800

/** Hard timeout: if assets hang (slow network, decode failure) the page reveals anyway. */
export const MAX_PRELOAD_MS = 6000

/** Number of hero images whose load the preloader progress tracks. */
export const TRACKED_ASSET_COUNT = 5

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
export const DESKTOP_QUERY = '(min-width: 1024px)'
export const BELOW_DESKTOP_QUERY = '(max-width: 1023px)'
