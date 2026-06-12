import { Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 1,
    title: "10 Essential Plumbing Checks Before Winter",
    excerpt: "Winter in Egypt can be tough on pipes. Learn the top 10 things you need to check before the cold season starts to avoid costly repairs.",
    category: "Plumbing",
    date: "Oct 15, 2026",
    author: "Baytak Team",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "How to Choose the Right AC for Your Home",
    excerpt: "With summer approaching, choosing the right AC capacity is crucial. Read our complete guide on sizing and energy efficiency.",
    category: "Cooling",
    date: "Sep 28, 2026",
    author: "Karim Hassan",
    image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "DIY vs. Professional: When to Call an Electrician",
    excerpt: "Some electrical tasks are safe for DIY, but others can be deadly. Learn when it's time to put down the tools and call a pro.",
    category: "Electrical",
    date: "Sep 10, 2026",
    author: "Mostafa Electric",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "5 Simple Ways to Transform Your Living Room",
    excerpt: "You don't need a massive budget to breathe new life into your living space. A little paint and carpentry can go a long way.",
    category: "Home Improvement",
    date: "Aug 22, 2026",
    author: "Baytak Team",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "The Ultimate Deep Cleaning Checklist",
    excerpt: "Tackling a full house deep clean? Follow our room-by-room checklist to make sure you don't miss a single spot.",
    category: "Cleaning",
    date: "Aug 05, 2026",
    author: "Sparkle Co.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Pest Prevention Tips for the Summer",
    excerpt: "Keep ants, roaches, and mosquitoes out of your home this summer with these effective, eco-friendly prevention strategies.",
    category: "Pest Control",
    date: "Jul 18, 2026",
    author: "Baytak Team",
    image: "https://images.unsplash.com/photo-1587823999616-2a8d54238719?q=80&w=1932&auto=format&fit=crop"
  }
];

export default function Blog() {
  const featuredPost = BLOG_POSTS[0];
  const regularPosts = BLOG_POSTS.slice(1);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">Tips & Tricks</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Baytak Blog</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Expert advice, maintenance tips, and home improvement guides to keep your home running smoothly.
          </p>
        </div>

        {/* Featured Post (Top) */}
        <div className="mb-16 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col lg:flex-row group hover:shadow-md transition-shadow">
          <div className="lg:w-1/2 relative h-64 lg:h-auto overflow-hidden bg-slate-200">
            <img 
              src={featuredPost.image} 
              alt={featuredPost.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
              Featured Tip
            </div>
          </div>
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <span className="text-cyan-600 font-bold text-sm tracking-wide uppercase mb-3">
              {featuredPost.category}
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4 transition-colors">
              {featuredPost.title}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {featuredPost.date}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {featuredPost.author}</span>
            </div>
          </div>
        </div>

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              <div className="relative h-56 overflow-hidden bg-slate-200">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-cyan-50 text-cyan-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <div className="bg-slate-100 p-1.5 rounded-full">
                      <User className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    {post.author}
                  </div>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {post.date}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}