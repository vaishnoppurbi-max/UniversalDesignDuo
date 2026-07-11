import { getContent } from "@/lib/content";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Sponsor from "./components/Sponsor";
import About from "./components/About";
import Skill from "./components/Skill";
import Counter from "./components/Counter";
import Testimonials from "./components/Testimonials";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();

  return (
    <>
      <Header contact={content.contact} active="/" />
      <Hero hero={content.hero} />
      <Services services={content.services} />
      <Sponsor />
      <About />
      <Skill />
      <Counter />
      <Testimonials testimonials={content.testimonials} />
      <Footer />
    </>
  );
}
