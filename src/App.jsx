import TopNavBar from './components/layout/TopNavBar';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import WebSolutionsSection from './components/sections/WebSolutionsSection';
import AutomationSection from './components/sections/AutomationSection';
import InfrastructureSection from './components/sections/InfrastructureSection';
import SupportSection from './components/sections/SupportSection';
import ContactSection from './components/sections/ContactSection';

export default function App() {
  return (
    <>
      <TopNavBar />
      <main>
        <HeroSection />
        <WebSolutionsSection />
        <AutomationSection />
        <InfrastructureSection />
        <SupportSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
