import { describe, expect, it } from "vitest";
import { buildInquiryMessage, buildWhatsAppUrl, MAX_DETAILS } from "./whatsapp";

const base = { name: " Ana ", email: "ana@x.ca", service: "Welding (welding)", details: "Need a platform & guard #2" };

describe("buildWhatsAppUrl", () => {
  it("uses the company number", () => {
    expect(buildWhatsAppUrl("14168953704")).toBe("https://wa.me/14168953704");
  });
  it("strips formatting from the number", () => {
    expect(buildWhatsAppUrl("+1 (416) 895-3704")).toBe("https://wa.me/14168953704");
  });
  it("returns null without a number", () => {
    expect(buildWhatsAppUrl(null, "hi")).toBeNull();
    expect(buildWhatsAppUrl("", "hi")).toBeNull();
  });
  it("encodes spaces, newlines, & and #", () => {
    const url = buildWhatsAppUrl("14168953704", "a b\n&c #d")!;
    expect(url).toBe("https://wa.me/14168953704?text=a%20b%0A%26c%20%23d");
  });
  it("round-trips accents and Chinese", () => {
    const msg = "Mécanique 机械安装";
    const url = new URL(buildWhatsAppUrl("14168953704", msg)!);
    expect(url.searchParams.get("text")).toBe(msg);
  });
});

describe("buildInquiryMessage", () => {
  it("contains every field and the template headings", () => {
    const m = buildInquiryMessage({ ...base, phone: "416-000-0000" });
    for (const s of ["NEW WEBSITE INQUIRY", "CUSTOMER DETAILS", "Name: Ana", "Email: ana@x.ca", "Phone: 416-000-0000", "SERVICE REQUIRED", "Welding (welding)", "PROJECT DETAILS", "Need a platform & guard #2", "Source: Ontario Millwright Website"])
      expect(m).toContain(s);
  });
  it("never prints undefined or null for optional fields", () => {
    const m = buildInquiryMessage({ ...base, phone: undefined });
    expect(m).toContain("Phone: -");
    expect(m).not.toMatch(/undefined|null/);
  });
  it("mentions attachments only when present", () => {
    expect(buildInquiryMessage(base)).not.toContain("Attachments");
    expect(buildInquiryMessage({ ...base, hasAttachments: true })).toContain("Attachments: sent by email");
  });
  it("truncates long details so the URL stays bounded", () => {
    const m = buildInquiryMessage({ ...base, details: "机".repeat(4000) });
    expect(m).toContain("(full details sent by email)");
    expect(buildWhatsAppUrl("14168953704", m)!.length).toBeLessThan(MAX_DETAILS * 9 + 1500);
  });
});
