export type Img = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  scope: string[];
  image: Img;
  featured?: boolean;
};

export type Industry = { id: string; title: string; description: string };

export type ProcessStep = { id: string; title: string; description: string };

export type Project = {
  id: string;
  slug: string;
  category: string;
  title: string;
  summary: string;
  image: Img;
  details: Array<{ label: string; value: string }>;
};

export type Capability = {
  title: string;
  description: string;
  highlight?: boolean;
};

export type SiteSettings = {
  name: string;
  tagline: string;
  phone: string;
  phoneHref: string;
  email: string;
  /** null until the client confirms the number */
  whatsappNumber: string | null;
  serviceArea: string;
  calLink: string;
};

export type HomeContent = {
  hero: {
    headline: string;
    accent: string;
    subcopy: string;
    capabilities: Capability[];
    video: { mp4_1080: string; mp4_720: string; webm: string; poster: string };
  };
  marquee: { rowA: string[]; rowB: string[] };
  services: { title: string; accent: string; intro: string; items: Service[] };
  industries: {
    title: string;
    accent: string;
    intro: string;
    items: Industry[];
  };
  process: {
    title: string;
    accent: string;
    titleEnd: string;
    steps: ProcessStep[];
  };
  work: { title: string; accent: string; intro: string; items: Project[] };
  safety: {
    title: string;
    accent: string;
    body: string;
    image: Img;
    checklistTitle: string;
    checklistNote: string;
    checklist: Array<{ title: string; description: string }>;
  };
  about: {
    title: string;
    accent: string;
    quoteLead: string;
    quoteRest: string;
    body: string;
    image: Img;
  };
  quote: { titleLead: string; accent: string; image: Img };
};
