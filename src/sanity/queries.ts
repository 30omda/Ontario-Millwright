import { defineQuery } from "next-sanity";

const imageProjection = `{
  "src": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

export const SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  name, tagline, phone, email, whatsappNumber, serviceArea, calLink
}`);

export const HOME_QUERY = defineQuery(`{
  "page": *[_id == "homePage"][0]{
    heroHeadline, heroAccent, heroSubcopy, capabilities[]{title, description, highlight},
    "heroVideo": heroVideo.asset->url, "heroPoster": heroPoster.asset->url,
    marqueeRowA, marqueeRowB, servicesIntro, industriesIntro, workIntro, safetyBody, aboutBody
  },
  "services": *[_type == "service"] | order(order asc){
    "id": _id, "slug": slug.current, title, summary, scope, featured, "image": image${imageProjection}
  },
  "industries": *[_type == "industry"] | order(order asc){ "id": _id, title, description },
  "projects": *[_type == "project"] | order(order asc)[0...3]{
    "id": _id, "slug": slug.current, category, title, summary, details[]{label, value}, "image": image${imageProjection}
  }
}`);
