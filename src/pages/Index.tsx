import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import GamificationSection from "@/components/GamificationSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <GamificationSection />
        <CTASection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
