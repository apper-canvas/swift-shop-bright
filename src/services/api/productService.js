import { toast } from "react-toastify";

class ProductService {
  constructor() {
    this.tableName = 'product_c';
    this.apperClient = null;
  }

  getApperClient() {
    if (!this.apperClient) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    return this.apperClient;
  }

  mapDatabaseToUI(dbProduct) {
    if (!dbProduct) return null;
    return {
      Id: dbProduct.Id,
      title: dbProduct.title_c || '',
      price: dbProduct.price_c || 0,
      image: dbProduct.image_c || '',
      category: dbProduct.category_c || '',
      inStock: dbProduct.in_stock_c || false,
      description: dbProduct.description_c || ''
    };
  }

  mapUIToDatabase(uiProduct) {
    const mapped = {};
    if (uiProduct.title !== undefined) mapped.title_c = uiProduct.title;
    if (uiProduct.price !== undefined) mapped.price_c = uiProduct.price;
    if (uiProduct.image !== undefined) mapped.image_c = uiProduct.image;
    if (uiProduct.category !== undefined) mapped.category_c = uiProduct.category;
    if (uiProduct.inStock !== undefined) mapped.in_stock_c = uiProduct.inStock;
    if (uiProduct.description !== undefined) mapped.description_c = uiProduct.description;
    return mapped;
  }

  async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Error fetching products: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      return response.data ? response.data.map(product => this.mapDatabaseToUI(product)) : [];
    } catch (error) {
      console.error(`Error fetching products: ${error?.response?.data?.message || error.message}`);
      toast.error("Failed to load products. Please try again.");
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Error fetching product ${id}: ${response.message}`);
        return null;
      }
      
      return this.mapDatabaseToUI(response.data);
    } catch (error) {
      console.error(`Error fetching product ${id}: ${error?.response?.data?.message || error.message}`);
      return null;
    }
  }

  async getByCategory(category) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Error fetching products by category: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      return response.data ? response.data.map(product => this.mapDatabaseToUI(product)) : [];
    } catch (error) {
      console.error(`Error fetching products by category: ${error?.response?.data?.message || error.message}`);
      return [];
    }
  }

  async searchProducts(query) {
    if (!query || !query.trim()) {
      return await this.getAll();
    }
    
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "title_c", "operator": "Contains", "values": [query.trim()]}
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {"fieldName": "category_c", "operator": "Contains", "values": [query.trim()]}
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {"fieldName": "description_c", "operator": "Contains", "values": [query.trim()]}
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Error searching products: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      return response.data ? response.data.map(product => this.mapDatabaseToUI(product)) : [];
    } catch (error) {
      console.error(`Error searching products: ${error?.response?.data?.message || error.message}`);
      return [];
    }
  }

  async getFeaturedProducts(limit = 12) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Error fetching featured products: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      return response.data ? response.data.map(product => this.mapDatabaseToUI(product)) : [];
    } catch (error) {
      console.error(`Error fetching featured products: ${error?.response?.data?.message || error.message}`);
      return [];
    }
  }

  async getProductVariants(id) {
    try {
      const product = await this.getById(id);
      if (!product) return null;
      
      // Mock variant data - in real app this would come from related database tables
      return {
        sizes: ["S", "M", "L", "XL"],
        colors: [
          { name: "Black", value: "#000000" },
          { name: "Navy", value: "#1e3a8a" },
          { name: "Gray", value: "#6b7280" },
          { name: "White", value: "#ffffff" }
        ],
        images: [
          product.image,
          product.image,
          product.image,
          product.image
        ]
      };
    } catch (error) {
      console.error(`Error fetching product variants: ${error?.response?.data?.message || error.message}`);
      return null;
    }
  }

  async getCategories() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [{"field": {"Name": "category_c"}}],
        groupBy: ["category_c"],
        orderBy: [{"fieldName": "category_c", "sorttype": "ASC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Error fetching categories: ${response.message}`);
        return [];
      }
      
      const categories = response.data ? response.data.map(item => item.category_c).filter(Boolean) : [];
      return [...new Set(categories)].sort();
    } catch (error) {
      console.error(`Error fetching categories: ${error?.response?.data?.message || error.message}`);
      return [];
    }
  }

  async filterProducts({ searchQuery, category, sortBy, priceRange }) {
    try {
      const client = this.getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}}
        ],
        where: [],
        whereGroups: [],
        orderBy: []
      };

      // Build where conditions
      if (category && category.trim()) {
        params.where.push({"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]});
      }

      if (priceRange && (priceRange.min > 0 || priceRange.max < 500)) {
        params.where.push({"FieldName": "price_c", "Operator": "GreaterThanOrEqualTo", "Values": [priceRange.min]});
        params.where.push({"FieldName": "price_c", "Operator": "LessThanOrEqualTo", "Values": [priceRange.max]});
      }

      // Add search query if provided
      if (searchQuery && searchQuery.trim()) {
        params.whereGroups.push({
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "title_c", "operator": "Contains", "values": [searchQuery.trim()]}
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {"fieldName": "category_c", "operator": "Contains", "values": [searchQuery.trim()]}
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {"fieldName": "description_c", "operator": "Contains", "values": [searchQuery.trim()]}
              ],
              "operator": "OR"
            }
          ]
        });
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          params.orderBy = [{"fieldName": "price_c", "sorttype": "ASC"}];
          break;
        case 'price-high':
          params.orderBy = [{"fieldName": "price_c", "sorttype": "DESC"}];
          break;
        case 'newest':
          params.orderBy = [{"fieldName": "Id", "sorttype": "DESC"}];
          break;
        case 'popular':
        default:
          params.orderBy = [{"fieldName": "Id", "sorttype": "ASC"}];
          break;
      }
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Error filtering products: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      return response.data ? response.data.map(product => this.mapDatabaseToUI(product)) : [];
    } catch (error) {
      console.error(`Error filtering products: ${error?.response?.data?.message || error.message}`);
      return [];
    }
  }
}

export default new ProductService();