import { getContent } from "@/lib/content";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import Portfolio from "../components/Portfolio";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio - Universal Design Duo",
};

export default async function PortfolioPage() {
  const content = await getContent();

  return (
    <>
      <Header contact={content.contact} active="/portfolio" />
      <PageBanner title="Portfolio" />
      <Portfolio projects={content.projects} />
      <Footer />
    </>
  );
}
