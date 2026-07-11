import { getContent } from "@/lib/content";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import Services from "../components/Services";
import Sponsor from "../components/Sponsor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services - Universal Design Duo",
};

export default async function ServicesPage() {
  const content = await getContent();

  return (
    <>
      <Header contact={content.contact} active="/services" />
      <PageBanner title="Service" />
      <Services services={content.services} />
      <Sponsor />
      <Footer />
    </>
  );
}
