import { Button, Card, FormControl, FormControlLabel, List, ListItem, Radio, RadioGroup, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../component/CheckoutWizard';
import Layout from '../component/Layout';
import { Store } from '../utils/store';

const Payment = () => {

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const { state: { cart: { shippingAddress, paymentMethod } } ,dispatch } = useContext(Store);
    const [method, setMethod] = useState(paymentMethod);
    const router = useRouter();
    const submitHandler = (e) => {
        e.preventDefault();
        closeSnackbar();
        if(method){
        dispatch({type: "SAVE_PAYMENT_METHOD", method});
        router.push('/placeorder');
        } else {
            enqueueSnackbar("payment method is requiured", {variant: "error"} )
        }
    }
    useEffect(() => {
        if(!shippingAddress){
            router.push('/shipping')
        }
    },[]);

    return (
        <Layout title="Payment Method" >
            <Card sx={{maxWidth: 1000}} >
            <CheckoutWizard activeStep={2} />
            <form onSubmit={submitHandler}>
                <List> 
                    <ListItem>
                        <Typography component="h1" variant='h1'>Payment Method</Typography>
                    </ListItem>
                    <ListItem>
                    <FormControl component="fieldset" >
                        <RadioGroup
                        aria-label='payment method'
                        name='paymentMethod'
                        value={ method }
                        onChange={e => setMethod(e.target.value)}
                        >
                            <FormControlLabel
                            label="paypal"
                            value='paypal'
                            control={<Radio />}
                            />
                            <FormControlLabel
                            label="stripe"
                            value='stripe'
                            control={<Radio />}
                            />
                            <FormControlLabel
                            label="cash"
                            value='cash'
                            control={<Radio />}
                            />
                        </RadioGroup>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <Button type="submit" variant="contained" fullWidth color="primary">next step</Button>
                    </ListItem>
                    <ListItem>
                    <Button variant="contained" fullWidth color="secondary" onClick={() => router.push('/shipping')} >Back</Button>
                    </ListItem>
                </List>
            </form>
            </Card>
        </Layout>
    );
}

export default Payment;
