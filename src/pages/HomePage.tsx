import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import RealProblemSection from "@/components/home/RealProblemSection";
import SystemSection from "@/components/home/SystemSection";
import RoomSection from "@/components/home/RoomSection";
import MonthSection from "@/components/home/MonthSection";
import FeeSection from "@/components/home/FeeSection";
import FounderSection from "@/components/home/FounderSection";
import PricingPreviewSection from "@/components/home/PricingPreviewSection";
import FinalCTASection from "@/components/home/FinalCTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <RealProblemSection />
      <SystemSection />
      <RoomSection />
      <MonthSection />
      <FeeSection />
      <FounderSection />
      <PricingPreviewSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
