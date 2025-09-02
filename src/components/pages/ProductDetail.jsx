import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useCart } from "@/hooks/useCart";
import productService from "@/services/api/productService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  // Mock product images (in real app, these would come from the product data)
  const productImages = [
    "/api/placeholder/600/600",
    "/api/placeholder/600/600",
    "/api/placeholder/600/600",
    "/api/placeholder/600/600"
  ];

  const sizes = ["S", "M", "L", "XL"];
  const colors = [
    { name: "Black", value: "#000000" },
    { name: "Navy", value: "#1e3a8a" },
    { name: "Gray", value: "#6b7280" },
    { name: "White", value: "#ffffff" }
  ];

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
const productData = await productService.getById(id);
        
        if (!productData) {
          setError("Product not found");
          return;
        }
        
        setProduct(productData);
        setSelectedSize(sizes[0]);
        setSelectedColor(colors[0].name);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const productWithVariants = {
      ...product,
      selectedSize,
      selectedColor,
      selectedQuantity: quantity
    };
    
    // Add multiple items based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(productWithVariants);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const toggleWishlist = () => {
    setIsWishlisted(prev => {
      const newState = !prev;
      toast.success(newState ? "Added to wishlist!" : "Removed from wishlist");
      return newState;
    });
  };

  const getBreadcrumbs = () => {
    if (!product) return [];
    return [
      { label: "Home", path: "/" },
      { label: product.category, path: `/categories?category=${product.category}` },
      { label: product.title, path: `/products/${product.Id}` }
    ];
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        title="Product Not Found"
        message={error}
        actionText="Back to Products"
        onAction={() => navigate("/")}
      />
    );
  }

  if (!product) {
    return (
      <Error 
        title="Product Not Found"
        message="The product you're looking for doesn't exist"
        actionText="Back to Products"
        onAction={() => navigate("/")}
      />
    );
  }

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center">
            {index === breadcrumbs.length - 1 ? (
              <span className="text-slate-900 font-medium">{crumb.label}</span>
            ) : (
              <>
                <Link 
                  to={crumb.path}
                  className="hover:text-accent transition-colors"
                >
                  {crumb.label}
                </Link>
                <ApperIcon name="ChevronRight" size={16} className="mx-2" />
              </>
            )}
          </div>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Image Gallery - 60% width on large screens */}
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative bg-slate-100 rounded-lg overflow-hidden aspect-square">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="error" size="md">Out of Stock</Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-accent ring-2 ring-accent/20' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Product Info Panel - 40% width on large screens */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Product Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="primary" size="sm">{product.category}</Badge>
                <button
                  onClick={toggleWishlist}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ApperIcon 
                    name="Heart" 
                    size={24} 
                    className={isWishlisted ? "text-red-500 fill-current" : "text-slate-400"}
                  />
                </button>
              </div>
              
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {product.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon
                      key={i}
                      name="Star"
                      size={16}
                      className={i < 4 ? "text-yellow-400 fill-current" : "text-slate-300"}
                    />
                  ))}
                  <span className="ml-2 text-sm text-slate-600">(4.2)</span>
                </div>
                <div className="h-4 w-px bg-slate-300" />
                <Badge 
                  variant={product.inStock ? "success" : "error"}
                  size="sm"
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              <div className="text-3xl font-bold text-accent mb-6">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-3">
                Size: <span className="font-semibold">{selectedSize}</span>
              </h3>
              <div className="flex space-x-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border-2 rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? 'border-accent bg-accent text-white'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-3">
                Color: <span className="font-semibold">{selectedColor}</span>
              </h3>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      selectedColor === color.name
                        ? 'border-accent ring-2 ring-accent/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                  >
                    {color.value === "#ffffff" && (
                      <div className="w-full h-full rounded-full border border-slate-200" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ApperIcon name="Minus" size={16} />
                </button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-50"
                >
                  <ApperIcon name="Plus" size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              variant="primary"
              size="xl"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </Button>

            {/* Product Description */}
            <div>
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="flex items-center justify-between w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <h3 className="text-sm font-medium text-slate-900">Product Description</h3>
                <ApperIcon 
                  name={showDescription ? "ChevronUp" : "ChevronDown"} 
                  size={16}
                  className="text-slate-600"
                />
              </button>
              
              {showDescription && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 p-4 bg-white border border-slate-200 rounded-lg"
                >
                  <p className="text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;