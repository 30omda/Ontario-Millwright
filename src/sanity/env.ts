export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
/** True once the client's Sanity project is connected (.env). Until then the site renders seed content. */
export const isSanityConfigured = projectId.length > 0;
