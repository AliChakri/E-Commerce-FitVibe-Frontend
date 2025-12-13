
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const ProductFilters = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sort, setSort] = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const allCategories = [...new Set(products.map((p) => p.category))];

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description &&
          p.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        categories.length === 0 || categories.includes(p.category);

      const matchesPrice =
        p.price >= priceRange[0] && p.price <= priceRange[1];

      const matchesStock = !inStockOnly || p.inStock;

      const matchesRating = p.rating >= minRating;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesStock &&
        matchesRating
      );
    })
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0; // newest (assuming backend sends in newest order)
    });

  return (
    <div className="flex gap-8">
      {/* Sidebar Filters */}
      <div className="w-72 bg-white shadow p-4 rounded-xl space-y-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Categories */}
        <div>
          <h3 className="font-medium mb-2">Categories</h3>
          <div className="space-y-1">
            {allCategories.map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-2">Price Range (${priceRange[0]} - ${priceRange[1]})</h3>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
          />
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
          />
        </div>

        {/* Stock Status */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          In Stock Only
        </label>

        {/* Rating */}
        <div>
          <h3 className="font-medium mb-2">Minimum Rating</h3>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full border rounded-lg p-2"
          >
            <option value={0}>All ratings</option>
            <option value={4}>4 ★ & up</option>
            <option value={3}>3 ★ & up</option>
            <option value={2}>2 ★ & up</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <h3 className="font-medium mb-2">Sort by</h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 grid grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="border rounded-xl shadow hover:shadow-lg p-4 transition"
          >
            <img src={p.image} alt={p.name} className="h-40 w-full object-cover rounded" />
            <h3 className="mt-2 font-semibold">{p.name}</h3>
            <p className="text-gray-600">${p.price}</p>
            <p className="text-sm text-yellow-500">★ {p.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFilters;
