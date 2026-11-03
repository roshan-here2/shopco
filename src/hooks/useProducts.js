import { useState, useEffect } from "react";
import { productsAPI } from "../api/client";
import staticProducts from "../components/data/productsd";

function normalize(p) {
  return {
    id: p._id || p.id,
    name: p.name,
    category: p.category,
    images: p.images?.length ? p.images : ["/images/cart-1.png"],
    rating: p.rating ?? 4.5,
    ratingCount: p.ratingCount ?? 0,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    description: p.description || "",
    breadcrumbs: p.breadcrumbs?.length
      ? p.breadcrumbs
      : ["Home", p.category || "Shop", p.name],
    colors: p.colors?.length ? p.colors : [{ name: "Default", hex: "#111111" }],
    sizes: p.sizes?.length ? p.sizes : ["Small", "Medium", "Large", "X-Large"],
    reviews: p.reviews || [],
    stock: p.stock,
  };
}

export function useProducts(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (category) params.category = category;
        params.limit = 50;
        const data = await productsAPI.getAll(params);
        if (!cancelled) {
          const list = (data.products || []).map(normalize);
          setProducts(list.length ? list : fallback(category));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setProducts(fallback(category));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [category]);

  return { products, loading, error };
}

function fallback(category) {
  if (!category) return staticProducts.map((p) => ({ ...p, id: p.id }));
  return staticProducts
    .filter((p) => p.category === category)
    .map((p) => ({ ...p, id: p.id }));
}

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // Try API by id (Mongo ObjectId)
        const data = await productsAPI.getOne(productId);
        if (!cancelled && data.product) {
          setProduct(normalize(data.product));
          return;
        }
      } catch (_) {
        // fallback: search by name or static id
      }

      try {
        const data = await productsAPI.getAll({ limit: 100 });
        const list = (data.products || []).map(normalize);
        const found =
          list.find((p) => String(p.id) === String(productId)) ||
          list.find((p) => String(p.id) === String(productId));
        if (!cancelled && found) {
          setProduct(found);
          return;
        }
      } catch (_) {}

      // static fallback
      const staticFound = staticProducts.find(
        (p) => String(p.id) === String(productId)
      );
      if (!cancelled) setProduct(staticFound || null);
    }

    load().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return { product, loading };
}
