import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Stats } from "../types";
import { formatUserCount } from "@/utils/numberFormatting";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  ShieldCheck,
  MapPin,
  MessageCircle,
  ArrowRight,
  Star,
  Clock,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import heroImage from "@/assets/hero-marketplace.jpg";
import stepUpload from "@/assets/step-upload.png";
import stepChat from "@/assets/step-chat.png";
import stepMeetup from "@/assets/step-meetup.png";
import ctaBackground from "@/assets/cta-background.jpg";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FeaturedProduct {
  id: string;
  title: string;
  price: number | null;
  images: string[] | null;
  created_at: string;
  profiles: { profile_name: string } | null;
  colleges: { name: string } | null;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const TRUST_SIGNALS = [
  { icon: ShieldCheck, title: "Verified University Emails", description: "Only students with a .edu email can join — no strangers, no spam." },
  { icon: MessageCircle, title: "Safe In-App Messaging", description: "Chat directly without sharing personal info. Your privacy, protected." },
  { icon: MapPin, title: "Campus-Only Marketplace", description: "Buy and sell exclusively with students from your university." },
];

const HOW_IT_WORKS = [
  { step: 1, image: stepUpload, title: "Upload your item", description: "Snap a photo, add a title and price — listed in under 30 seconds." },
  { step: 2, image: stepChat, title: "Chat with students", description: "Message buyers or sellers directly. No phone numbers needed." },
  { step: 3, image: stepMeetup, title: "Meet on campus", description: "Pick a familiar campus spot and complete the exchange safely." },
];

const TESTIMONIALS = [
  { quote: "Sold my desk in 2 hours!", name: "Sarah M.", school: "Duke '26", initials: "SM" },
  { quote: "Finally a marketplace only for students — no creepy strangers.", name: "Alex K.", school: "Duke '25", initials: "AK" },
  { quote: "Saved $400 on textbooks my first semester.", name: "Jordan P.", school: "Duke '27", initials: "JP" },
];

const SOCIAL_PROOF_ITEMS = [
  { title: "Mini Fridge", price: "$50", status: "Sold in 3 hours" },
  { title: "Calculus Textbook", price: "$25", status: "Sold in 1 hour" },
  { title: "Desk Lamp", price: "$15", status: "Sold in 45 min" },
  { title: "Bike Lock", price: "$20", status: "Sold in 2 hours" },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const ListingCard = ({ listing }: { listing: FeaturedProduct }) => {
  const image = listing.images?.[0];
  const timeAgo = formatDistanceToNow(new Date(listing.created_at), { addSuffix: true });

  return (
    <Link
      to={`/marketplace/${listing.id}`}
      className="group block rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300"
    >
      <div className="aspect-square bg-muted/40 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            <Camera className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-sm font-semibold text-foreground truncate">{listing.title}</p>
        <p className="text-base font-bold text-primary">
          {listing.price != null ? `$${listing.price.toFixed(0)}` : "Free"}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
          <span className="truncate max-w-[60%]">{listing.colleges?.name ?? "University"}</span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface SimpleMarketingPageProps {
  stats: Stats;
}

export const SimpleMarketingPage = ({ stats }: SimpleMarketingPageProps) => {
  const [listings, setListings] = useState<FeaturedProduct[]>([]);
  const userCount = formatUserCount(stats.totalUsers);

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase
        .from("listings")
        .select("id, title, price, images, created_at, profiles(profile_name), colleges(name)")
        .eq("status", "active")
        .eq("category", "marketplace")
        .eq("listing_type", "offer")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(8);
      setListings((data as FeaturedProduct[]) ?? []);
    };
    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ============================================================= */}
      {/* HERO — Full-bleed image with overlay                          */}
      {/* ============================================================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <img
          src={heroImage}
          alt="Students exchanging items on campus"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-lg">
            Buy and Sell with<br />
            <span className="text-accent">Students Near You</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg sm:text-xl text-white/90 drop-shadow">
            The safest marketplace for your campus. Only verified students, real listings, zero hassle.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-xl">
                Join Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                Browse Listings
              </Button>
            </Link>
          </div>

          {/* Mini stats bar */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-warning fill-warning" /> 4.9/5 student rating
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-accent" /> {userCount} verified students
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-accent" /> Same-day campus exchange
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* TRUST SIGNALS                                                  */}
      {/* ============================================================= */}
      <AnimatedSection direction="up" delay={0.05}>
        <section className="py-16 sm:py-20 bg-card">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
              Built for student safety
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {TRUST_SIGNALS.map((t, i) => (
                <div key={i} className="text-center space-y-4 p-6 rounded-2xl border border-border/60 bg-background hover:shadow-md transition-shadow">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <t.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ============================================================= */}
      {/* FEATURED LISTINGS                                              */}
      {/* ============================================================= */}
      {listings.length > 0 && (
        <AnimatedSection direction="up" delay={0.1}>
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">What students are selling right now</h2>
                <p className="mt-2 text-muted-foreground">Real listings from your campus — updated in real time</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {listings.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link to="/marketplace">
                  <Button variant="outline" size="lg" className="font-semibold">
                    View all listings
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* ============================================================= */}
      {/* HOW IT WORKS — with illustrations                              */}
      {/* ============================================================= */}
      <AnimatedSection direction="up" delay={0.1}>
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-4">
              How it works
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              List an item in under 30 seconds. It's that easy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {HOW_IT_WORKS.map((s) => (
                <div key={s.step} className="relative text-center space-y-4">
                  {/* Step illustration */}
                  <div className="mx-auto w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  {/* Step number badge */}
                  <span className="absolute top-0 right-1/4 sm:right-auto sm:left-1/4 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md">
                    {s.step}
                  </span>
                  <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ============================================================= */}
      {/* SOCIAL PROOF — Sold fast ticker                                */}
      {/* ============================================================= */}
      <AnimatedSection direction="up" delay={0.1}>
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3">
              Items sell fast
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              Here's what students sold recently
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {SOCIAL_PROOF_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-card p-4 text-center space-y-2 hover:shadow-md transition-shadow"
                >
                  <CheckCircle2 className="h-6 w-6 text-primary mx-auto" />
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-base font-bold text-primary">{item.price}</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-accent-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    <span className="text-muted-foreground">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ============================================================= */}
      {/* TESTIMONIALS                                                   */}
      {/* ============================================================= */}
      <AnimatedSection direction="up" delay={0.15}>
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
              What students say
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-card p-6 space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-lg">
                      {t.avatar}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground block">{t.name}</span>
                      {t.school}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ============================================================= */}
      {/* FINAL CTA — with background image                              */}
      {/* ============================================================= */}
      <AnimatedSection direction="up" delay={0.1}>
        <section className="relative py-24 sm:py-32 overflow-hidden">
          {/* Background image */}
          <img
            src={ctaBackground}
            alt="Student dorm room with items"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 backdrop-blur-[2px]" />

          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
              Join your campus marketplace today
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              {userCount} students are already buying and selling. Don't miss out.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="h-12 px-8 text-base font-semibold bg-white text-primary hover:bg-white/90 shadow-xl">
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth?mode=login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold border-white/40 text-primary-foreground hover:bg-white/10 bg-white/5">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};
