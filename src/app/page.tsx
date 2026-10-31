import { About } from "@/components/site/about";
import { History, News } from "@/components/site/carousels";
import { Calculator } from "@/components/site/calculator";
import { CookieBar, Cta, Footer, ToTop } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Projects } from "@/components/site/projects";
import { Vatan } from "@/components/site/vatan";
import { getNews, getProjects, getSettings } from "@/lib/content-source";

export default async function Home() {
  const [projects, news, settings] = await Promise.all([getProjects(), getNews(), getSettings()]);
  const featured = projects.find((p) => p.featured);
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Projects projects={projects} />
        <About founder={settings.founder} ceo={settings.ceo} />
        {featured && <Vatan project={featured} />}
        <Calculator />
        <History />
        <News news={news} />
        <Cta />
      </main>
      <Footer />
      <ToTop />
      <CookieBar />
    </>
  );
}
