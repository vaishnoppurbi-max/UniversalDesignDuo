import { getContent } from "@/lib/content";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";
import CtaBanner from "../components/CtaBanner";

export const dynamic = "force-dynamic";
export const metadata = { title: "Services - Universal Design Duo" };

export default async function ServicesPage() {
  const content = await getContent();
  return (
    <>
      <SiteHeader active="/services" />
      <main>
        <PageHero title="Services" crumb="Services" />
        <Services services={content.services} />
        <WhyChooseUs />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
