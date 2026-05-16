import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import RealProblemSection from "@/components/home/RealProblemSection";
import SystemSection from "@/components/home/SystemSection";
import RoomSection from "@/components/home/RoomSection";
import MonthSection from "@/components/home/MonthSection";
import FeeSection from "@/components/home/FeeSection";
import ResetCallSection from "@/components/home/ResetCallSection";
import FounderSection from "@/components/home/FounderSection";
import PricingPreviewSection from "@/components/home/PricingPreviewSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import PersonalizedFeedbackSection from "@/components/home/PersonalizedFeedbackSection";
import WhoThisIsForSection from "@/components/home/WhoThisIsForSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <RealProblemSection />
      <FounderSection />
      <SystemSection />
      <PersonalizedFeedbackSection />
      <RoomSection />
      <MonthSection />
      <FeeSection />
      <ResetCallSection />
      <WhoThisIsForSection />
      <PricingPreviewSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
