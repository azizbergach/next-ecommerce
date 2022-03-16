import { Button, Card, Grid, List, ListItem, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Box } from '@mui/system';
import Image from 'next/image';
import React, { useContext } from 'react'
import Layout from '../component/Layout'
import Link from '../component/Link';
import { Store } from '../utils/store';
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';


function Cart() {

    const router = useRouter();
    const {state: {userInfo, cart: {cartItems}  }, dispatch} = useContext(Store);
    const checkoutHandler = () => {
        if(!userInfo){
            router.push('/login?redirect=shipping');
        } else {
            router.push('/shipping');
    }
    }

  return (
    <Layout title="Cart">
        <Typography component="h1" variant='h1'>Cart</Typography>
        {cartItems.length === 0 ?
        <Box display="flex" alignItems="center">
            There is nothing in the cart yet ,{' '} <Link href="/">GO HOME PAGE</Link>
        </Box> :
        <Grid container spacing={1}>
            <Grid item md={9} xs={12} >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align='right'>Quantity</TableCell>
                                <TableCell align='right'>Price</TableCell>
                                <TableCell align='right'>Action</TableCell>
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
                                    <TableCell align='right'>
                                        <Select
                                        id={item.id}
                                        value={item.quantity}
                                        onChange={(e)=> { dispatch({type: "UPDATE_ITEM_QUANTITY", index, quantity: e.target.value}) }}
                                        >
                                            {[...Array(item.countInStock).keys()].map((x) => (
                                            <MenuItem key={x + 1} value={x + 1}>
                                            {x + 1}
                                            </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell align='right'>${item.price}</TableCell>
                                    <TableCell align='right'>
                                        <Button variant='outlined' color='error' onClick={() => { dispatch({type: "REMOVE_ITEM_FROM_CART", id: item.id}) } }>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item md={3} xs={12} >
            <Card>
                <List>
                    <ListItem>
                    <Typography component="h2" variant="h2" >Sub-Total</Typography>
                    </ListItem>
                    <ListItem>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Typography>Price</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>${cartItems.reduce((lastValue,item) => lastValue + item.price * item.quantity,0)}</Typography>
                                </Grid>
                            </Grid>
                    </ListItem>
                    <ListItem>
                        <Button variant='contained' color='success' fullWidth onClick={checkoutHandler} >CHECKOUT</Button>
                    </ListItem>
                </List>
            </Card>
            </Grid>
        </Grid>
        }
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });