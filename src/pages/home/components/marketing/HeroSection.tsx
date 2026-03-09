import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Stats } from "../../types";
import { formatUserCount } from "@/utils/numberFormatting";

interface HeroSectionProps {
  stats?: Stats;
}

export const HeroSection = ({ stats }: HeroSectionProps) => {
  const userCount = stats ? formatUserCount(stats.totalUsers) : "150+";
  
  const floatingCards = [
    {
      text: "Saved $500 on textbooks this semester!",
      author: "Sarah M.",
      position: "top-20 left-10",
      rotation: "-rotate-3"
    },
    {
      text: "Coffee Machine",
      price: "$45",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=300",
      position: "top-32 right-16",
      rotation: "rotate-2"
    },
    {
      text: "Dorm Essentials",
      price: "$25",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=300",
      position: "top-40 left-32",
      rotation: "rotate-1"
    },
    {
      text: userCount,
      subtitle: "Happy Students",
      position: "bottom-40 left-8",
      rotation: "rotate-1"
    },
    {
      text: "Everything I need for campus life in one place",
      author: "Alex K.",
      position: "bottom-20 right-12",
      rotation: "-rotate-2"
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating Cards */}
      {floatingCards.map((card, index) => (
        <div
          key={index}
          className={`absolute hidden md:block ${card.position} ${card.rotation} bg-card rounded-lg shadow-lg p-4 max-w-48 z-10`}
        >
          {card.price ? (
            <>
              {card.image && (
                <div className="mb-3">
                  <img
                    src={card.image}
                    alt={card.text}
                    className="w-full h-24 object-cover rounded-md"
                  />
                </div>
              )}
              <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block mb-2">🔥 Hot deal</div>
              <div className="font-semibold text-foreground">{card.text}</div>
              <div className="text-lg font-bold text-foreground">{card.price}</div>
            </>
          ) : card.subtitle ? (
            <>
              <div className="text-2xl font-bold text-gray-900">{card.text}</div>
              <div className="text-gray-600">{card.subtitle}</div>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-900 mb-2">"{card.text}"</div>
              <div className="text-xs text-gray-500">— {card.author}</div>
            </>
          )}
        </div>
      ))}

      {/* Main Content */}
      <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
          Buy and Sell<br />
          Anything<br />
          on Campus
        </h1>

        {/* Get Started Flow */}
        <div className="max-w-md mx-auto">
          <Link to="/auth?mode=signup">
            <Button 
              size="lg" 
              className="w-full h-12 bg-[#003087] hover:bg-[#002266] text-white font-medium"
            >
              Get started
            </Button>
          </Link>
          <p className="text-sm text-gray-600 mt-3">
            Buy and sell with fellow Duke students. Safe, verified and made by Duke students.
          </p>
        </div>


        {/* Stats */}
        <div className="flex items-center justify-center space-x-8 mt-12 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">⭐</span>
            <span>4.9/5 Student Rating</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-500">👥</span>
            <span>{userCount} Students</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">🚚</span>
            <span>Same day delivery and pick up</span>
          </div>
        </div>
      </div>
    </section>
  );
};
