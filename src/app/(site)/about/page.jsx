import { getContent } from "@/lib/content";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import About from "../components/About";
import Skill from "../components/Skill";
import Counter from "../components/Counter";
import Testimonials from "../components/Testimonials";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us - Universal Design Duo",
};

export default async function AboutPage() {
  const content = await getContent();

  return (
    <>
      <Header contact={content.contact} active="/about" />
      <PageBanner title="About Us" />
      <div className="pt-120">
        <About />
      </div>
      <Skill />
      <Counter />
      <Testimonials testimonials={content.testimonials} />
      <Footer />
    </>
  );
}
