import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import productService from "@/services/api/productService";

const CategoryDropdown = ({ selectedCategory, onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await productService.getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    setIsOpen(false);
  };

  const handleAllProductsClick = () => {
    onCategorySelect("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-slate-600 hover:text-accent transition-colors duration-200 font-medium"
      >
        {selectedCategory || "Categories"}
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16}
          className="transition-transform duration-200"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50"
          >
            <button
              onClick={handleAllProductsClick}
              className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors duration-200 ${
                !selectedCategory ? 'text-accent font-medium' : 'text-slate-700'
              }`}
            >
              All Products
            </button>
            
            <div className="border-t border-slate-100 my-1" />
            
            {loading ? (
              <div className="px-4 py-2 text-slate-500 text-sm">Loading...</div>
            ) : (
              categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors duration-200 ${
                    selectedCategory === category ? 'text-accent font-medium' : 'text-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryDropdown;