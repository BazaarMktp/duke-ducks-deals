
import { ShoppingBag } from "lucide-react";

export const STATS = [
  { label: "Active Colleges", value: "1" },
  { label: "Happy Students", value: "500+" },
  { label: "Items Traded", value: "1,200+" },
  { label: "Success Rate", value: "98%" }
];

export const FEATURES = [
  {
    title: "College-Verified Community",
    description: "Trade exclusively with verified students and faculty from your university for a safer, more trustworthy experience."
  },
  {
    title: "Smart Marketplace",
    description: "Find exactly what you need with intelligent search, personalized recommendations, and real-time availability updates."
  },
  {
    title: "Sustainable Trading",
    description: "Reduce waste and save money by giving items a second life within your campus community."
  },
  {
    title: "Secure Transactions",
    description: "Built-in messaging, user verification, and community moderation ensure every trade is safe and reliable."
  }
];

export const TESTIMONIALS = [
  {
    quote: "The Bazaar made it so easy to find affordable textbooks and sell my old furniture when I graduated. The campus-only community feels much safer than other platforms.",
    author: "Sarah Chen",
    role: "Duke University Senior"
  },
  {
    quote: "I've saved hundreds of dollars on dorm essentials and made great connections with other students. It's like having a massive campus garage sale that never ends!",
    author: "Marcus Johnson", 
    role: "Duke University Sophomore"
  },
  {
    quote: "As a grad student on a tight budget, The Bazaar has been a lifesaver. I've furnished my entire apartment with great finds from other students.",
    author: "Emma Rodriguez",
    role: "Duke University Graduate Student"
  }
];

export const FAQ_ITEMS = [
  {
    question: "How do I verify my college email?",
    answer: "Simply sign up with your .edu email address and click the verification link we'll send you. Once verified, you'll have access to your campus marketplace."
  },
  {
    question: "Is it safe to trade with other students?",
    answer: "Yes! All users are verified through their college email, and we have built-in messaging, user ratings, and community moderation to ensure safe transactions."
  },
  {
    question: "What can I buy and sell?",
    answer: "Almost anything! Textbooks, furniture, electronics, clothing, dorm essentials, and more. Just make sure items comply with your campus policies."
  },
  {
    question: "How do I arrange pickup or delivery?",
    answer: "Use our built-in messaging system to coordinate with buyers/sellers. Most trades happen on campus for convenience and safety."
  },
  {
    question: "Are there any fees?",
    answer: "The Bazaar is completely free to use! No listing fees, no transaction fees, no hidden costs. We're here to help students save money, not spend more."
  }
];

export const categories = [
  {
    title: "Marketplace",
    description: "Buy and sell items with fellow students",
    icon: ShoppingBag,
    color: "bg-blue-500",
    href: "/marketplace"
  }
];
