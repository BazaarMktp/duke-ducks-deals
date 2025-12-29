import { Search, ShoppingCart, Truck } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      title: "Browse & Search",
      description: "Find textbooks, electronics, supplies, and more by searching our vast student marketplace."
    },
    {
      icon: ShoppingCart,
      title: "Add to Cart",
      description: "Connect directly with student sellers and arrange deals for the best price on campus."
    },
    {
      icon: Truck,
      title: "Choose pickup/delivery",
      description: "Get campus delivery or arrange pickup from students directly on your schedule."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How Duke Students Use Devils Marketplace
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Join hundreds of Blue Devils who trust Devils Marketplace for safe, convenient campus trading. Buy and sell textbooks, electronics, and dorm essentials with fellow Duke students.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-accent rounded-full flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
