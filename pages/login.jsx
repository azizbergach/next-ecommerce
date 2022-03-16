import { Button, Card, List, ListItem, TextField, Typography } from '@mui/material';
import { Controller, useForm } from "react-hook-form";
import Layout from '../component/Layout';
import Link from '../component/Link';
import useStyles from '../utils/style';
import {useRouter} from 'next/router';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { Store } from '../utils/store';
import { useSnackbar } from 'notistack';
import { Box } from '@mui/system';

export default function Login() {

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const { state: {userInfo} ,dispatch } = useContext(Store);
    const router = useRouter();
    const {redirect} = router.query;
    const { handleSubmit, control, formState : {errors} } = useForm();
    const classes = useStyles();
    const submitHandler = async ({email,password}) => {
      closeSnackbar();
      try {
        const { data } =  await axios.post("/api/account/login", {email,password});
        dispatch({type: "USER_LOGIN", data});
        router.push(redirect || '/');
      } catch(err){
        enqueueSnackbar(err.response.data.message || err.message, {variant: "error"});
      }
    }
    useEffect(() => {
      if(userInfo){
        router.push(redirect || '/');
      }
    },[]);

    return (
        <Layout title="Login">
          <Box maxWidth={1000} margin="auto" >
        <Card raised >
        <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
          <List>
            <ListItem>
            <Typography component="h1" variant="h1">
            Login
          </Typography>
            </ListItem>
            <ListItem>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="Email"
                    inputProps={{ type: 'email' }}
                    error={Boolean(errors.email)}
                    helperText={
                      errors.email
                        ? errors.email.type === 'pattern'
                          ? 'Email is not valid'
                          : 'Email is required'
                        : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>
            <ListItem>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 6,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="password"
                    label="Password"
                    inputProps={{ type: 'password' }}
                    error={Boolean(errors.password)}
                    helperText={
                      errors.password
                        ? errors.password.type === 'minLength'
                          ? 'Password length is more than 5'
                          : 'Password is required'
                        : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>
            <ListItem>
              <Button type="submit" variant="contained" fullWidth color="primary">Login</Button>
            </ListItem>
            <ListItem>
              Don&apos;t have an account? &nbsp;
              <Link href={`/signup?redirect=${redirect || '/'}`} passHref>Sign up</Link>
            </ListItem>
          </List>
        </form>
        </Card>
        </Box>
      </Layout>
   
            );
        }
