
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click 'Sign Up' in the top navigation, enter your email address, create a password, and verify your email. You'll need a valid .edu email address to join our community."
        },
        {
          question: "Is Bazaar free to use?",
          answer: "Yes! Creating an account and browsing listings is completely free. We only charge small fees for premium features like promoting your listings."
        },
        {
          question: "Who can use Bazaar?",
          answer: "Bazaar is exclusively for students with valid .edu email addresses. This ensures a safe, trusted community of verified students."
        }
      ]
    },
    {
      category: "Buying & Selling",
      questions: [
        {
          question: "How do I post an item for sale?",
          answer: "After logging in, click 'Create Listing' in your user menu. Fill out the item details, upload photos, set your price, and publish your listing."
        },
        {
          question: "How do payments work?",
          answer: "Payments are handled directly between buyers and sellers. We recommend meeting in person for cash transactions or using secure payment methods like Venmo or PayPal."
        },
        {
          question: "What items can I sell?",
          answer: "You can sell textbooks, electronics, furniture, clothing, and most other items. Prohibited items include weapons, illegal substances, and items that violate our community guidelines."
        },
        {
          question: "How do I contact a seller?",
          answer: "Click on any listing to view details, then use the 'Contact Seller' button to send a message through our secure messaging system."
        }
      ]
    },
    {
      category: "Donations",
      questions: [
        {
          question: "How does the donation system work?",
          answer: "Post items you'd like to donate for free. Interested recipients can contact you to arrange pickup. This is a great way to help fellow students in need."
        },
        {
          question: "What items are suitable for donation?",
          answer: "Gently used textbooks, clothing, electronics, furniture, and school supplies are all great donation items. Items should be clean and functional."
        },
        {
          question: "Do you organize donation pickups?",
          answer: "Currently, donors and recipients arrange pickups directly. We're working on organizing campus-wide donation events in the future."
        }
      ]
    },
    {
      category: "Safety & Trust",
      questions: [
        {
          question: "How do you ensure user safety?",
          answer: "We verify all users with .edu email addresses, provide reporting tools, and recommend meeting in public campus locations for exchanges."
        },
        {
          question: "What should I do if I encounter suspicious activity?",
          answer: "Report any suspicious listings or users immediately using our report feature. We take all reports seriously and investigate promptly."
        },
        {
          question: "Where should I meet for transactions?",
          answer: "We recommend meeting in well-lit, public campus locations like the library, student center, or dining halls during busy hours."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Find answers to common questions about using Bazaar
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {faqs.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="space-y-4">
            <p className="text-gray-600">
              Email us at: <a href="mailto:support@bazaar.edu" className="text-blue-600 hover:underline">support@bazaar.edu</a>
            </p>
            <p className="text-gray-600">
              Or reach out through our contact form and we'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
