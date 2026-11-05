import { Header } from "./components/Header";
import { Hero } from "./components/Hero";

export default function App() {
  return (
    <div className="min-h-svh bg-void font-body text-ink antialiased">
      <Header />
      <main>
        <Hero />
      </main>
    </div>
  );
}
