import { useCart } from "@/hooks/useCart";
import React, { useEffect, useState } from "react";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterBar from "@/components/molecules/FilterBar";
import Error from "@/components/ui/Error";

const Homepage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
// Products are now loaded through ProductGrid component with database integration
      // No direct API calls needed here as ProductGrid handles all data fetching
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearFilters = () => {
    setSortBy('name');
    setPriceRange([0, 1000]);
  };
  
  const activeFiltersCount = (sortBy !== 'name' ? 1 : 0) + 
    (priceRange[0] !== 0 || priceRange[1] !== 1000 ? 1 : 0);
  
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-blue-600 bg-clip-text text-transparent">
              Shop with Confidence
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Discover premium products curated for modern living. Experience seamless shopping with instant cart updates and premium design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-3 text-lg">
              Start Shopping
            </button>
            <button className="btn-secondary px-8 py-3 text-lg">
              View Categories
            </button>
          </div>
</div>
      </section>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FilterBar
          sortBy={sortBy}
          priceRange={priceRange}
          onSortChange={setSortBy}
          onPriceRangeChange={setPriceRange}
          onClearFilters={handleClearFilters}
          activeFiltersCount={activeFiltersCount}
        />
      </div>

      {/* Products Section */}
      <ProductGrid 
        onAddToCart={addToCart}
        products={products}
        loading={loading}
        error={error}
        onRetry={loadProducts}
      />

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Swift Shop</h3>
              <p className="text-slate-300">
                Your premier destination for quality products and exceptional shopping experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Newsletter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Social Media</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-300">
            <p>&copy; 2024 Swift Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;