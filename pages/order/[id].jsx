import { Box, Button, Card, CircularProgress, Grid, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../../component/Layout';
import Link from '../../component/Link';
import { Store } from '../../utils/store';
import useStyles from '../../utils/style';
import { getError } from '../../utils/error';


function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'PAY_REQUEST':
            return { ...state, loadingPay: true };
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true };
        case 'PAY_FAIL':
            return { ...state, loadingPay: false, errorPay: action.payload };
        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false, errorPay: '' };
        case 'DELIVER_REQUEST':
            return { ...state, loadingDeliver: true };
        case 'DELIVER_SUCCESS':
            return { ...state, loadingDeliver: false, successDeliver: true };
        case 'DELIVER_FAIL':
            return { ...state, loadingDeliver: false, errorDeliver: action.payload };
        case 'DELIVER_RESET':
            return {
                ...state,
                loadingDeliver: false,
                successDeliver: false,
                errorDeliver: '',
            };
        default:
            state;
    }
}


const Order = ({ params }) => {

    const { state: { userInfo } } = useContext(Store);
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const router = useRouter();
    const classes = useStyles();
    const [{ loading, error, order, successPay, loadingDeliver, successDeliver }, dispatch] = useReducer(reducer, { loading: true, order: {}, error: '' });
    const { enqueueSnackbar } = useSnackbar();
    const orderId = params.id;

    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, isdelivered, deliveredAt, isPaid, paidAt } = order;

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: totalPrice,
                    },
                },
            ],
        });
    }


    const onApprove = (data, actions) => {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch({ type: 'PAY_REQUEST' });
                const { data } = await axios.put(
                    `/api/orders/${order.id}/pay`,
                    details,
                    {
                        headers: { authorization: `ETRDYUIDZEOIUSAYG${userInfo.token}` },
                    }
                );
                dispatch({ type: 'PAY_SUCCESS', payload: data });
                enqueueSnackbar('Order is paid', { variant: 'success' });
            } catch (err) {
                dispatch({ type: 'PAY_FAIL', payload: getError(err) });
                enqueueSnackbar(getError(err), { variant: 'error' });
            }
        });
    }
    function onError(err) {
        enqueueSnackbar(getError(err), { variant: 'error' });
    }

    async function deliverOrderHandler() {
        try {
            dispatch({ type: 'DELIVER_REQUEST' });
            const { data } = await axios.put(
                `/api/orders/${order._id}/deliver`,
                {},
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: 'DELIVER_SUCCESS', payload: data });
            enqueueSnackbar('Order is delivered', { variant: 'success' });
        } catch (err) {
            dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    }

    useEffect(() => {
        if (!userInfo) {
            return router.push('/login');
        }
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `IUJTRYUOLKJHLKKID${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        if (!order.id  || successPay || successDeliver ||(order.id && order.id != orderId) ) {
            fetchOrder();
            if (successPay) {
                dispatch({ type: 'PAY_RESET' });
            }
            if (successDeliver) {
                dispatch({ type: 'DELIVER_RESET' });
            }
        } else {
            const loadPaypalScript = async () => {
                const { data: clientId } = await axios.get('/api/keys/paypal', {
                    headers: { authorization: `TYUIOMZSCDUYZUAIL${userInfo.token}` },
                });
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD',
                    },
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            };
            loadPaypalScript();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order, successPay, successDeliver]);


    return (
        <Layout title="order details" >
            <Typography component="h1" variant='h1'>Order Details</Typography>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography className={classes.error}>{error}</Typography>
            ) : (
                <Grid container spacing={2} >
                    <Grid item xs={12} md={9}>
                        <List>
                            <ListItem>
                                <Typography component="h2" variant='h2'>Order id is : #{order.id}</Typography>
                            </ListItem>
                        </List>
                        <Card className={classes.section} >
                            <List>
                                <ListItem>
                                    <Typography component="h2" variant='h2'>Shipping Address</Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography component="p" variant='body2'>{`${shippingAddress.fullName}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}</Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography component="p" variant='body2'>Status : {isdelivered ? `Deliverd at : ${deliveredAt}` : `Not delivered`}</Typography>
                                </ListItem>
                            </List>
                        </Card>
                        <Card className={classes.section} >
                            <List>
                                <ListItem>
                                    <Typography component="h2" variant='h2'>Payment Method</Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography component="p" variant='body2'>{paymentMethod}</Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography component="p" variant='body2'>Status : {isPaid ? `Paid at : ${paidAt}` : `Not paid`}</Typography>
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
                                                {orderItems.map((item, index) =>
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <Image src={item.image} width={64} height={64} alt={item.name} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Link href={`/products/${item.slug}`}>{item.name}</Link>
                                                        </TableCell>
                                                        <TableCell align='right'>{item.quantity}</TableCell>
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
                                            <Typography>${taxPrice}</Typography>
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
                                            <Typography>${totalPrice}</Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                {!isPaid && (
                                    <ListItem>
                                        {isPending ? (
                                            <CircularProgress />
                                        ) : (
                                            <Box width="100%" >
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                ></PayPalButtons>
                                            </Box>
                                        )}
                                    </ListItem>
                                )}
                                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListItem>
                                        {loadingDeliver && <CircularProgress />}
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={deliverOrderHandler}
                                        >
                                            Deliver Order
                                        </Button>
                                    </ListItem>
                                )}
                            </List>
                        </Card>
                    </Grid>
                </Grid>)}
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    return { props: { params } };
}

// eslint-disable-next-line no-undef
export default dynamic(() => Promise.resolve(Order), { ssr: false });