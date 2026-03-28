import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeBar from "@/components/MarqueeBar";
import HowItWorks from "@/components/HowItWorks";
import EarnBentoGrid from "@/components/EarnBentoGrid";
import ThreeSidesSection from "@/components/ThreeSidesSection";
import TierSection from "@/components/TierSection";
import GiftCardSpotlight from "@/components/GiftCardSpotlight";
import ForBusinessesSection from "@/components/ForBusinessesSection";
import DemoVideoSection from "@/components/DemoVideoSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <MarqueeBar />
        <HowItWorks />
        <EarnBentoGrid />
        <ThreeSidesSection />
        <TierSection />
        <GiftCardSpotlight />
        <ForBusinessesSection />
        <DemoVideoSection />
        <CTASection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
