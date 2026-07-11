import { getContent } from "@/lib/content";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import Blog from "../components/Blog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog - Universal Design Duo",
};

export default async function BlogPage() {
  const content = await getContent();

  return (
    <>
      <Header contact={content.contact} active="/blog" />
      <PageBanner title="Blog" />
      <Blog posts={content.blog} />
      <Footer />
    </>
  );
}
