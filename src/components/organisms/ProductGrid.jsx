import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import productService from "@/services/api/productService";

const ProductGrid = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getFeaturedProducts();
      setProducts(data || []);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error loading products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProducts} />;
  if (products.length === 0) return <Empty />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
<div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            {products.length === 12 ? 'Featured Products' : `Found ${products.length} Product${products.length !== 1 ? 's' : ''}`}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {products.length === 12 
              ? 'Discover our carefully curated selection of premium products designed to enhance your lifestyle.'
              : 'Discover products that match your search and filter criteria.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.Id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductGrid;