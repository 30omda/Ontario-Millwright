import type { HomeContent, SiteSettings } from "./types";

/**
 * Seed content copied from the approved Direction B canvas.
 * Used as the fallback when Sanity is not configured, and as the import source for the dataset.
 * Rule: no invented facts. Unknowns stay null / [TBC].
 */
export const seedSettings: SiteSettings = {
  name: "Ontario Millwright",
  tagline: "One accountable crew from survey to start-up, serving plants across Ontario.",
  phone: "(416) 895-3704",
  phoneHref: "tel:+14168953704",
  phone2: "(647) 797-7658",
  phone2Href: "tel:+16477977658",
  email: "ontariomillwright@gmail.com",
  whatsappNumber: "14168953704",
  serviceArea: "All of Ontario, Canada",
  calLink: "",
};

const img = (src: string, alt: string, width: number, height: number) => ({
  src,
  alt,
  width,
  height,
});

export const seedHome: HomeContent = {
  hero: {
    headline: "ONTARIO",
    accent: "Millwright Services",
    subcopy:
      "We install, move, align, and maintain the machinery Ontario's production depends on, from single-machine changeouts to full plant relocations, done safely and on schedule.",
    capabilities: [
      {
        title: "Plant Relocations",
        description: "Full lines moved, set & reinstalled",
      },
      {
        title: "Precision Work",
        description: "Laser alignment & optical leveling",
      },
      {
        title: "Emergency Support",
        description: "Breakdown & outage response crews",
      },
      {
        title: "Safety-Led",
        description: "Written plan for every job, every shift",
        highlight: true,
      },
    ],
    video: {
      mp4_1080: "/media/hero-gears-1080.mp4",
      mp4_720: "/media/hero-gears-720.mp4",
      webm: "/media/hero-gears-1080.webm",
      poster: "/media/hero-gears-poster.jpg",
    },
  },
  marquee: {
    rowA: ["Installation", "Precision Alignment", "Maintenance", "Welding & Fabrication", "Rebuilds"],
    rowB: ["Manufacturing", "Food & Beverage", "Pulp & Paper", "Mining & Metals", "Power Generation", "Automotive"],
  },
  services: {
    title: "Millwright",
    accent: "services",
    intro:
      "Five core trades under one roof, so one crew takes your equipment from the truck bed to full production. Every card carries its real scope of work.",
    items: [
      {
        id: "installation",
        slug: "machinery-installation-relocation",
        title: "Machinery Installation & Relocation",
        summary:
          "From a single press to an entire plant, we receive, uncrate, set, level, and connect your equipment so it is ready for your electricians and start-up team. For relocations we document, dismantle, transport, and rebuild lines in their new home, in the same order they came apart.",
        description:
          "From a single press to an entire plant, we receive, uncrate, set, level, and connect your equipment so it is ready for your electricians and start-up team. For relocations we document, dismantle, transport, and rebuild lines in their new home, in the same order they came apart.",
        fullScope: [
          "Equipment receiving & uncrating",
          "Foundation & sole plate setting",
          "Complete plant relocations",
          "Production line installation",
          "Conveyor & sortation systems",
          "Anchor, grout & level to spec",
        ],
        scope: [
          "Equipment receiving & uncrating",
          "Foundation & sole plate setting",
          "Complete plant relocations",
          "Production line installation",
          "Conveyor & sortation systems",
          "Anchor, grout & level to spec",
        ],
        image: img("/media/conveyor-system.jpg", "Bottling line with conveyors in a plant", 999, 750),
        featured: true,
      },
      {
        id: "alignment",
        slug: "precision-alignment-leveling",
        title: "Precision Alignment & Leveling",
        summary: "Rotating equipment brought back to OEM tolerance and documented with before-and-after reports.",
        description:
          "Misalignment is the silent killer of bearings, seals, and couplings. Our alignment specialists bring rotating equipment back to OEM tolerance and document it with before-and-after reports your reliability team can file.",
        fullScope: [
          "Laser shaft alignment",
          "Bore & coupling alignment",
          "Optical & laser leveling",
          "Baseplate flatness checks",
          "Soft-foot correction",
          "Thermal growth compensation",
        ],
        scope: [
          "Laser shaft alignment",
          "Optical & laser leveling",
          "Soft-foot correction",
          "Thermal growth compensation",
        ],
        image: img("/media/motor-rotor-flange.jpg", "Coupling flange on a large rotor shaft", 605, 520),
      },
      {
        id: "maintenance",
        slug: "maintenance-repair",
        title: "Maintenance & Repair",
        summary: "Scheduled PM routes, full outage labor, and emergency callout crews.",
        description:
          "Planned or unplanned, we keep equipment alive: scheduled PM routes, full outage labor for your turnaround, and emergency callout crews who show up with the tools and parts discipline to get you running again.",
        fullScope: [
          "Preventive maintenance programs",
          "Shutdown & outage labor",
          "Emergency breakdown repair",
          "Bearing & seal replacement",
          "Gearbox inspection & service",
          "Conveyor belt & drive service",
        ],
        scope: [
          "Preventive maintenance",
          "Shutdown & outage labor",
          "Emergency breakdown repair",
          "Bearing & seal replacement",
        ],
        image: img("/media/machine-shaft.jpg", "Belt drive, pulleys and shafts on a machine", 1128, 750),
      },
      {
        id: "rebuilds",
        slug: "equipment-rebuilds-overhauls",
        title: "Equipment Rebuilds & Overhauls",
        summary: "Stripped to the case, every wear surface measured, returned with a full inspection report.",
        description:
          "A rebuild done right costs a fraction of replacement and skips the lead time. We strip equipment to the case, measure every wear surface, replace what's worn, and return it with a full inspection report.",
        fullScope: [
          "Gearbox rebuilds",
          "Pump & compressor overhauls",
          "Motor bearing replacement",
          "Wear measurement & reporting",
          "Shaft & housing repair",
          "Run testing & documentation",
        ],
        scope: [
          "Gearbox rebuilds",
          "Pump & compressor overhauls",
          "Wear measurement & reporting",
          "Run testing & documentation",
        ],
        image: img("/media/disassembled-engine.jpg", "Cutaway of a gearbox showing gears and impeller", 1000, 750),
      },
      {
        id: "welding",
        slug: "welding-fabrication",
        title: "Welding & Fabrication",
        summary:
          "Platforms, mezzanines, machine guards, chutes, and structural supports, built to print or to field measurement.",
        description:
          "When the part doesn't exist, we build it. Our welders and fabricators produce platforms, mezzanines, machine guards, chutes, and structural supports to print or to field measurement.",
        fullScope: [
          "Structural steel fabrication",
          "Platforms, stairs & handrail",
          "Machine guarding",
          "Chutes, hoppers & transitions",
          "Certified structural welding",
          "Field modification & repair",
        ],
        scope: ["Structural steel", "Platforms, stairs & handrail", "Machine guarding", "Certified structural welding"],
        image: img("/media/grinder-sparks.jpg", "Sparks across a workshop floor", 477, 570),
      },
    ],
  },
  industries: {
    title: "Industries",
    accent: "served",
    intro:
      "Our crews work inside live plants across Ontario every week. We plan around your production windows: nights, weekends, and planned shutdowns.",
    items: [
      {
        id: "manufacturing",
        title: "Manufacturing",
        description: "Presses, CNC lines, assembly equipment",
      },
      {
        id: "food",
        title: "Food & Beverage",
        description: "Sanitary installs, packaging lines",
      },
      {
        id: "pulp",
        title: "Pulp & Paper",
        description: "Paper machines, winders, outage work",
      },
      {
        id: "mining",
        title: "Mining & Metals",
        description: "Mills, crushers, conveyors, furnaces",
      },
      {
        id: "power",
        title: "Power Generation",
        description: "Turbines, generators, balance of plant",
      },
      {
        id: "automotive",
        title: "Automotive",
        description: "Stamping, transfer lines, robotic cells",
      },
      {
        id: "warehousing",
        title: "Warehousing & Logistics",
        description: "Sortation, conveyors, racking systems",
      },
      {
        id: "chemical",
        title: "Chemical & Process",
        description: "Vessels, exchangers, process piping",
      },
    ],
  },
  process: {
    title: "From survey",
    accent: "to",
    titleEnd: "start-up",
    steps: [
      {
        id: "survey",
        title: "Survey & Plan",
        description:
          "We walk the site, verify weights, dimensions, and access, then plan the move and installation before a single bolt turns.",
      },
      {
        id: "move",
        title: "Move & Position",
        description: "Experienced crews move equipment in, out, or across the plant and position it ready for setting.",
      },
      {
        id: "align",
        title: "Set & Align",
        description:
          "Machines are set on sole plates or new foundations, grouted, leveled, and laser-aligned to OEM specification.",
      },
      {
        id: "commission",
        title: "Commission & Support",
        description:
          "We support start-up and testing, hand over alignment reports, and stay on call with preventive maintenance programs.",
      },
    ],
  },
  work: {
    title: "Recent",
    accent: "work",
    intro:
      "Examples of the work our crews do: equipment changeouts, precision overhauls, and production-line installs.",
    items: [
      // Hidden for now (uncomment to show the card again):
      // {
      //   id: "pressure-vessel",
      //   slug: "pressure-vessel-changeout",
      //   category: "Pressure equipment",
      //   title: "Pressure Vessel Changeout",
      //   summary:
      //     "Removing a spent reactor vessel and setting its replacement at a process plant: removal, transport, setting, and re-piping support inside a planned shutdown window.",
      //   image: img("/media/motor-rotor.jpg", "Heavy rotor on stands ready for setting", 1125, 750),
      //   details: [
      //     { label: "Scope", value: "Vessel swap & re-piping" },
      //     { label: "Setting", value: "Planned shutdown" },
      //   ],
      // },
      {
        id: "conveyor",
        slug: "distribution-conveyor-install",
        category: "Conveyors",
        title: "Distribution Conveyor Install",
        summary:
          "Full mechanical installation of a conveyor system in a new distribution facility: belt and roller conveyor, drives, and platforms, set and aligned to spec.",
        image: img("/media/distribution-conveyor.jpg", "Conveyor system in a new distribution facility", 607, 332),
        details: [
          { label: "Scope", value: "Full mechanical install" },
          { label: "Systems", value: "Conveyor & drives" },
        ],
      },
      {
        id: "gearbox",
        slug: "mill-outage-gearbox-rebuild",
        category: "Outage support",
        title: "Mill Outage & Gearbox Rebuild",
        summary:
          "Planned outage support for a metals mill: main drive gearbox removed, rebuilt with new bearings and seals, reinstalled, and laser-aligned to specification.",
        image: img("/media/disassembled-engine.jpg", "Gearbox cutaway showing gears", 1000, 750),
        details: [
          { label: "Scope", value: "Gearbox rebuild" },
          { label: "Finish", value: "Laser-aligned to spec" },
        ],
      },
    ],
  },
  safety: {
    title: "No job is worth",
    accent: "an injury.",
    body: "Every job starts with a plan and a hazard review, and anyone on our crew can stop work the moment something looks wrong. That discipline is why plant managers hand us their most critical work.",
    image: img("/media/grinder-sparks.jpg", "Sparks flying from an angle grinder cutting steel", 477, 570),
    checklistTitle: "Pre-job checklist",
    checklistNote: "Every job · Every shift",
    checklist: [
      {
        title: "Written job plans",
        description: "Hazard reviewed and signed off before work starts.",
      },
      {
        title: "Trained people",
        description: "Qualified millwrights, experienced supervision on site.",
      },
      {
        title: "Daily toolbox talks",
        description: "Job hazard analysis with the whole crew each shift.",
      },
      {
        title: "Lockout / tagout",
        description: "Energy isolation verified before work begins.",
      },
    ],
  },
  about: {
    title: "Millwrights by trade.",
    accent: "Partners by practice.",
    quoteLead: "“Measure twice, set it right,",
    quoteRest: "and leave the equipment better than we found it.”",
    body: "A millwright is the tradesperson who makes industrial machinery work: reading the drawings, setting the machine, aligning the shafts, and keeping it all running for decades. Today our crews support plants of every size across Ontario with installation projects, shutdown and outage labor, and ongoing maintenance contracts.",
    image: img("/media/conveyor-system.jpg", "Bottling plant with conveyors and process equipment", 999, 750),
  },
  quote: {
    titleLead: "Tell us about the machine.",
    accent: "We'll take it from there.",
    image: img("/media/motor-rotor-flange.jpg", "Coupling flange on a large rotor shaft in a workshop", 605, 520),
  },
};
