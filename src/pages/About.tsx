
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Eye, Heart } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "William Peña",
      role: "Founder/Head of Technology",
      bio: "Industrial Engineer with UX/UI design and backend development experience, passionate about creating seamless student experiences.",
      image: "/lovable-uploads/d967c344-819e-48c1-8f23-516a1a026c15.png"
    },
    {
      name: "Ann Marie",
      role: "Head of Outreach and Co-strategy", 
      bio: "Strategic visionary focused on building sustainable growth and fostering campus community connections.",
      image: "/lovable-uploads/c27bc51c-5c07-4177-a329-76cd00fa654d.png"
    },
    {
      name: "Sumeet Batra",
      role: "Growth Operations",
      bio: "Product strategist dedicated to understanding student needs and delivering innovative platform solutions.",
      image: "/lovable-uploads/85b6ff7a-14e6-43e9-9cd1-5d12eedf92ce.png"
    },
    {
      name: "Sathvika Gandavarapu",
      role: "Head of Marketing and Co-strategy",
      bio: "Marketing specialist building brand awareness and connecting with student communities across campuses.",
      image: "/lovable-uploads/4c18aff2-be8d-4a27-899a-8b311b78164b.png"
    },
    {
      name: "Namisha Metha",
      role: "Product Development",
      bio: "Design expert focused on creating intuitive and beautiful user experiences that enhance student engagement and platform usability.",
      image: "/lovable-uploads/namisha-headshot.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Bazaar</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Connecting students, building community, and making campus life easier through 
            our comprehensive marketplace platform.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-blue-600" size={32} />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  To create a vibrant, trusted marketplace that connects students, 
                  facilitates the sharing of resources, and builds a stronger campus community 
                  where everyone can thrive.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="text-purple-600" size={32} />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  To be the go-to platform for every student's needs, fostering sustainability, 
                  affordability, and community connection across campuses nationwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bazaar is your one-stop platform for all campus needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Marketplace</h3>
              <p className="text-gray-600">Buy and sell textbooks, electronics, furniture, and more</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Housing</h3>
              <p className="text-gray-600">Find roommates, sublets, and housing options</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Services</h3>
              <p className="text-gray-600">Offer or find tutoring, moving help, and other services</p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Donations</h3>
              <p className="text-gray-600">Give back to the community through charitable donations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              Built by students, for students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Community First</h3>
              <p className="text-gray-600">
                We prioritize building genuine connections and fostering a supportive environment 
                where students help each other succeed.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-green-600">Sustainability</h3>
              <p className="text-gray-600">
                We promote the reuse and sharing of resources to reduce waste and create 
                a more sustainable campus environment.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-purple-600">Accessibility</h3>
              <p className="text-gray-600">
                We believe everyone deserves access to affordable resources and opportunities, 
                regardless of their financial situation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
