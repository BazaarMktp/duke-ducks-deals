import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
          Join 150+ students already saving
        </h2>
        
        <div className="max-w-4xl mx-auto mb-8">
          <blockquote className="text-lg text-muted-foreground italic mb-4">
            "I saved over $800 on textbooks during my first year. The app made buying from other students so easy. 10/10 would recommend!"
          </blockquote>
        </div>

        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 text-warning fill-warning" />
          ))}
        </div>

        <div className="mb-4">
          <p className="font-medium text-foreground">
            "This is a game changer"
          </p>
          <cite className="text-sm text-muted-foreground">
            — Jessica K., Stanford University
          </cite>
        </div>
      </div>
    </section>
  );
};