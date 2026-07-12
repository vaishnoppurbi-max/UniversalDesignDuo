import { getContent } from "@/lib/content";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Hero from "./components/Hero";
import Services from "./components/Services";
import StatsBar from "./components/StatsBar";
import AboutSection from "./components/AboutSection";
import WhyChooseUs from "./components/WhyChooseUs";
import CaseStudy from "./components/CaseStudy";
import Testimonials from "./components/Testimonials";
import Clients from "./components/Clients";
import CtaBanner from "./components/CtaBanner";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();

  return (
    <>
      <SiteHeader active="/" />
      <main>
        <Hero hero={content.hero} />
        <Services services={content.services} />
        <StatsBar />
        <AboutSection />
        <WhyChooseUs />
        <CaseStudy />
        <Testimonials testimonials={content.testimonials} />
        <Clients />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
