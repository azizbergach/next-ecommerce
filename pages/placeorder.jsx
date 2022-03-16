import { Button, Card, CircularProgress, Grid, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../component/CheckoutWizard';
import Layout from '../component/Layout';
import Link from '../component/Link';
import { Store } from '../utils/store';
import useStyles from '../utils/style';

const Placeorder = () => {

    const {state: { cart: { shippingAddress: { fullName, address, city, postalCode, country }, paymentMethod, cartItems }, userInfo }, dispatch } = useContext(Store);
    const classes = useStyles();
    const [loadig, setLoadig] = useState(false);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const router = useRouter();
    const itemsPrice = Math.round(cartItems.reduce((lastValue,item) => lastValue + item.price * item.quantity,0));
    const tax = Math.round(itemsPrice * 0.15);
    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const total = itemsPrice + tax + itemsPrice ;
    const orderHandler = async () => {
        closeSnackbar();
        setLoadig(true);
        try {
            const { data } = await axios.post("/api/orders/placeorder", { shippingAddress: { fullName, address, city, postalCode, country }, paymentMethod, cartItems, itemsPrice, tax, shippingPrice, total }, { headers: { authorization: `marshmelo${userInfo.token}` } } );
            if(data){
                dispatch({ type: "CLEAR_CART" });
                setLoadig(false);
                router.push(`/order/${data}`)
            }
        } catch (err) {
            setLoadig(false);
            enqueueSnackbar( err.message, {variant: "error"});
        }
    }
    useEffect(() => {
        if(!paymentMethod){
            router.push('/payment');
        }
        if(cartItems.length === 0){
            router.push("/cart");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <Layout title="place order">
            <CheckoutWizard activeStep={3} />
            <Typography component="h1" variant='h1'>Place Order</Typography>
            <Grid container spacing={2} >
                <Grid item xs={12} md={9}>
                    <Card className={classes.section} >
                    <List>
                        <ListItem>
                            <Typography component="h2" variant='h2'>Shipping Address</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography component="p" variant='body2'>{ `${fullName}, ${address}, ${city}, ${postalCode}, ${country}` }</Typography>
                        </ListItem>
                    </List>
                    </Card>
                    <Card className={classes.section} >
                    <List>
                        <ListItem>
                            <Typography component="h2" variant='h2'>Payment Method</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography component="p" variant='body2'>{ paymentMethod }</Typography>
                        </ListItem>
                    </List>
                    </Card>
                    <Card className={classes.section} >
                    <List>
                        <ListItem>
                            <Typography component="h2" variant='h2'>Order Items</Typography>
                        </ListItem>
                        <ListItem>
                        <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align='right'>Quantity</TableCell>
                                <TableCell align='right'>Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartItems.map((item,index)=>
                                <TableRow key={index}>
                                    <TableCell>
                                        <Image src={item.image} width={64} height={64} alt={item.name} />
                                    </TableCell>
                                    <TableCell>
                                    <Link href={`/products/${item.slug}`}>{item.name}</Link>
                                    </TableCell>
                                    <TableCell align='right'>{ item.quantity }</TableCell>
                                    <TableCell align='right'>${item.price}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                        </ListItem>
                    </List>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                <Card>
                <List>
                    <ListItem>
                    <Typography component="h2" variant="h2" >Order Summary</Typography>
                    </ListItem>
                    <ListItem>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Typography>Items cost</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>${itemsPrice}</Typography>
                                </Grid>
                            </Grid>
                    </ListItem>
                    <ListItem>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Typography>Tax</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>${tax}</Typography>
                                </Grid>
                            </Grid>
                    </ListItem>
                    <ListItem>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Typography>Shipping</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>${shippingPrice}</Typography>
                                </Grid>
                            </Grid>
                    </ListItem>
                    <ListItem>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Typography>Total</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>${total}</Typography>
                                </Grid>
                            </Grid>
                    </ListItem>
                    <ListItem>
                        <Button variant='contained' color='primary' fullWidth onClick={orderHandler} >PLACE ORDER</Button>
                    </ListItem>
                    { loadig && <ListItem><CircularProgress /></ListItem> }
                </List>
            </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

// eslint-disable-next-line no-undef
export default dynamic(() => Promise.resolve(Placeorder), { ssr: false });