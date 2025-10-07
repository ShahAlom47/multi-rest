

interface Props {
  isHomePage?: boolean;
  searchParams?: Promise<{
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    category?: string;
    brand?: string;
    rating?: string;
    
    searchTrim?: string;
    stock?: "in-stock" | "out-of-stock";
  }>;
}

export default async function ShopPage({ searchParams, isHomePage }: Props) {
  const params = await searchParams;
console.log(params,isHomePage)

  return (
    <section className="max-w  mx-auto md:p-6 p-2 py-7  relative md:space-y-8 space-y-2">
    
    </section>
  );
}
