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
          question: "Is Devil's Marketplace free to use?",
          answer: "Yes! Creating an account and browsing listings is completely free. We only charge small fees for premium features like promoting your listings."
        },
        {
          question: "Who can use Devil's Marketplace?",
          answer: "Devil's Marketplace is exclusively for students with valid .edu email addresses. This ensures a safe, trusted community of verified students."
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
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Find answers to common questions about Devil's Marketplace
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {faqs.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
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

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Email us at: <a href="mailto:info@devilsmarketplace.com" className="text-primary hover:underline">info@devilsmarketplace.com</a>
            </p>
            <p className="text-muted-foreground">
              Or reach out through our contact form and we'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
