import { getContent } from "@/lib/content";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import Portfolio from "../components/Portfolio";
import CtaBanner from "../components/CtaBanner";

export const dynamic = "force-dynamic";
export const metadata = { title: "Portfolio - Universal Design Duo" };

export default async function PortfolioPage() {
  const content = await getContent();
  return (
    <>
      <SiteHeader active="/portfolio" />
      <main>
        <PageHero title="Portfolio" />
        <Portfolio projects={content.projects} />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
