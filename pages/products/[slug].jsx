import { Button, Card,CircularProgress,Grid, List, ListItem, Rating, TextField, Typography } from "@mui/material";
import Image from "next/image";
import Layout from "../../component/Layout";
import prisma from "../../lib/prisma";
import useStyles from "../../utils/style";
import Link from "../../component/Link";
import { useContext, useState } from "react";
import { Store } from "../../utils/store";
import { useRouter } from "next/router";
import axios from "axios";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/error";



export const getServerSideProps = async (context) => {
  
  const slug  = context.query.slug;

  const product = await prisma.products.findFirst({
      where: {
          slug
      }
  })

  const Reviews = await prisma.reviews.findMany({
    where: {
      slug,
    }
  });
 

  return {
    props: {
      product,
      Reviews
    },
  }
}


export default function Product({ product, Reviews }) {
  
    const { state: { cart: { cartItems }, userInfo }, dispatch } = useContext(Store);
    const router = useRouter()
    const classes = useStyles();
    const [reviews, setReviews] = useState(Reviews);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    
    const numReviews = reviews.length;
    const moyRating = (Math.ceil(reviews.reduce((a, b) => a + b.rating,0)*10 / numReviews))/10;

    const handleAddToCart = async () => {
        const existItem = cartItems.find((x) => x.id === product.id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product.slug}`);
        if (data.countInStock < quantity) {
          window.alert('Sorry. Product is out of stock');
          return;
        }
        dispatch({ type: 'ADD_TO_CART', item: { ...product, quantity } });
        router.push('/cart');
    }

    if(!product){
      return <Layout>Product not found</Layout>
    }

    // handle submit review
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `/api/products/${product.slug}/reviews`,
        {
          rating,
          comment,
          numReviews,
          moyRating
        },
        {
          headers: { authorization: `$3d4r-Lkm${userInfo.token}` },
        }
      );
      setLoading(false);
      enqueueSnackbar('Review submitted successfully', { variant: 'success' });
      setReviews(reviews => [...reviews,data]);
      setComment('');
      setRating(0);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };



    return (
        <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <Link href="/">
          back to products
        </Link>
      </div>
      <Grid container spacing={1} gridRow>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Rating value={moyRating} readOnly></Rating>
              <Link href="#reviews">
                <Typography>({numReviews} reviews)</Typography>
              </Link>
            </ListItem>
            <ListItem>
              <Typography> Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Grid container>
                  <Grid item xs={6}>
                      <Typography>
                        Price
                      </Typography>
                  </Grid>
                  <Grid item xs={6}>
                      <Typography>
                        ${product.price}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                  <Grid item xs={6}>
                      <Typography>
                        Status
                      </Typography>
                  </Grid>
                  <Grid item xs={6}>
                      <Typography>
                        {product.countInStock ? "In Stock" : "Out Of Stock"}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Button fullWidth variant="contained" disabled={product.countInStock === 0} color="primary" onClick={handleAddToCart} >
                      Add To Cart
                  </Button>
                </ListItem>
              </List>
            </Card>
        </Grid>
        </Grid>
        <List>
        <ListItem>
          <Typography name="reviews" id="reviews" variant="h2">
            Customer Reviews
          </Typography>
        </ListItem>
        {reviews.length === 0 && <ListItem>No review</ListItem>}
        {reviews.map((review) => (
          <ListItem key={review.id}>
            <Grid container>
              <Grid item className={classes.reviewItem}>
                <Typography>
                  <strong>{review.createdBy}</strong>
                </Typography>
                <Typography>{(new Date(Number(review.createdAt))).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item>
                <Rating value={review.rating} readOnly></Rating>
                <Typography>{review.comment}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem>
          {userInfo ? (
            <form onSubmit={submitHandler} className={classes.reviewForm}>
              <List>
                <ListItem>
                  <Typography variant="h2">Leave your review</Typography>
                </ListItem>
                <ListItem>
                  <TextField
                    multiline
                    variant="outlined"
                    fullWidth
                    name="review"
                    label="Enter comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>

                  {loading && <CircularProgress></CircularProgress>}
                </ListItem>
              </List>
            </form>
          ) : (
            <Typography variant="h2">
              Please{' '}
              <Link href={`/login?redirect=/products/${product.slug}`}>
                login
              </Link>{' '}
              to write a review
            </Typography>
          )}
        </ListItem>
      </List>
    </Layout>
    )}
