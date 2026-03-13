
import { Card, CardContent } from "@/components/ui/card";
import { useColleges } from "@/hooks/useColleges";
import { Users, BookOpen } from "lucide-react";

/** Domains used by platform admin accounts — hide from public college list */
const ADMIN_DOMAINS = ['thebazaarapp.com', 'devilsmarketplace.com'];

export const CollegesSection = () => {
  const { colleges, loading } = useColleges();

  if (loading) {
    return (
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">Loading colleges...</div>
        </div>
      </section>
    );
  }

  const displayColleges = colleges.filter(
    (college) => !ADMIN_DOMAINS.includes(college.domain),
  );

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Partner Colleges</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students across these amazing institutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayColleges.map((college) => (
            <Card key={college.id} className="hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="text-center">
                  {college.image_url && (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                      <img 
                        src={college.image_url} 
                        alt={`${college.name} logo`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        style={{ WebkitTransform: 'translateZ(0)' }}
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {college.name}
                  </h3>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Active Community</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>Verified Students</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
