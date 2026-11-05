import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Craft } from "./components/Craft";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Path } from "./components/Path";
import { Research } from "./components/Research";
import { Work } from "./components/Work";

export default function App() {
  return (
    <div className="min-h-svh bg-void font-body text-ink antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-signal focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Work />
        <Research />
        <Path />
        <Craft />
        <Contact />
      </main>
    </div>
  );
}
