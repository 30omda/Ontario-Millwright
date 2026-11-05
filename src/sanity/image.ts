import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = projectId
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

/** Build a CDN URL for a Sanity image source; returns null when Sanity is not configured. */
export function urlFor(
  source: Parameters<NonNullable<typeof builder>["image"]>[0],
) {
  return builder ? builder.image(source).auto("format").fit("max") : null;
}
