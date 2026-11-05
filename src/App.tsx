import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Path } from "./components/Path";
import { Research } from "./components/Research";
import { Work } from "./components/Work";

export default function App() {
  return (
    <div className="min-h-svh bg-void font-body text-ink antialiased">
      <Header />
      <main>
        <Hero />
        <Work />
        <Research />
        <Path />
      </main>
    </div>
  );
}
