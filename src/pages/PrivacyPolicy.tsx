
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
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
                This Privacy Policy describes how Bazaar ("we," "our," or "us") collects, uses, and protects 
                your personal information when you use our student marketplace platform.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">1. Information We Collect</CardTitle>
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
                  <h4 className="font-semibold mb-2">Usage Information</h4>
                  <p className="text-gray-600">
                    We automatically collect information about how you use our platform, including 
                    pages visited, features used, and interaction patterns.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>To provide and maintain our marketplace services</li>
                  <li>To facilitate communication between users</li>
                  <li>To verify student eligibility through .edu email addresses</li>
                  <li>To improve our platform and user experience</li>
                  <li>To send important updates and notifications</li>
                  <li>To prevent fraud and maintain platform safety</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">3. Information Sharing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We do not sell, trade, or rent your personal information to third parties. We may share 
                  information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>With other users when you choose to share through listings or messages</li>
                  <li>With service providers who help us operate the platform</li>
                  <li>When required by law or to protect our rights and safety</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">4. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no internet 
                  transmission is 100% secure, and we cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">5. Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Request a copy of your personal data</li>
                  <li>Report privacy concerns to our support team</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">6. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We use cookies and similar technologies to enhance your experience, remember your 
                  preferences, and analyze platform usage. You can control cookie settings through 
                  your browser preferences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">7. Student Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  As a student-focused platform, we are committed to protecting student privacy. 
                  We comply with applicable educational privacy laws and maintain strict policies 
                  regarding the use of student information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">8. Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by posting the new policy on this page and updating the 
                  "Last Updated" date.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">9. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="text-gray-600">
                  <p>Email: info@thebazaarapp.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
