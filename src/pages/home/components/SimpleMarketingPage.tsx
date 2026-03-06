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
  Camera,
  MessagesSquare,
  Handshake,
  ArrowRight,
  Star,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

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
  { icon: ShieldCheck, title: "Verified university emails", description: "Only students with a .edu email can join" },
  { icon: MapPin, title: "Meet on campus", description: "Exchange items safely at familiar campus spots" },
  { icon: MessageCircle, title: "Safe messaging built in", description: "Chat directly without sharing personal info" },
];

const HOW_IT_WORKS = [
  { step: 1, icon: Camera, title: "Post your item in seconds", description: "Snap a photo, set a price, and you're live." },
  { step: 2, icon: MessagesSquare, title: "Chat with other students", description: "Message buyers or sellers directly in-app." },
  { step: 3, icon: Handshake, title: "Meet on campus & exchange", description: "Pick a campus spot and complete the deal safely." },
];

const TESTIMONIALS = [
  { quote: "I sold my desk in 2 hours. Easiest thing ever.", name: "Sarah M.", school: "Duke '26" },
  { quote: "Finally a marketplace only for students — no creepy strangers.", name: "Alex K.", school: "Duke '25" },
  { quote: "Saved $400 on textbooks my first semester using this.", name: "Jordan P.", school: "Duke '27" },
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
      className="group block rounded-xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-lg"
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
      {/* HERO                                                          */}
      {/* ============================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.04] to-background">
        <div className="mx-auto max-w-5xl px-4 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Buy and Sell with{" "}
            <span className="text-primary">Students Near You</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            A safe marketplace for your campus community. Only verified students, real listings, zero hassle.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="h-12 px-8 text-base font-semibold">
                Join your campus marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold">
                Browse listings
              </Button>
            </Link>
          </div>

          {/* Mini stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-warning" /> 4.9/5 student rating</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-success" /> {userCount} verified students</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Same-day campus exchange</span>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* TRUST SIGNALS                                                  */}
      {/* ============================================================= */}
      <AnimatedSection direction="up" delay={0.05}>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {TRUST_SIGNALS.map((t, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <t.icon className="h-6 w-6 text-primary" />
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
          <section className="py-16 sm:py-20 bg-muted/30">
            <div className="mx-auto max-w-6xl px-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">What students are selling right now</h2>
                <p className="mt-2 text-muted-foreground">Real listings from your campus</p>
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
      {/* HOW IT WORKS                                                   */}
      {/* ============================================================= */}
      <AnimatedSection direction="up" delay={0.1}>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
              How it works
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {HOW_IT_WORKS.map((s) => (
                <div key={s.step} className="relative text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <s.icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 sm:right-auto sm:-left-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
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
                  className="rounded-xl border border-border bg-card p-6 space-y-4"
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">"{t.quote}"</p>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{t.name}</span> · {t.school}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ============================================================= */}
      {/* FINAL CTA                                                      */}
      {/* ============================================================= */}
      <AnimatedSection direction="up" delay={0.1}>
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Start buying and selling today
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join {userCount} students already on Devils Marketplace.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="h-12 px-8 text-base font-semibold">
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth?mode=login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold">
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
