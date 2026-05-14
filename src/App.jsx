import TopNavBar from './components/layout/TopNavBar';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import WebSolutionsSection from './components/sections/WebSolutionsSection';
import SoftwareSection from './components/sections/SoftwareSection';
import InfrastructureSection from './components/sections/InfrastructureSection';
import SupportSection from './components/sections/SupportSection';
import ContactSection from './components/sections/ContactSection';
import { preventImageDefault, useSectionGridInteractions } from './hooks/useSectionGridInteractions';

export default function App() {
  const { mainRef, sectionCursorRef, mainEventHandlers } = useSectionGridInteractions();

  return (
    <div onContextMenuCapture={preventImageDefault} onDragStartCapture={preventImageDefault}>
      <TopNavBar />
      <main
        ref={mainRef}
        className="site-main-with-section-cursor"
        {...mainEventHandlers}
      >
        <HeroSection />
        <WebSolutionsSection />
        <SoftwareSection />
        <InfrastructureSection />
        <SupportSection />
        <ContactSection />
        <div ref={sectionCursorRef} aria-hidden="true" className="section-cursor-dot" />
      </main>
      <Footer />
    </div>
  );
}
