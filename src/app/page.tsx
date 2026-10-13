import { About } from "@/components/site/about";
import { History, News } from "@/components/site/carousels";
import { Calculator } from "@/components/site/calculator";
import { CookieBar, Cta, Footer, ToTop } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Projects } from "@/components/site/projects";
import { Vatan } from "@/components/site/vatan";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Projects />
        <About />
        <Vatan />
        <Calculator />
        <History />
        <News />
        <Cta />
      </main>
      <Footer />
      <ToTop />
      <CookieBar />
    </>
  );
}
