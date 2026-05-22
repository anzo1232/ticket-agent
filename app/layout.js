import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Ticket Agent",
  description: "Football ticket operations platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex" style={{ background: "#0f1117", color: "#f1f5f9" }}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto" style={{ minWidth: 0 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
