import { About } from "@/components/site/about";
import { History, News } from "@/components/site/carousels";
import { Calculator } from "@/components/site/calculator";
import { Director } from "@/components/site/director";
import { CookieBar, Cta, Footer, ToTop } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { LeadSection } from "@/components/site/lead-section";
import { Projects } from "@/components/site/projects";
import { Vatan } from "@/components/site/vatan";
import { getNews, getProject, getProjects } from "@/lib/content-source";

export default async function Home() {
  const [projects, news, vatan] = await Promise.all([getProjects(), getNews(), getProject("vatan")]);
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <LeadSection projects={projects} />
        <Projects projects={projects} />
        <About />
        <Director />
        {vatan && <Vatan project={vatan} />}
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
