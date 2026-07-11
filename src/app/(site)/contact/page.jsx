import { getContent } from "@/lib/content";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import Contact from "../components/Contact";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact - Universal Design Duo",
};

export default async function ContactPage() {
  const content = await getContent();

  return (
    <>
      <Header contact={content.contact} active="/contact" />
      <PageBanner title="Contact" />
      <Contact contact={content.contact} />
      <Footer />
    </>
  );
}
