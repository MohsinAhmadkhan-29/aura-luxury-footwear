'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Award,
  Star,
  SlidersHorizontal,
  Grid,
  List,
  Eye,
  Plus,
  Minus,
  Trash2,
  Lock,
  Share2,
  Globe,
  Check,
  Clock,
  Sparkles
} from 'lucide-react';

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================
interface Product {
  id: string;
  name: string;
  category: 'Men' | 'Women' | 'Sneakers' | 'Running' | 'Casual';
  originalPrice: number;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  hoverImage: string;
  colors: string[];
  sizes: number[];
  isNew?: boolean;
  isBestSeller?: boolean;
  description: string;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Apex Runner Luxury Edition',
    category: 'Sneakers',
    originalPrice: 149,
    price: 104.3,
    rating: 4.9,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
    colors: ['#000000', '#FFFFFF', '#808080'],
    sizes: [7, 8, 9, 10, 11, 12],
    isBestSeller: true,
    description: 'Engineered for ultimate comfort and high-street elegance. Features bespoke architectural sole design and premium full-grain Italian leather detailing.'
  },
  {
    id: '2',
    name: 'Velocity X Phantom',
    category: 'Running',
    originalPrice: 179,
    price: 125.3,
    rating: 5.0,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1000&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
    colors: ['#111111', '#D4AF37'],
    sizes: [8, 9, 10, 11],
    isBestSeller: true,
    isNew: true,
    description: 'Ultra-lightweight reactive cushion tech combined with an aerodynamic silhouette built for speed and effortless everyday luxury styling.'
  },
  {
    id: '3',
    name: 'Urban Force Monolith',
    category: 'Casual',
    originalPrice: 129,
    price: 90.3,
    rating: 4.8,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=80',
    colors: ['#FFFFFF', '#000000', '#C0C0C0'],
    sizes: [7, 8, 9, 10, 11, 12],
    isBestSeller: true,
    description: 'Minimalist aesthetic meets unmatched modern durable craftsmanship. The ultimate staple for progressive wardrobe styling.'
  },
  {
    id: '4',
    name: 'Eclipse Low Studio',
    category: 'Men',
    originalPrice: 159,
    price: 111.3,
    rating: 4.7,
    reviewsCount: 67,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80',
    colors: ['#222222', '#F5F5DC'],
    sizes: [7, 8, 9, 10, 11],
    isNew: true,
    description: 'Sleek low-profile court-inspired silhouette meticulously handcrafted from supple suede and matte metallic trims.'
  }
];

export default function PremiumShoeApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'wishlist'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const [cart, setCart] = useState<{ product: Product; size: number; color: string; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'rating'>('featured');

  const [discountPopupOpen, setDiscountPopupOpen] = useState(false);
  const [discountPopupClaimed, setDiscountPopupClaimed] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(599);

  const [pdpSize, setPdpSize] = useState<number>(PRODUCTS[0].sizes[0]);
  const [pdpColor, setPdpColor] = useState<string>(PRODUCTS[0].colors[0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const popupTimer = setTimeout(() => {
      if (!discountPopupClaimed) setDiscountPopupOpen(true);
    }, 3000);
    return () => clearTimeout(popupTimer);
  }, [discountPopupClaimed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addToCart = (product: Product, size: number, color: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, color, quantity: 1 }];
    });
    setCartDrawerOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCartQty = (index: number, qty: number) => {
    if (qty <= 0) return removeFromCart(index);
    setCart((prev) => prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item)));
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const applyCouponCode = (code: string) => {
    if (code.trim().toUpperCase() === 'STEP30') {
      setAppliedCoupon('STEP30');
      setDiscountPercent(30);
    } else {
      alert('Invalid coupon code. Use: STEP30');
    }
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    return (cartSubtotal * discountPercent) / 100;
  }, [cartSubtotal, discountPercent]);

  const shippingCost = cartSubtotal > 100 || cart.length === 0 ? 0 : 15;
  const cartTotal = cartSubtotal - cartDiscount + shippingCost;
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'low-high') return a.price - b.price;
      if (sortBy === 'high-low') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setPdpSize(product.sizes[0]);
    setPdpColor(product.colors[0]);
    setActiveTab('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#111111] font-sans selection:bg-black selection:text-white">
      <div className="bg-black text-white text-xs uppercase tracking-[0.2em] py-2 px-4 flex justify-between items-center border-b border-neutral-800">
        <div className="flex-1 text-center font-medium">
          Limited Time — Get 30% Off Your First Order. Use Code:{' '}
          <span className="font-bold text-amber-400 underline underline-offset-4 ml-1">STEP30</span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 backdrop-blur-md ${
          isScrolled ? 'bg-white/90 shadow-sm border-b border-neutral-100 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('home')}
            className="text-2xl font-black tracking-tighter uppercase font-mono flex items-center gap-1"
          >
            AURA<span className="w-2 h-2 rounded-full bg-black inline-block"></span>
          </button>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.15em]">
            <button onClick={() => setActiveTab('home')} className="hover:text-neutral-500 transition-colors">
              Home
            </button>
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                onClick={() => setActiveTab('shop')}
                className="flex items-center gap-1 hover:text-neutral-500 transition-colors py-2"
              >
                Shop <ChevronDown className="w-3 h-3" />
              </button>

              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white border border-neutral-100 shadow-2xl p-8 grid grid-cols-3 gap-6 rounded-none z-50"
                  >
                    <div>
                      <h4 className="font-bold tracking-widest text-[10px] text-neutral-400 mb-3">CATEGORIES</h4>
                      <ul className="space-y-2 text-xs normal-case text-neutral-600 tracking-normal font-normal">
                        <li className="hover:text-black cursor-pointer" onClick={() => { setSelectedCategory('Sneakers'); setActiveTab('shop'); }}>Sneakers</li>
                        <li className="hover:text-black cursor-pointer" onClick={() => { setSelectedCategory('Running'); setActiveTab('shop'); }}>Running Shoes</li>
                        <li className="hover:text-black cursor-pointer" onClick={() => { setSelectedCategory('Casual'); setActiveTab('shop'); }}>Casual Shoes</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold tracking-widest text-[10px] text-neutral-400 mb-3">COLLECTIONS</h4>
                      <ul className="space-y-2 text-xs normal-case text-neutral-600 tracking-normal font-normal">
                        <li className="hover:text-black cursor-pointer" onClick={() => setActiveTab('shop')}>New Arrivals 2026</li>
                        <li className="hover:text-black cursor-pointer" onClick={() => setActiveTab('shop')}>Best Sellers</li>
                        <li className="hover:text-black cursor-pointer" onClick={() => setActiveTab('shop')}>Minimalist Series</li>
                      </ul>
                    </div>
                    <div className="bg-neutral-50 p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-600 tracking-widest uppercase">PROMO</span>
                        <p className="text-xs font-semibold uppercase mt-1">Extra 30% Off</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('shop')}
                        className="text-[10px] font-bold tracking-widest underline uppercase mt-4 text-left"
                      >
                        Explore Drop
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => { setSelectedCategory('Men'); setActiveTab('shop'); }} className="hover:text-neutral-500 transition-colors">
              Men
            </button>
            <button onClick={() => { setSelectedCategory('Women'); setActiveTab('shop'); }} className="hover:text-neutral-500 transition-colors">
              Women
            </button>
            <button onClick={() => setActiveTab('shop')} className="hover:text-neutral-500 transition-colors">
              New Arrivals
            </button>
          </nav>

          <div className="flex items-center gap-5">
            <button onClick={() => setSearchOpen(true)} className="p-1 hover:text-neutral-500 transition-colors">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button onClick={() => setActiveTab('wishlist')} className="p-1 hover:text-neutral-500 transition-colors relative">
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button onClick={() => setCartDrawerOpen(true)} className="p-1 hover:text-neutral-500 transition-colors relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-1">
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-white z-50 flex flex-col p-8 md:hidden"
          >
            <div className="flex justify-between items-center pb-6 border-b">
              <span className="text-xl font-black font-mono">AURA</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-6 text-xl font-bold uppercase tracking-wider my-auto">
              <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className="text-left">Home</button>
              <button onClick={() => { setActiveTab('shop'); setMobileMenuOpen(false); }} className="text-left">Shop All</button>
              <button onClick={() => { setSelectedCategory('Men'); setActiveTab('shop'); setMobileMenuOpen(false); }} className="text-left">Men</button>
              <button onClick={() => { setSelectedCategory('Women'); setActiveTab('shop'); setMobileMenuOpen(false); }} className="text-left">Women</button>
              <button onClick={() => { setActiveTab('wishlist'); setMobileMenuOpen(false); }} className="text-left">Wishlist ({wishlist.length})</button>
            </nav>
            <div className="pt-6 border-t border-neutral-100 text-xs text-neutral-400 uppercase tracking-widest text-center">
              © 2026 AURA FOOTWEAR INC.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="bg-white w-full max-w-2xl p-6 shadow-2xl relative"
            >
              <button onClick={() => setSearchOpen(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
                <Search className="w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search footwear, styles, collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-lg outline-none font-medium placeholder:text-neutral-300"
                  autoFocus
                />
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Apex Runner', 'Velocity X', 'Monolith', 'Leather'].map((term) => (
                    <button
                      key={term}
                      onClick={() => { setSearchQuery(term); }}
                      className="px-3 py-1 bg-neutral-100 hover:bg-black hover:text-white transition-colors text-xs font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {discountPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-black text-white max-w-3xl w-full grid md:grid-cols-2 relative border border-neutral-800 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setDiscountPopupOpen(false)}
                className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-white bg-black/40 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative hidden md:block h-full min-h-[380px]">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
                  alt="Discount Sneaker"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest mb-2">
                  <Clock className="w-4 h-4" /> EXPIRES IN {formatTime(timeLeft)}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">
                  WAIT — GET 30% OFF YOUR FIRST PAIR
                </h3>
                <p className="text-neutral-400 text-xs mt-2 font-normal leading-relaxed">
                  Unlock exclusive early drops and claim an instant 30% discount code for your initial order.
                </p>
                <div className="mt-6 space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-neutral-900 border border-neutral-700 px-4 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
                  />
                  <button
                    onClick={() => {
                      applyCouponCode('STEP30');
                      setDiscountPopupClaimed(true);
                      setDiscountPopupOpen(false);
                    }}
                    className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                  >
                    CLAIM 30% OFF NOW
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500 mt-4 text-center">
                  Use code <span className="text-white font-mono font-bold">STEP30</span> at checkout. No spam ever.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'home' && (
        <main>
          <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden bg-[#0A0A0A] text-white">
            <div className="absolute inset-0 opacity-40">
              <img
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=2000&q=80"
                alt="Editorial Hero"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/60" />

            <div className="relative max-w-5xl mx-auto text-center z-10 space-y-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md text-amber-300 text-[10px] font-mono tracking-[0.25em] uppercase border border-white/20"
              >
                NEW SEASON 2026 DROP
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-8xl font-black uppercase tracking-tight leading-[0.9]"
              >
                STEP INTO <br />
                YOUR NEXT ERA.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl mx-auto text-neutral-400 text-sm md:text-base font-normal tracking-wide leading-relaxed"
              >
                Premium footwear engineered for movement, designed to command attention. Uncompromised luxury comfort.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                <button
                  onClick={() => { setSelectedCategory('Men'); setActiveTab('shop'); }}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                  SHOP MEN <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setSelectedCategory('Women'); setActiveTab('shop'); }}
                  className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/10 transition-colors"
                >
                  SHOP WOMEN
                </button>
              </motion.div>
            </div>
          </section>

          <section className="border-y border-neutral-200 bg-white py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <Truck className="w-6 h-6 mx-auto stroke-[1.2]" />
                <h4 className="text-xs font-bold uppercase tracking-widest">FREE SHIPPING</h4>
                <p className="text-[11px] text-neutral-500">On all worldwide orders over $100</p>
              </div>
              <div className="space-y-2">
                <RotateCcw className="w-6 h-6 mx-auto stroke-[1.2]" />
                <h4 className="text-xs font-bold uppercase tracking-widest">30-DAY RETURNS</h4>
                <p className="text-[11px] text-neutral-500">Hassle-free return policy</p>
              </div>
              <div className="space-y-2">
                <ShieldCheck className="w-6 h-6 mx-auto stroke-[1.2]" />
                <h4 className="text-xs font-bold uppercase tracking-widest">100% SECURE</h4>
                <p className="text-[11px] text-neutral-500">Encrypted payment checkout</p>
              </div>
              <div className="space-y-2">
                <Award className="w-6 h-6 mx-auto stroke-[1.2]" />
                <h4 className="text-xs font-bold uppercase tracking-widest">CRAFTSMANSHIP</h4>
                <p className="text-[11px] text-neutral-500">Hand-finished premium materials</p>
              </div>
            </div>
          </section>

          <section className="py-20 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">CURATED DROPS</span>
                <h2 className="text-3xl font-black uppercase tracking-tight mt-1">THE COLLECTION</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'MEN', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80', cat: 'Men' },
                { title: 'WOMEN', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80', cat: 'Women' },
                { title: 'NEW ARRIVALS', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80', cat: 'Sneakers' }
              ].map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => { setSelectedCategory(card.cat); setActiveTab('shop'); }}
                  className="group relative h-[450px] overflow-hidden bg-neutral-100 cursor-pointer"
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">{card.title}</h3>
                      <p className="text-xs text-neutral-300 font-light mt-1">Explore Editorial Line</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:translate-x-1">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="py-16 px-6 bg-neutral-50 border-t border-neutral-200">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-xl mx-auto mb-16">
                <span className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">MOST WANTED</span>
                <h2 className="text-3xl font-black uppercase tracking-tight mt-1">BEST SELLERS</h2>
                <p className="text-xs text-neutral-500 mt-2">The silhouettes defining contemporary footwear aesthetics.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {PRODUCTS.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={() => openProductDetails(product)}
                    onWishlist={() => toggleWishlist(product.id)}
                    isWishlisted={wishlist.includes(product.id)}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1000&q=80"
                alt="Brand Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <span className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">OUR PHILOSOPHY</span>
              <h2 className="text-4xl font-black uppercase tracking-tight leading-tight">
                BUILT TO MOVE DIFFERENT.
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                AURA was founded on the belief that high-fashion aesthetics and technical athletic performance should coexist seamlessly. Every pair is engineered with precision, using eco-conscious leathers and proprietary foam cushioning.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-neutral-200">
                <div>
                  <h5 className="text-2xl font-black">4.9 / 5.0</h5>
                  <p className="text-[11px] text-neutral-500 mt-1">From over 2,000+ verified customer reviews</p>
                </div>
                <div>
                  <h5 className="text-2xl font-black">100%</h5>
                  <p className="text-[11px] text-neutral-500 mt-1">Sustainably sourced artisan leather</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {activeTab === 'shop' && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-10 pb-6 border-b border-neutral-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">CATALOGUE 2026</span>
              <h1 className="text-4xl font-black uppercase tracking-tight mt-1">SHOP ALL FOOTWEAR</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent border border-neutral-300 px-3 py-1.5 text-xs outline-none uppercase font-mono"
                >
                  <option value="featured">Featured</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <aside className="space-y-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-200 pb-2 mb-4">
                  Category
                </h4>
                <div className="space-y-2 text-xs">
                  {['All', 'Men', 'Women', 'Sneakers', 'Running', 'Casual'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left py-1 transition-colors ${
                        selectedCategory === cat ? 'font-bold underline text-black' : 'text-neutral-500 hover:text-black'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-200 pb-2 mb-4">
                  Active Promo
                </h4>
                <div className="bg-neutral-100 p-4 border-l-2 border-black">
                  <p className="text-xs font-bold uppercase">30% OFF APPLIED AT CHECKOUT</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Use promo code STEP30 to unlock instant savings on all pairs.</p>
                </div>
              </div>
            </aside>

            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={() => openProductDetails(product)}
                    onWishlist={() => toggleWishlist(product.id)}
                    isWishlisted={wishlist.includes(product.id)}
                  />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-neutral-400">
                  <p className="text-sm uppercase tracking-widest">No products match your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'product' && selectedProduct && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button
            onClick={() => setActiveTab('shop')}
            className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black mb-8 inline-flex items-center gap-2"
          >
            ← Back to Shop
          </button>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                  30% OFF WITH STEP30
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-neutral-100 overflow-hidden">
                  <img src={selectedProduct.hoverImage} alt="Secondary View" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square bg-neutral-100 overflow-hidden">
                  <img src={selectedProduct.image} alt="Detail View" className="w-full h-full object-cover grayscale" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 tracking-[0.2em] uppercase">
                  {selectedProduct.category}
                </span>
                <h1 className="text-3xl font-black uppercase tracking-tight mt-1">{selectedProduct.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-neutral-500">
                    {selectedProduct.rating} ({selectedProduct.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3 border-y border-neutral-100 py-4">
                <span className="text-2xl font-black">${selectedProduct.price.toFixed(2)}</span>
                <span className="text-sm text-neutral-400 line-through">${selectedProduct.originalPrice.toFixed(2)}</span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 uppercase tracking-wider">
                  Save 30%
                </span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">{selectedProduct.description}</p>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-3">
                  Color: <span className="font-normal text-neutral-500">{pdpColor}</span>
                </label>
                <div className="flex gap-3">
                  {selectedProduct.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setPdpColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        pdpColor === c ? 'border-black scale-110' : 'border-neutral-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold uppercase tracking-widest">Select Size (US)</label>
                  <button className="text-[10px] font-bold uppercase underline text-neutral-400">Size Guide</button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {selectedProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setPdpSize(sz)}
                      className={`py-3 text-xs font-mono font-bold border transition-colors ${
                        pdpSize === sz ? 'bg-black text-white border-black' : 'bg-white border-neutral-200 hover:border-black'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={() => addToCart(selectedProduct, pdpSize, pdpColor)}
                  className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> ADD TO BAG
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProduct, pdpSize, pdpColor);
                    setActiveTab('checkout');
                  }}
                  className="w-full py-4 bg-neutral-100 text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors"
                >
                  BUY IT NOW
                </button>
              </div>

              <div className="border-t border-neutral-200 pt-6 space-y-3 text-xs text-neutral-500">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-black" />
                  <span>Free Express Delivery on orders over $100</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-black" />
                  <span>30-Day Hassle-Free Returns Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-8">YOUR WISHLIST ({wishlist.length})</h1>
          {wishlist.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-neutral-300">
              <p className="text-xs uppercase tracking-widest text-neutral-400">Your wishlist is currently empty.</p>
              <button
                onClick={() => setActiveTab('shop')}
                className="mt-4 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest"
              >
                Explore Footwear
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCTS.filter((p) => wishlist.includes(p.id)).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={() => openProductDetails(product)}
                  onWishlist={() => toggleWishlist(product.id)}
                  isWishlisted={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'checkout' && (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-8">CHECKOUT</h1>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2 mb-4">1. Contact Information</h3>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 border border-neutral-300 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2 mb-4">2. Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="p-3 border border-neutral-300 text-xs outline-none" />
                  <input type="text" placeholder="Last Name" className="p-3 border border-neutral-300 text-xs outline-none" />
                  <input type="text" placeholder="Street Address" className="col-span-2 p-3 border border-neutral-300 text-xs outline-none" />
                  <input type="text" placeholder="City" className="p-3 border border-neutral-300 text-xs outline-none" />
                  <input type="text" placeholder="Postal Code" className="p-3 border border-neutral-300 text-xs outline-none" />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2 mb-4">3. Payment Method</h3>
                <div className="p-4 border border-neutral-300 bg-neutral-50 flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Encrypted Credit Card
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">VISA / MC / AMEX</span>
                </div>
                <input type="text" placeholder="Card Number" className="w-full p-3 border border-neutral-300 text-xs outline-none mb-3" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM / YY" className="p-3 border border-neutral-300 text-xs outline-none" />
                  <input type="text" placeholder="CVC" className="p-3 border border-neutral-300 text-xs outline-none" />
                </div>
              </div>

              <button
                onClick={() => alert('Order Placed Successfully! Thank you for choosing AURA.')}
                className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
              >
                PLACE ORDER (${cartTotal.toFixed(2)})
              </button>
            </div>

            <div className="bg-neutral-50 p-6 h-fit border border-neutral-200">
              <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2 mb-4">Summary</h3>
              <div className="space-y-3 text-xs mb-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{item.product.name}</p>
                      <p className="text-[10px] text-neutral-500">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <span className="font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="font-mono">${cartSubtotal.toFixed(2)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-amber-600 font-bold">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-mono">-${cartDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping</span>
                  <span className="font-mono">{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
                </div>
                <div className="flex justify-between font-black text-sm pt-2 border-t border-neutral-200">
                  <span>TOTAL</span>
                  <span className="font-mono">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {cartDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="bg-white w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl relative"
            >
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
                  <h3 className="text-sm font-bold uppercase tracking-widest">YOUR CART ({cartItemCount})</h3>
                  <button onClick={() => setCartDrawerOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-4 border-b border-neutral-100">
                  {cartSubtotal >= 100 ? (
                    <p className="text-[11px] font-bold text-amber-600 uppercase">You unlocked Free Express Shipping!</p>
                  ) : (
                    <p className="text-[11px] text-neutral-500">
                      Add <span className="font-bold text-black font-mono">${(100 - cartSubtotal).toFixed(2)}</span> more to unlock Free Shipping.
                    </p>
                  )}
                  <div className="w-full h-1 bg-neutral-100 mt-2 overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-300"
                      style={{ width: `${Math.min((cartSubtotal / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="divide-y divide-neutral-100 max-h-[50vh] overflow-y-auto">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-4 flex gap-4 items-center">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover bg-neutral-100" />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold uppercase">{item.product.name}</h4>
                        <p className="text-[10px] text-neutral-400">Size: {item.size}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateCartQty(idx, item.quantity - 1)} className="p-1 border border-neutral-200">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold">{item.quantity}</span>
                          <button onClick={() => updateCartQty(idx, item.quantity + 1)} className="p-1 border border-neutral-200">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                        <button onClick={() => removeFromCart(idx)} className="text-neutral-400 hover:text-red-500 mt-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div className="text-center py-12 text-neutral-400 text-xs uppercase tracking-widest">
                      Your bag is empty.
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO CODE (e.g. STEP30)"
                    className="flex-1 border border-neutral-200 px-3 py-2 text-xs outline-none font-mono uppercase"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') applyCouponCode((e.target as HTMLInputElement).value);
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement).value;
                      applyCouponCode(input);
                    }}
                    className="bg-black text-white px-4 py-2 text-xs font-bold uppercase"
                  >
                    Apply
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span className="font-mono">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-amber-600 font-bold">
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-mono">-${cartDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-sm pt-2 border-t">
                    <span>Total</span>
                    <span className="font-mono">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    setActiveTab('checkout');
                  }}
                  disabled={cart.length === 0}
                  className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-black text-white border-t border-neutral-800 pt-16 pb-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          <div className="space-y-4">
            <span className="text-2xl font-black font-mono">AURA</span>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Architectural modern footwear engineered for absolute movement and high-street expression.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-4">Shop</h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-light">
              <li className="hover:text-white cursor-pointer" onClick={() => { setSelectedCategory('Men'); setActiveTab('shop'); }}>Men's Drops</li>
              <li className="hover:text-white cursor-pointer" onClick={() => { setSelectedCategory('Women'); setActiveTab('shop'); }}>Women's Drops</li>
              <li className="hover:text-white cursor-pointer" onClick={() => { setSelectedCategory('Sneakers'); setActiveTab('shop'); }}>Sneakers</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('shop')}>New Arrivals</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-4">Client Care</h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-light">
              <li className="hover:text-white cursor-pointer">Shipping & Logistics</li>
              <li className="hover:text-white cursor-pointer">30-Day Return Portal</li>
              <li className="hover:text-white cursor-pointer">Size Guide & Fit</li>
              <li className="hover:text-white cursor-pointer">Contact Support</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-4">Newsletter</h4>
            <p className="text-xs text-neutral-400 mb-3">Join our community for early access to modern footwear drops.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter Email"
                className="bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-white outline-none w-full placeholder:text-neutral-600"
              />
              <button className="bg-white text-black px-4 text-xs font-bold uppercase">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-neutral-500 font-light">
          <p>© 2026 AURA Footwear Inc. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Share2 className="w-4 h-4 hover:text-white cursor-pointer" />
            <Globe className="w-4 h-4 hover:text-white cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({
  product,
  onOpen,
  onWishlist,
  isWishlisted
}: {
  product: Product;
  onOpen: () => void;
  onWishlist: () => void;
  isWishlisted: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative bg-white border border-neutral-100 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100 cursor-pointer" onClick={onOpen}>
        <img
          src={hovered ? product.hoverImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest">
            Best Seller
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlist();
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-black hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-black' : ''}`} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[9px] font-bold text-neutral-400 tracking-widest uppercase">{product.category}</span>
          <h3 onClick={onOpen} className="text-xs font-bold uppercase tracking-tight mt-1 cursor-pointer hover:underline truncate">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-amber-400 stroke-none" />
            <span className="text-[10px] font-mono text-neutral-500">{product.rating}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-black font-mono">${product.price.toFixed(2)}</span>
            <span className="text-[10px] text-neutral-400 line-through font-mono">${product.originalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={onOpen}
            className="text-[10px] font-bold tracking-widest uppercase underline text-black hover:text-neutral-500"
          >
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
}