
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003087] to-[#001a4d] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Last Updated: June 13, 2025</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                This Privacy Policy describes how Devils Marketplace ("we," "our," or "us") collects, uses, and protects 
                your personal information when you use our student marketplace platform.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#003087]">1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  <p className="text-gray-600">
                    When you create an account, we collect your name, email address (.edu required), 
                    phone number (optional), and profile information you choose to provide.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Listing Information</h4>
                  <p className="text-gray-600">
                    When you create listings, we collect the information you provide including descriptions, 
                    photos, prices, and contact preferences.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Data</h4>
                  <p className="text-gray-600">
                    We automatically collect information about how you interact with our platform, 
                    including pages visited, search queries, and features used.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#003087]">2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>To provide and maintain our marketplace platform</li>
                  <li>To verify your identity and college affiliation</li>
                  <li>To facilitate communication between buyers and sellers</li>
                  <li>To send notifications about your listings and messages</li>
                  <li>To improve our platform and user experience</li>
                  <li>To prevent fraud and ensure platform safety</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#003087]">3. Information Sharing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We do not sell your personal information. We only share your information in these limited circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>With other users when you interact with them (e.g., your profile name, listings)</li>
                  <li>With service providers who help us operate our platform</li>
                  <li>When required by law or to protect our rights</li>
                  <li>With your explicit consent</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#003087]">4. Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We implement industry-standard security measures to protect your information, including 
                  encryption, secure servers, and regular security audits. However, no method of transmission 
                  over the Internet is 100% secure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#003087]">5. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Access and download your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Control your privacy settings</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#003087]">6. Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <p className="text-gray-600 mt-2">
                  Email: <a href="mailto:privacy@devilsmarketplace.com" className="text-[#003087] hover:underline">privacy@devilsmarketplace.com</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
