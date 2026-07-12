import { getContent } from "@/lib/content";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import Gallery from "../components/Gallery";
import CtaBanner from "../components/CtaBanner";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gallery - Universal Design Duo" };

export default async function GalleryPage() {
  const content = await getContent();
  return (
    <>
      <SiteHeader active="/gallery" />
      <main>
        <PageHero title="Gallery" />
        <Gallery items={content.gallery || []} />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
