import { useEffect, useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import CircularCategoryList from '../components/home/CircularCategoryList';
import PromoBanners from '../components/home/PromoBanners';
import OurStory from '../components/home/OurStory';
import ProductCarousel from '../components/home/ProductCarousel';
import FeaturedBanner from '../components/home/FeaturedBanner';
import FeedbackSection from '../components/home/FeedbackSection';
import { productApi } from '../api/productApi';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await productApi.getFeatured();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    // Split products for the two different carousels for visual variety
    const newArrivals = products.slice(0, 6);
    const featuredProducts = products.length > 6 ? products.slice(6, 12) : products;

    return (
        <div className="bg-white min-h-screen font-sans overflow-hidden">
            {/* 1. Hero Section */}
            <HeroSection />

            {/* 2. Best Delivered Categories (Circular) */}
            <CircularCategoryList />

            {/* 3. Juicy / Healthy Promo Banners */}
            <PromoBanners />

            {/* 4. Our Story */}
            <OurStory />

            {/* 5. Featured Products Carousel */}
            <section className="bg-[#f8fafc]/50">
                <div className="container mx-auto px-4">
                    <ProductCarousel
                        title="Featured Product"
                        products={featuredProducts}
                        isLoading={isLoading}
                        viewAllLink="/products"
                    />
                </div>
            </section>





            {/* 7. Footer features strip (Fast Delivery, etc) */}
            <FeaturedBanner />
            {/* 6. Feedback Section */}
            <FeedbackSection />
        </div>
    );
}
