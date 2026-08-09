import { getContent } from "@/lib/content";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import PageHero from "../components/PageHero";
import GalleryFilter from "../components/GalleryFilter";
import CtaBanner from "../components/CtaBanner";

export const dynamic = "force-dynamic";
export const metadata = { title: "Portfolio - Universal Design Duo" };

export default async function PortfolioPage() {
  const content = await getContent();

  // Merge Portfolio projects + Gallery images into one filterable set so the
  // Portfolio page has a single, unified category filter (Gallery-style).
  const projectItems = (content.projects || []).map((p) => ({
    image: p.image,
    caption: p.title || "",
    category: (p.category || "").trim() || "Projects",
  }));
  const galleryItems = (content.gallery || []).map((g) => ({
    image: g.image,
    caption: g.caption || "",
    category: (g.category || "").trim() || "Gallery",
  }));

  const items = [...projectItems, ...galleryItems].filter((i) => i.image);

  return (
    <>
      <SiteHeader active="/portfolio" />
      <main>
        <PageHero title="Portfolio" />
        <GalleryFilter items={items} heading={true} layout="pills" />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
