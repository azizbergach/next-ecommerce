/* eslint-disable @next/next/no-img-element */
import Layout from "../component/Layout";
import prisma from "../lib/prisma";
import Product from "../component/Product";
import { Divider } from "@mui/material";
import Link from "../component/Link";
import useStyles from "../utils/style";



export const getServerSideProps = async () => {

  const featuredProducts = await prisma.products.findMany({
        where: {
          isFeatured: true
        },
        take: 3
  });

  const topRatedProducts = await prisma.products.findMany({
    take: 10
  })

  return {
    props: {
      featuredProducts, 
      topRatedProducts
    }
  }
}


export default function Home({ featuredProducts, topRatedProducts }) {

  const classes = useStyles();

  return (
    <Layout title="Home Page" >
      {featuredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
          >
              <img
                src={product.featuredImage}
                alt={product.name}
                className={classes.featuredImage}
              />
          </Link>
        ))}
      <Divider variant="h2" className={ classes.Divider } >Popular Products</Divider>
            <Product
              products={topRatedProducts}
            />
    </Layout>
  )
}
