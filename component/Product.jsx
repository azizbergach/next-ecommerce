import { Button, Card, CardActions, CardContent, CardMedia, Grid, Rating, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext } from "react";
import Link from "../component/Link";
import { Store } from "../utils/store";





export default function Product({ products }) {

  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product.slug}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', item: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Grid container spacing={2} >
  { products.map( (product,index) =>
  <Grid item xs={12} sm={6} md={3} key={index} >
    <Card>
    <Link href={`/products/${product.slug}`} >
      <CardMedia component="img" image={product.image} />
      <CardContent>
      <Typography gutterBottom variant="h5" component="h2">
            {product.name}
      </Typography>
      <Typography component="p" variant="body2" color="textSecondary" >
        {product.description}
      </Typography>
      </CardContent>
      </Link>
      <Box display="flex" >
      <Rating value={1} readOnly emptyIcon size="small" ></Rating>
      <Typography>{product.rating}</Typography>
      </Box>
      <CardActions>
      <Typography>${product.price}</Typography>
        <Button size="small" color="primary" onClick={() => addToCartHandler(product)} >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  </Grid>)}
  </Grid>
  )
}
