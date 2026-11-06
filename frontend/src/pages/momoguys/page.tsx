import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ShoppingBag,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Flame,
  Instagram,
  Facebook,
  Twitter,
  ChevronRight,
  ChevronLeft,
  Star,
  Info,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "burgers" | "sides" | "drinks" | "desserts";
  image: string;
  calories?: string;
  popular?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "sig-double",
    name: "Signature Double Cheeseburger",
    price: 8.99,
    description:
      "Big, juicy burgers stacked high with bold flavors, fresh ingredients, and plenty of attitude.",
    category: "burgers",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    calories: "850 kcal",
    popular: true,
  },
  {
    id: "crispy-chicken",
    name: "The Good Stuff Crispy Chicken",
    price: 9.49,
    description:
      "Buttermilk fried chicken breast, tangy house sauce, dill pickles, and crisp iceberg lettuce on a potato bun.",
    category: "burgers",
    image:
      "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
    calories: "780 kcal",
    popular: true,
  },
  {
    id: "smash-classic",
    name: "Classic Smash Single",
    price: 6.99,
    description:
      "100% Angus beef patty smashed crispy on the flat top, double American cheese, grilled onions, smash sauce.",
    category: "burgers",
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    calories: "620 kcal",
  },

  {
    id: "thick-shake",
    name: "Vintage Vanilla Bean Shake",
    price: 4.49,
    description:
      "Hand-spun real Madagascar vanilla bean milk shake topped with whipped cream and a cherry.",
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    calories: "490 kcal",
  },
];

const REVIEWS = [
  {
    id: 1,
    text: '"Hands down the single best smash burger I\'ve eaten in years! The crispy caramelized edges and juicy center are unbeatable."',
    author: "Jason Smith",
    role: "Food Critic & Blogger",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    text: '"The Vintage Vanilla Shake paired with Loaded Smash Fries is pure nostalgia. Fast delivery, fresh ingredients every single time!"',
    author: "Sarah Jenkins",
    role: "Regular Customer",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    text: '"The Spicy Melt burger gives just the right amount of heat without drowning out the flavor of their premium grass-fed beef."',
    author: "Marcus Vance",
    role: "Burger Enthusiast",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function MOMOGUYS() {
  const [currentReview, setCurrentReview] = useState(0);

  // State for Cart Drawer, Search Overlay, Interactive Customizer, Carousel, etc.
  const [cart] = useState<{ item: MenuItem; quantity: number }[]>([
    { item: MENU_ITEMS[0], quantity: 1 },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [searchQuery, setSearchQuery] = useState("");

  // Calculate totals
  const totalItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      @keyframes ticker {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
      }
      .animate-ticker {
        display: flex;
        width: 200%;
        animation: ticker 22s linear infinite;
      }
      .animate-ticker:hover {
        animation-play-state: paused;
      }
      .font-condensed {
        font-family: 'Impact', 'Arial Black', sans-serif;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #640B0F;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #F9C349;
        border-radius: 999px;
      }
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-[#FAF3E0] text-[#800F15] font-sans selection:bg-[#F9C349] selection:text-[#800F15] relative overflow-x-hidden"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <main className="p-2 sm:p-4 md:p-3 lg:p-3 max-w-full mx-auto">
        {/* ==========================================
            HERO SECTION CARD (RED CARD WITH CURVES)
            ========================================== */}
        <section
          className="relative bg-[#921A1C] h-[98svh] text-[#FAF3E0] rounded-[32px] sm:rounded-[44px] md:rounded-[38px] p-4 sm:p-8 md:p-12 overflow-hidden "
          style={{
            backgroundImage: "url('/momoguys.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1100px auto",
          }}
        >
          {/* Subtle Background Pattern Texture */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#FAF3E0_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <header className="flex items-center justify-between relative z-30 mb-6 sm:mb-10">
            {/* Logo 'SMASH' */}
            <div className="group cursor-pointer flex items-center">
              <div className="bg-[#FAF3E0] text-[#800F15] px-4 py-1.5 sm:px-5 sm:py-2 rounded-full font-black tracking-widest text-lg sm:text-2xl shadow-lg border-2 border-[#800F15] transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#F9C349]">
                SMASH!
              </div>
            </div>

            {/* Right Action Icons & Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle Button */}
              <button
                aria-label="Search items"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#640B0F] hover:bg-[#FAF3E0] hover:text-[#800F15] text-[#FAF3E0] flex items-center justify-center transition-all duration-300 border border-[#800F15] shadow-md group"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
              </button>

              {/* Cart Button with Count Badge */}
              <button
                aria-label="View Cart"
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#640B0F] hover:bg-[#FAF3E0] hover:text-[#800F15] text-[#FAF3E0] flex items-center justify-center transition-all duration-300 border border-[#800F15] shadow-md group"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F9C349] text-[#800F15] font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#800F15] shadow-sm animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Header "ORDER NOW" Pill Button */}
              <button className="bg-[#FAF3E0] text-[#800F15] font-black text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-[#F9C349] transition-all duration-300 tracking-wider uppercase shadow-lg border-2 border-[#800F15] active:scale-95 flex items-center gap-1.5">
                <span>ORDER NOW</span>
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-20 min-h-[420px] sm:min-h-[500px]">
            {/* LEFT COLUMN: Huge Vintage Typography & Bottom CTA */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full z-10 pt-2 sm:pt-4">
              <div>
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[90px] xl:text-[96px] font-condensed font-bold tracking-tight leading-[0.88] uppercase text-left text-[#FAF3E0] drop-shadow-md">
                  MOMOS <br />
                  MADE TO <br />
                  <span className="text-[#F9C349] inline-block transform hover:scale-105 transition-transform cursor-pointer">
                    BE CRAVED
                  </span>
                </h1>
              </div>

              {/* Bottom-Left CTA Button */}
              <div className="mt-8 sm:mt-12 lg:mt-16 flex items-center">
                <button className="group flex items-center gap-3 bg-[#FAF3E0] text-[#800F15] font-black text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-[#F9C349] transition-all duration-300 shadow-xl border-2 border-[#800F15]">
                  <span className="tracking-widest">ORDER NOW</span>
                  <div className="w-7 h-7 rounded-full bg-[#800F15] text-[#FAF3E0] flex items-center justify-center group-hover:bg-[#640B0F] group-hover:rotate-45 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>

            {/* Hand Holding Burger Graphic */}

            {/* CENTER & RIGHT COLUMN: Hand Holding Cheeseburger Cutout + Annotations */}
            <div className="lg:col-span-6 relative flex justify-center items-center py-6 lg:py-0">
              {/* Floating Bottom-Right Mini Product Preview Box */}
              <div className="absolute -bottom-2 right-2 sm:right-4 bg-[#640B0F]/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl flex items-center gap-3 border-2 border-[#800F15] shadow-2xl max-w-[210px] z-30 cursor-pointer hover:scale-105 transition-transform group">
                <div className="relative overflow-hidden rounded-xl w-14 h-14 flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=200&q=80"
                    alt="Signature Burger Thumbnail"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-[#FAF3E0] leading-tight truncate">
                    Signature Burger
                  </p>
                  <span className="inline-block bg-[#F9C349] text-[#800F15] text-[10px] font-black px-2 py-0.5 rounded-full mt-1.5 shadow-sm">
                    $6.99
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#FAF3E0] text-[#800F15] flex items-center justify-center group-hover:bg-[#F9C349]">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 mt-8 sm:mt-12 -mx-4 sm:-mx-8 md:-mx-12 -mb-4 sm:-mb-8 md:-mb-12 bg-[#F9C349] text-[#800F15] py-3.5 overflow-hidden font-condensed font-black uppercase text-sm sm:text-base tracking-widest ">
            <div className="animate-ticker space-x-6">
              {[1, 2].map((loopKey) => (
                <div key={loopKey} className="flex items-center gap-8 shrink-0">
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 fill-[#800F15]" /> BUNS OUT,
                    FLAVORS IN
                  </span>
                  <span className="text-xl">•</span>
                  <span>EXTRA CHEESE, ALWAYS</span>
                  <span className="text-xl">•</span>
                  <span>BIG BITES ONLY</span>
                  <span className="text-xl">•</span>
                  <span>GRILLED TO PERFECTION</span>
                  <span className="text-xl">•</span>
                  <span>STACKED HIGH FOR MAXIMUM SATISFACTION</span>
                  <span className="text-xl">•</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION BELOW HERO: PITCH & BRAND STORY
            ========================================== */}
        <section className="mt-16  h-[90svh] sm:mt-24 max-w-7xl mx-auto place-self-center items-center text-center px-4 relative">
          {/* Top Floating Badge */}
          <div className="inline-block bg-[#F9C349] text-[#800F15] text-xs sm:text-sm font-black uppercase px-4 py-1.5 rounded-full mb-6 transform -rotate-2 border-2 border-[#800F15] shadow-md hover:rotate-0 transition-transform cursor-default">
            MADE FOR CRAVINGS
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-condensed font-bold tracking-tight leading-[0.95] uppercase text-[#800F15] mb-8">
            Big flavours. Fresh ingredients. No boring bites.
          </h2>

          {/* Descriptive Narrative with Floating Graphic Cards */}
          <div className="relative max-w-3xl  mx-auto my-32">
            {/* Left Floating Miniature Image Card */}
            <div className="hidden sm:block absolute -left-12 md:-left-20 top-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 bg-[#FAF3E0]  rounded-2xl shadow-xl  transform -rotate-6 hover:rotate-0 transition-all duration-300 z-10 hover:scale-110 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80"
                alt="Juicy Bite"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Paragraph Text */}
            <p className="text-xs sm:text-sm md:text-xl font-medium text-[#800F15]/90 leading-relaxed uppercase tracking-wider px-4 sm:px-12">
              WE MAKE BURGERS THE WAY THEY SHOULD BE JUICY, MESSY, LOADED WITH
              FLAVOUR, AND MADE FRESH EVERY TIME. FROM THE FIRST BITE TO THE
              LAST, EVERYTHING IS STACKED FOR MAXIMUM SATISFACTION.
            </p>

            {/* Right Floating Miniature Image Card */}
            <div className="hidden sm:block absolute -right-12 md:-right-20 top-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24  rounded-2xl shadow-xl  transform rotate-6 hover:rotate-0 transition-all duration-300 z-10 hover:scale-110 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=300&q=80"
                alt="Stacked Burger"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          {/* CTA Pill Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                const el = document.getElementById("menu-preview");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-3 bg-[#800F15] text-[#FAF3E0] font-black text-xs sm:text-sm px-7 py-3.5 rounded-full hover:bg-[#640B0F] transition-all duration-300 shadow-xl border-2 border-[#800F15] active:scale-95"
            >
              <span className="tracking-widest">MORE ABOUT US</span>
              <div className="w-7 h-7 rounded-full bg-[#FAF3E0] text-[#800F15] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </section>

        <section
          id="menu-preview"
          className="mt-16 sm:mt-24 h-[100svh] grid grid-cols-1 md:grid-cols-2 "
        >
          {/* LEFT PREVIEW CARD: Bun Close Up 'LOOK INSIDE' */}
          <div className="relative bg-[#800F15]  overflow-hidden min-h-[320px] sm:min-h-[380px] p-8 flex flex-col justify-end group shadow-xl  cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80"
              alt="Toasted Sesame Bun Texture"
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="relative z-10">
              <h3 className="text-4xl sm:text-6xl font-condensed font-bold uppercase text-[#FAF3E0] leading-none tracking-tight drop-shadow-md">
                LOOK <br /> INSIDE
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#F9C349] mt-3 uppercase tracking-wider">
                100% Artisan Brioche & Fresh Ingredients
              </p>
            </div>
          </div>

          {/* RIGHT PREVIEW CARD: Mustard Yellow 'THE GOOD STUFF' */}
          <div className="relative bg-[#F9C349] text-[#800F15]  overflow-hidden min-h-[320px] sm:min-h-[380px] p-6 sm:p-8 flex flex-col justify-between group shadow-xl ">
            {/* Header Title */}
            <div>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-condensed font-bold uppercase tracking-tight text-center sm:text-left">
                THE GOOD STUFF
              </h3>
            </div>

            {/* Center Product Image */}
            <div className="relative my-4 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80"
                alt="Crispy Fried Chicken Burger"
                className="w-full max-w-[280px] sm:max-w-[320px] h-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 rounded-2xl"
              />
            </div>

            {/* Bottom Controls / Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg sm:text-xl font-black">$9.49</span>
              <button className="bg-[#800F15] text-[#FAF3E0] text-xs font-black px-5 py-2.5 rounded-full hover:bg-[#640B0F] transition-colors flex items-center gap-2 shadow-md">
                <span>ADD TO ORDER</span>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <section
          id="menu-grid"
          className="mt-20 sm:mt-28 max-w-7xl mx-auto px-2"
        >
          <div className="text-center mb-10">
            <span className="inline-block bg-[#F9C349] text-[#800F15] text-xs font-black uppercase px-3 py-1 rounded-full mb-3 transform -rotate-1 border border-[#800F15]">
              BURGERS & BITES
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-condensed font-extrabold uppercase tracking-tight text-[#800F15]">
              MEET YOUR NEW FAVOURITES.
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {[
              { id: "all", label: "ALL ITEMS" },
              { id: "burgers", label: "BURGERS" },
              { id: "sides", label: "SIDES" },
              { id: "drinks", label: "DRINKS" },
              { id: "desserts", label: "DESSERTS" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all border-2 border-[#800F15] cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#800F15] text-[#FAF3E0] shadow-md scale-105"
                    : "bg-[#FAF3E0] text-[#800F15] hover:bg-[#F9C349]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#FAF3E0] border-2 border-[#800F15] rounded-[28px] p-5 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 relative group"
              >
                {/* Popular / Tags Badge */}
                {item.popular && (
                  <span className="absolute top-4 left-4 bg-[#F9C349] text-[#800F15] font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase border border-[#800F15] z-10">
                    POPULAR
                  </span>
                )}

                <button
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#800F15] text-[#FAF3E0] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-10"
                  title="View details"
                >
                  <Info className="w-4 h-4" />
                </button>

                {/* Burger Image Container */}
                <div className="w-full h-48 my-2 flex items-center justify-center overflow-hidden rounded-2xl cursor-pointer relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info & Price */}
                <div>
                  <div className="flex items-center justify-between mt-2 mb-2">
                    <span className="font-condensed font-black text-base tracking-wide text-[#800F15]">
                      {item.name}
                    </span>
                    <span className="font-black text-sm text-[#800F15] bg-[#F9C349] px-2 py-0.5 rounded-full border border-[#800F15]">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[12px] font-semibold text-[#800F15]/80 leading-snug line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  <button className="w-full bg-[#800F15] text-[#FAF3E0] font-black text-xs py-2.5 rounded-full hover:bg-[#640B0F] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer uppercase">
                    <span>ADD TO ORDER</span>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredMenuItems.length === 0 && (
            <div className="text-center py-16 bg-[#FAF3E0] border-2 border-dashed border-[#800F15] rounded-3xl my-6">
              <p className="font-condensed font-black text-2xl uppercase text-[#800F15]">
                NO BURGERS FOUND MATCHING YOUR CRITERIA!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 bg-[#800F15] text-[#FAF3E0] font-black text-xs px-6 py-2.5 rounded-full"
              >
                RESET FILTERS
              </button>
            </div>
          )}
        </section>

        <section className="mt-20 sm:my-48 max-w-[1440px] mx-auto px-2">
          <div className="text-center my-16">
            <span className="inline-block bg-[#F9C349] text-[#800F15] text-xs font-black uppercase px-3 py-1 rounded-full mb-3 transform rotate-1 border border-[#800F15]">
              THE WORD ON THE STREET
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-condensed font-extrabold uppercase tracking-tight text-[#800F15]">
              DON'T JUST TAKE OUR WORD FOR IT.
            </h2>
          </div>

          <div className="relative rounded-[36px] overflow-hidden min-h-[380px] sm:min-h-[640px] flex items-center justify-center p-6">
            <img
              src={REVIEWS[currentReview].image}
              alt="Customer review photo"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

            {/* Testimonial Overlay Card */}
            <div className="relative z-10 bg-[#FAF3E0] text-[#800F15] p-6 sm:p-10 rounded-[28px] max-w-xl text-center shadow-2xl border-2 border-[#800F15] mx-auto my-auto">
              <div className="flex justify-center gap-1 mb-3 text-[#F9C349]">
                {[...Array(REVIEWS[currentReview].rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#F9C349] text-[#800F15]"
                  />
                ))}
              </div>

              {/* Previous Button */}
              <button
                onClick={() =>
                  setCurrentReview((prev) =>
                    prev === 0 ? REVIEWS.length - 1 : prev - 1,
                  )
                }
                className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 bg-[#F9C349] text-[#800F15] w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#800F15] hover:scale-110 transition-transform shadow-md cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 stroke-[3]" />
              </button>

              <p className="text-sm sm:text-base font-extrabold leading-snug mb-4">
                {REVIEWS[currentReview].text}
              </p>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#800F15] block">
                  — {REVIEWS[currentReview].author}
                </span>
                <span className="text-[10px] font-bold uppercase text-[#800F15]/60 block mt-0.5">
                  {REVIEWS[currentReview].role}
                </span>
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentReview((prev) =>
                    prev === REVIEWS.length - 1 ? 0 : prev + 1,
                  )
                }
                className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 bg-[#F9C349] text-[#800F15] w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#800F15] hover:scale-110 transition-transform shadow-md cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-20 sm:mt-28 bg-[#921A1C] text-[#FAF3E0] h-[80svh] rounded-[36px] p-6 sm:p-10  shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 h-full md:grid-cols-12 gap-8 items-stretch">
            {/* Left Nav Box */}
            <div className="md:col-span-8 bg-[#FAF3E0] text-[#800F15] rounded-[28px] p-6 sm:p-8 border-2 border-[#800F15] flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-4 text-lg font-bold ">
                <div>
                  <h4 className="font-bold mb-3 text-[#800F15]">SHOP</h4>
                  <ul className="space-y-2 text-[14px] opacity-80">
                    <li className="hover:underline cursor-pointer">
                      Best Sellers
                    </li>
                    <li className="hover:underline cursor-pointer">
                      All Burgers
                    </li>
                    <li className="hover:underline cursor-pointer">
                      Sides & Drinks
                    </li>
                    <li className="hover:underline cursor-pointer">
                      Gift Cards
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3 text-[#800F15]">EXPLORE</h4>
                  <ul className="space-y-2 text-[14px] opacity-80">
                    <li className="hover:underline cursor-pointer">
                      Our Story
                    </li>
                    <li className="hover:underline cursor-pointer">
                      Ingredients
                    </li>
                    <li className="hover:underline cursor-pointer">
                      Locations
                    </li>
                    <li className="hover:underline cursor-pointer">Careers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3 text-[#800F15]">FOLLOW</h4>
                  <div className="flex gap-2 mb-3">
                    <Instagram className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
                    <Facebook className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
                    <Twitter className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-[14px] text-[#800F15]/70 normal-case">
                    Tag @SmashBurger to be featured!
                  </p>
                </div>
              </div>

              {/* Footer Big Branding */}
              <div className="mt-10 pt-4 border-t border-[#800F15]/20">
                <h1 className="text-4xl sm:text-6xl md:text-9xl font-condensed font-bold  uppercase leading-none text-[#800F15]">
                  SMASH BURGER
                </h1>
              </div>
            </div>

            {/* Right Photo Card */}
            <div className="md:col-span-4 relative rounded-[28px] overflow-hidden min-h-[260px] border-2 border-[#800F15]">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                alt="Smash Burgers Tray"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
