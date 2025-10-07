import Banner from "@/components/Banner";
import React from "react";
import ShopPage from "./(public)/shop/page";
import CategorySection from "@/components/HomeComponents/HomeCategorySection";
import TopRatedProducts from "@/components/HomeComponents/TopRatedProducts";
import ActiveOfferProducts from "@/components/HomeComponents/ActiveOfferProducts";
import { getHomeData } from "@/lib/allApiRequest/homeDataRequest/homeDataRequest";
import { CategoryType } from "@/Interfaces/categoryInterfaces";
import { ProductType } from "@/Interfaces/productInterfaces";
import Newsletter from "@/components/HomeComponents/NewsLetter";
import AboutUsSection from "@/components/HomeComponents/AboutUsSection";
import ClientOnly from "@/components/wrappers/ClientOnly";


interface HomeDataType {
  topRatedProducts: ProductType[];
  activeOfferProducts: ProductType[];
  bestSellingProducts: ProductType[];
  categories: CategoryType[];
}





const Home = async () => {
  let homeData: HomeDataType | null = null;

  try {
    const res = await getHomeData();
    homeData = res?.data as HomeDataType;
  } catch (error) {
    console.error("Home data fetch failed", error);
    // Optional: You can show a toast here or log to monitoring tools
  }

  const topRatedProducts = homeData?.topRatedProducts || [];
  const activeOfferProducts = homeData?.activeOfferProducts || [];
  const categories = homeData?.categories || [];

  return (
    <div className="min-h-screen ">
      
        <Banner />
    

      {/* searchParams এখন blank object পাঠানো হয়েছে */}
      <ShopPage  isHomePage={true}></ShopPage>

      {/* Only render if data is available, else skip section */}
      {categories.length > 0 && <CategorySection categories={categories} />}
      <ClientOnly>
        <AboutUsSection></AboutUsSection>
      </ClientOnly>

      {topRatedProducts.length > 0 && (
        <TopRatedProducts products={topRatedProducts} />
      )}

      {activeOfferProducts.length > 0 && (
        <ActiveOfferProducts products={activeOfferProducts} />
      )}
      <Newsletter></Newsletter>

      {/* Optional: if all data missing, show light fallback */}
      {!homeData && (
        <div className="text-center py-10 text-red-500">
          Some sections failed to load. Please try refreshing the page.
        </div>
      )}
    </div>
  );
};

export default Home;
