import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import CheckoutWizard from '../component/CheckoutWizard';
import Layout from '../component/Layout';
import { Store } from '../utils/store';

const Shipping = () => {

    const { handleSubmit, control, setValue, formState : {errors} } = useForm();
    const { state: {cart: {shippingAddress}, userInfo } , dispatch } = useContext(Store);
    const router = useRouter();
    const submitHandler = ({ fullName, address, city, postalCode, country }) => {
        dispatch({type: "SAVE_SHIPPING_ADDRESS", shippingAddress: { fullName, address, city, postalCode, country } });
        router.push('/payment');
    }
    useEffect(() => {
      if(!userInfo){
        router.push('/login?redirect=shipping');
      }
        setValue('fullName', shippingAddress.fullName)
        setValue('address', shippingAddress.address)
        setValue('city', shippingAddress.city)
        setValue('postalCode', shippingAddress.postalCode)
        setValue('country', shippingAddress.country)
    },[]);

    return (
        <Layout title="Shipping Adress" >
        <CheckoutWizard activeStep={1} />
        <form onSubmit={handleSubmit(submitHandler)}>
        <List>
            <ListItem>
                <Typography component="h1" variant='h1' >Shipping Address</Typography>
            </ListItem>
            <ListItem>
            <Controller
                name="fullName"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  pattern: /^\w+\s\w+/
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="fullName"
                    label="full name"
                    error={Boolean(errors.fullName)}
                    helperText={
                      errors.fullName
                        ? errors.fullName.type === 'pattern'
                          ? 'please enter your fullName'
                          : 'fullName is required'
                        : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>
            <ListItem>
            <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 4,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="address"
                    label="address"
                    error={Boolean(errors.address)}
                    helperText={
                      errors.address
                        ? errors.address.type === 'minLength'
                          ? 'Address is not valid'
                          : 'Address is required'
                        : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>
            <ListItem>
            <Controller
                name="city"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 4,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="city"
                    label="City"
                    error={Boolean(errors.city)}
                    helperText={
                      errors.city?
                      errors.city.type === "minLength" ?
                          'city is not valid'
                        : 'city required' : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>
            <ListItem>
            <Controller
                name="postalCode"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  min: 4,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="postalCode"
                    label="postal code"
                    error={Boolean(errors.postalCode)}
                    helperText={
                      errors.postalCode
                        ? errors.postalCode.type === 'min'
                          ? 'postal code is not valid'
                          : 'postal code is required'
                        : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>
            <ListItem>
            <Controller
                name="country"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="country"
                    label="country"
                    error={Boolean(errors.country)}
                    helperText={
                      errors.country? 'country is required' : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>
            <ListItem>
            <Button type="submit" variant="contained" fullWidth color="primary">next step</Button>
            </ListItem>
        </List>
        </form>
        </Layout>
    );
}

export default Shipping;
