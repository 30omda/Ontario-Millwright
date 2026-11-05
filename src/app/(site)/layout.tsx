import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CalProvider } from "@/components/providers/cal-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { getHomeContent, getSettings } from "@/content/get-content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, home] = await Promise.all([getSettings(), getHomeContent()]);
  return (
    <LenisProvider>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-yellow-500 px-4 py-2 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <CalProvider enabled={Boolean(settings.calLink)} />
      <div className="bg-blueprint min-h-svh overflow-x-clip">
        <Navbar
          name={settings.name}
          phone={settings.phone}
          phoneHref={settings.phoneHref}
          calLink={settings.calLink}
        />
        <main id="main">{children}</main>
        <Footer settings={settings} services={home.services.items} />
      </div>
      <Toaster position="bottom-center" richColors closeButton />
    </LenisProvider>
  );
}
