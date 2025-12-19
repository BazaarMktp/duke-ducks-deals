
import { Stats } from "../types";
import { formatUserCount } from "@/utils/numberFormatting";

interface StatsSectionProps {
  stats: Stats;
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  const statsDisplay = [
    { label: "Students", value: formatUserCount(stats.totalUsers) },
    { label: "Active Listings", value: stats.activeListings.toString() },
  ];

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Bazaar Stats</h2>
        <div className="grid grid-cols-2 gap-8">
          {statsDisplay.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
