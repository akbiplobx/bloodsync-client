import { ContactUs } from "@/components/contactUs";
import FeaturedDonors from "@/components/FeaturedDonors";

import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      
      <main className="container mx-auto px-4 md:px-8"> 
        <Hero></Hero>    
        <FeaturedDonors></FeaturedDonors>          
      </main>
         
          <ContactUs></ContactUs>
      
    </>
  );
}