import "../globals.css";

export default function StudioLayout({ children }: LayoutProps<"/studio">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
