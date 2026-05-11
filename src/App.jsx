import TopNavBar from './components/layout/TopNavBar';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import WebSolutionsSection from './components/sections/WebSolutionsSection';
import SoftwareSection from './components/sections/SoftwareSection';
import InfrastructureSection from './components/sections/InfrastructureSection';
import SupportSection from './components/sections/SupportSection';
import ContactSection from './components/sections/ContactSection';

function isImageTarget(target) {
  return target instanceof HTMLElement && target.closest('img');
}

function preventImageDefault(event) {
  if (isImageTarget(event.target)) {
    event.preventDefault();
  }
}

// Single-page composition: nav, ordered content sections, and footer.
export default function App() {
  return (
    <div onContextMenuCapture={preventImageDefault} onDragStartCapture={preventImageDefault}>
      <TopNavBar />
      <main>
        <HeroSection />
        <WebSolutionsSection />
        <SoftwareSection />
        <InfrastructureSection />
        <SupportSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
