import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/authOptions/authOptions";
import Head from "next/head";
import MyWishListContent from "@/components/MyWishListContent";

const MyWishlist = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className="text-center mt-10">Please log in to view your orders</div>;
  }

  const userEmail = session.user?.email;

  if (!userEmail) {
    return <div className="text-center mt-10 text-red-600">User email not found. Please contact support.</div>;
  }

  return (
    <>
      <Head>
        <title>{userEmail} - My Wishlist | TekzoBD</title>
        <meta name="description" content="View and manage your orders on TekzoBD." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="container mx-auto p-4">
        <MyWishListContent/>
      </div>
    </>
  );
};

export default MyWishlist;
