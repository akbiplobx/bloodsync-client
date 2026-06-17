import FeaturedPets from "@/components/FeaturedPets";
import { FosterBanner } from "@/components/FosterBanner";
import Hero from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";

export default function Home() {
  return (
    <>
      
      <main className="container mx-auto px-4 md:px-8"> 
        <Hero></Hero>    
        <FeaturedPets></FeaturedPets>          
      </main>
          <HowItWorks />
          
      <FosterBanner />
    </>
  );
}