import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Footer() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-brand-blue">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Your campus marketplace<br />awaits
        </h2>
        <p className="text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of students who have made campus shopping easier, 
          cheaper, and more sustainable.
        </p>

        <div className="max-w-md mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Your school email"
              className="bg-white border-0 h-12 flex-1"
            />
            <Button className="bg-white text-primary hover:bg-gray-100 h-12 px-8 font-semibold whitespace-nowrap shadow-lg">
              Get started →
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-white/90">
          <span className="flex items-center gap-2">📱 Mobile friendly</span>
          <span className="flex items-center gap-2">🔒 Safe & secure</span>
          <span className="flex items-center gap-2">📚 Built for students</span>
        </div>
      </div>
    </section>
  );
}