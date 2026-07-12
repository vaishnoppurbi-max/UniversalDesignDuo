import { getContent } from "@/lib/content";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import AboutSection from "../components/AboutSection";
import WhyChooseUs from "../components/WhyChooseUs";
import StatsBar from "../components/StatsBar";
import Testimonials from "../components/Testimonials";
import CtaBanner from "../components/CtaBanner";

export const dynamic = "force-dynamic";
export const metadata = { title: "About Us - Universal Design Duo" };

export default async function AboutPage() {
  const content = await getContent();
  return (
    <>
      <SiteHeader active="/about" />
      <main>
        <PageHero title="About Us" />
        <AboutSection />
        <div style={{ paddingBottom: 40 }}>
          <StatsBar />
        </div>
        <WhyChooseUs />
        <Testimonials testimonials={content.testimonials} />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
