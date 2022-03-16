import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import Link from '../component/Link';
import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../component/Layout';
import {useRouter} from 'next/router';
import axios from 'axios';
import { Store } from '../utils/store';
import { useSnackbar } from 'notistack';


export default function Signup() {

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const { state: {userInfo} ,dispatch } = useContext(Store);
    const router = useRouter();
    const {redirect} = router.query;
    const {handleSubmit, control, formState : {errors}} = useForm();
    const submitHandler = async ({username,email,password,confirmPassword}) => {
        closeSnackbar();
        if(password !== confirmPassword){
            enqueueSnackbar("password don't match", {variant: "error"});
            return; 
        }
        try {
            const { data } = await axios.post("/api/account/signup", {username,email,password});
            dispatch({type: "USER_LOGIN", data});
            router.push(redirect || '/');
        } catch (err) {
            enqueueSnackbar(err.response.data.message || err.message, {variant: "error"});         
        }
        
    }
    useEffect(() => {
        if(userInfo){
          router.push('/');
        }
      },[]);

  return (
    <Layout title="Sign up">
        <form onSubmit={handleSubmit(submitHandler)} >
            <Typography component="h1" variant='h1'>
                Sign Up
            </Typography>
            <List>
            <ListItem>
            <Controller
            name="username"
            control={control}
            rules={{
            required: true,
            pattern: /^[a-zA-Z_]+$/
            }}
            render={({field}) =>
                <TextField 
                fullWidth
                error={Boolean(errors.username)}
                label="userame"
                inputProps={{type: 'text'}}
                id="username"
                variant='outlined'
                helperText={
                    errors.username? errors.username.type === 'pattern' ? "username should contains only \"A-Z , a-z\" and \"_\"" : "username is required": ''
                }
                {...field}
                />
            }
            />
            </ListItem>
            <ListItem>
            <Controller
            name="email"
            control={control}
            rules={{
            required: true,
            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            }}
            render={({field}) =>
                <TextField 
                fullWidth
                error={Boolean(errors.email)}
                label="Email"
                inputProps={{type : 'email'}}
                id="email"
                variant='outlined'
                helperText={
                    errors.email? errors.email.type === 'pattern' ? "Invalid Email" : "Email is required": ''
                }
                {...field}
                />
            }
            />
            </ListItem>
            <ListItem>
            <Controller
            name="password"
            control={control}
            rules={{
            required: true,
            minLength: 4
            }}
            render={({field}) =>
                <TextField 
                fullWidth
                error={Boolean(errors.password)}
                label="password"
                inputProps={{type : 'password'}}
                id="Password"
                variant='outlined'
                helperText={
                    errors.password? errors.password.type === 'pattern' ? "Invalid Password" : "Password is required": ''
                }
                {...field}
                />
            }
            />
            </ListItem>
            <ListItem>
            <Controller
            name="confirmPassword"
            control={control}
            rules={{
            required: true
            }}
            render={({field}) =>
                <TextField
                fullWidth
                error={Boolean(errors.password)}
                label="Confirm Password"
                inputProps={{type : 'password'}}
                id="ConfirmPassword"
                variant='outlined'
                helperText={
                    errors.password? errors.password.type === 'pattern' ? "Invalid Password" : "Confirm Password is required": ''
                }
                {...field}
                />
            }
            />
            </ListItem>
            <ListItem>
                <Button variant='contained' color='primary' fullWidth type='submit'>Sign up</Button> 
            </ListItem>
            <ListItem>
              Don&apos;t have an account? &nbsp;
              <Link href={`/login?redirect=${redirect || '/'}`}>login</Link>
            </ListItem>
            </List>
        </form>
    </Layout>
  )
}
