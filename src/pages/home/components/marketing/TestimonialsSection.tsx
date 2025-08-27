import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12">
              Join 150+ students already saving
            </h2>
            
            <blockquote className="text-lg text-muted-foreground mb-6">
              "I saved over $800 on textbooks during my first year. The app made buying from other students so easy. 10/10 would recommend!"
            </blockquote>

            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>

            <div className="mb-4">
              <p className="font-medium text-foreground">
                "This is a game changer"
              </p>
              <cite className="text-muted-foreground">
                — Jessica K., Duke University
              </cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};