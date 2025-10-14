
import { ShoppingCart, Users } from "lucide-react";
import { Stats } from "../../types";
import { formatUserCount } from "@/utils/numberFormatting";

interface StatsSectionProps {
  stats: Stats;
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  const statsDisplay = [
    { label: "Students", value: formatUserCount(stats.totalUsers), icon: Users },
    { label: "Active Listings", value: stats.activeListings.toString(), icon: ShoppingCart },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
          {statsDisplay.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                  <stat.icon className="text-blue-600" size={32} />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
