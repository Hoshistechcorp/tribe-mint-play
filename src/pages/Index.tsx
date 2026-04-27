import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeBar from "@/components/MarqueeBar";
import CampaignsPreview from "@/components/CampaignsPreview";
import HowItWorks from "@/components/HowItWorks";
import ForBusinessesSection from "@/components/ForBusinessesSection";
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
        <CampaignsPreview />
        <HowItWorks />
        <ForBusinessesSection />
        <CTASection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
