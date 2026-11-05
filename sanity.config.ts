"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";

const singletons = new Set(["siteSettings", "homePage"]);

export default defineConfig({
  name: "ontario-millwright",
  title: "Ontario Millwright",
  basePath: "/studio",
  projectId: projectId || "missing-project-id",
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem().title("Site settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem().title("Home page").child(S.document().schemaType("homePage").documentId("homePage")),
            S.divider(),
            S.documentTypeListItem("service").title("Services"),
            S.documentTypeListItem("industry").title("Industries"),
            S.documentTypeListItem("project").title("Projects"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
