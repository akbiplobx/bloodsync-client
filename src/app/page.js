import { ContactUs } from "@/components/contactUs";
import FeaturedDonors from "@/components/FeaturedDonors";
import FeaturedSection from "@/components/FeaturedSection";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";

export const metadata = {
  title: "BloodSync - Blood Donation Platform", 
  description: "A full-stack Blood Donation Platform to explore, request, and manage emergency blood requests.",
};

export default function Home() {
  return (
    <>
      <main className="container mx-auto px-4 md:px-8"> 
        <Hero />    
        <StatsSection></StatsSection>    
        <FeaturedDonors /> 
        <FeaturedSection />  
      </main>
         
      <ContactUs />
    </>
  );
}