
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms and Conditions</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Please read these terms carefully before using our platform
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Last Updated: June 13, 2025</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                By accessing and using Bazaar, you agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our platform.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">1. Eligibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>You must be a current student with a valid .edu email address</li>
                  <li>You must be at least 18 years old or have parental consent</li>
                  <li>You must provide accurate and truthful information</li>
                  <li>You are responsible for maintaining the security of your account</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">2. Acceptable Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">You agree to:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Use the platform for legitimate educational and personal purposes</li>
                    <li>Provide accurate descriptions and information in your listings</li>
                    <li>Treat other users with respect and courtesy</li>
                    <li>Report suspicious or inappropriate behavior</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">You agree NOT to:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Post false, misleading, or fraudulent listings</li>
                    <li>Sell prohibited items (weapons, drugs, stolen goods, etc.)</li>
                    <li>Harass, threaten, or discriminate against other users</li>
                    <li>Use the platform for commercial or business purposes unrelated to student life</li>
                    <li>Attempt to circumvent platform fees or security measures</li>
                    <li>Share inappropriate or offensive content</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">3. Transactions and Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>All transactions are between users; Bazaar is not a party to any transaction</li>
                  <li>We do not process payments or guarantee transaction completion</li>
                  <li>Users are responsible for their own payment arrangements and disputes</li>
                  <li>We recommend meeting in safe, public locations for exchanges</li>
                  <li>Always verify items and payments before completing transactions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">4. Content and Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>You retain ownership of content you post, but grant us license to display it</li>
                  <li>You may not post copyrighted material without permission</li>
                  <li>We reserve the right to remove content that violates these terms</li>
                  <li>The Bazaar platform and its features are our intellectual property</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">5. Privacy and Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Your privacy is important to us. Please review our Privacy Policy to understand 
                  how we collect, use, and protect your personal information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">6. Platform Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>We strive to maintain platform availability but cannot guarantee 100% uptime</li>
                  <li>We may perform maintenance or updates that temporarily affect access</li>
                  <li>We reserve the right to modify or discontinue features with notice</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">7. Account Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We reserve the right to suspend or terminate accounts that violate these terms, 
                  engage in fraudulent activity, or pose risks to other users. You may delete 
                  your account at any time through your account settings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">8. Disclaimers and Limitations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Bazaar is provided "as is" without warranties of any kind</li>
                  <li>We are not responsible for user-generated content or transactions</li>
                  <li>We do not guarantee the accuracy or quality of listings</li>
                  <li>Our liability is limited to the maximum extent permitted by law</li>
                  <li>Users assume all risks associated with their platform use</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">9. Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Any disputes arising from these terms or platform use will be resolved through 
                  binding arbitration. Users agree to attempt good faith resolution before 
                  pursuing legal action.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">10. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We may update these Terms and Conditions from time to time. Material changes 
                  will be communicated through the platform or email. Continued use after 
                  changes constitutes acceptance of new terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">11. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  For questions about these Terms and Conditions, please contact us:
                </p>
                <div className="text-gray-600">
                  <p>Email: legal@bazaar.edu</p>
                  <p>Address: [Your Institution Address]</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;
