import React from "react";
// Removed CardBody as it doesn't exist in HeroUI
import { Card, CardHeader, CardFooter, Button } from "@heroui/react";
import { Activity, ShieldCheck, Zap, Heart, Clock, HelpCircle } from "lucide-react";

export default function FeaturedSection() {
  const features = [
    {
      title: "How It Works",
      description: "Create an account, select your blood group, and find donors near your location or start donating blood seamlessly.",
      icon: <HelpCircle className="text-danger" size={24} />,
      buttonText: "Learn More",
    },
    {
      title: "Why Donate Blood",
      description: "Your single donation can save up to three lives. It is safe, simple, and highly beneficial for your own cardiovascular health.",
      icon: <Heart className="text-danger" size={24} />,
      buttonText: "View Benefits",
    },
    {
      title: "Emergency Support",
      description: "In case of urgent requirements, access our 24/7 support system and send real-time emergency alerts to nearby available donors.",
      icon: <Activity className="text-danger" size={24} />,
      buttonText: "Get Help",
    },
    {
      title: "Verified Donors",
      description: "Every donor profile on our platform undergoes a strict verification and screening process to ensure maximum safety.",
      icon: <ShieldCheck className="text-danger" size={24} />,
      buttonText: "Find Donors",
    },
    {
      title: "Quick Response",
      description: "Our smart notification system bridges the gap between recipients and donors instantly, reducing wait times drastically.",
      icon: <Zap className="text-danger" size={24} />,
      buttonText: "Live Requests",
    },
    {
      title: "Donation Process",
      description: "We guide you through every step: from registration, health screening, and blood donation to your post-donation recovery.",
      icon: <Clock className="text-danger" size={24} />,
      buttonText: "See Process",
    },
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          Our Core Features
        </h2>
        <p className="mt-4 text-large text-default-500 max-w-2xl mx-auto">
          BloodSync makes blood donation and requests simple, secure, and lightning-fast.
        </p>
      </div>

      {/* Grid Layout for uniform spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          /* 
            'h-full flex flex-col justify-between' ensures all cards 
            have equal height and footer alignment stays correct.
          */
          <Card 
            key={index} 
            className="p-4 border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-md h-full flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300"
            
          >
            {/* Card Header */}
            <CardHeader className="flex gap-3 items-center pb-2">
              <div className="p-3 bg-danger-50 dark:bg-danger-900/20 rounded-xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
            </CardHeader>
            
            {/* 
              Standard paragraph with 'flex-grow' to absorb empty space 
              and maintain equal card height alignment.
            */}
            <p className="px-3 py-2 text-default-500 text-sm leading-relaxed flex-grow">
              {feature.description}
            </p>
            
            {/* Card Footer */}
            <CardFooter className="pt-4">
              <Button 
                color="danger" 
                variant="flat" 
                className="w-full font-medium"
              >
                {feature.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}