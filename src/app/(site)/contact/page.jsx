import { getContent } from "@/lib/content";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import Contact from "../components/Contact";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact - Universal Design Duo" };

export default async function ContactPage() {
  const content = await getContent();
  return (
    <>
      <SiteHeader active="/contact" />
      <main>
        <PageHero title="Contact" />
        <Contact contact={content.contact} />
      </main>
      <SiteFooter />
    </>
  );
}
