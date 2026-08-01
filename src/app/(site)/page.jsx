import { getContent } from "@/lib/content";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Hero from "./components/Hero";
import BrandStrip from "./components/BrandStrip";
import Services from "./components/Services";
import WorkShowcase from "./components/WorkShowcase";
import Process from "./components/Process";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import Packages from "./components/Packages";
import CtaBanner from "./components/CtaBanner";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  const shots = (content.gallery || []).map((g) => g.image).filter(Boolean);

  return (
    <>
      <SiteHeader active="/" />
      <main>
        <Hero hero={content.hero} shots={shots} />
        <BrandStrip />
        <Services services={content.services} />
        <WorkShowcase projects={content.projects || []} />
        <Process />
        <WhyChooseUs />
        <Testimonials testimonials={content.testimonials} />
        <Packages />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
