import { Button, Card, Grid, List, ListItem, ListItemText, TextField } from "@mui/material";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Layout from "../component/Layout";
import Link from "../component/Link";
import { Store } from "../utils/store";
import useStyles from "../utils/style";




const Profile = () => {

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const { state: { userInfo }, dispatch } = useContext(Store);
    const {handleSubmit, control, formState : {errors},setValue} = useForm();
    const router = useRouter();
    const classes = useStyles();
    const submitHandler = async ({username,email,password,confirmPassword}) => {
        closeSnackbar();
        if(password !== confirmPassword){
            enqueueSnackbar("password don't match", {variant: "error"});
            return; 
        }
        try {
            const { data } = await axios.put("/api/account/update", {id: userInfo.id,username,email,password},{
              headers: {
                authorization: `marshmelo${userInfo.token}`
              }
            });
            dispatch({type: "USER_LOGIN", data});
            
        } catch (err) {
            enqueueSnackbar(err.response.data.message || err.message, {variant: "error"});         
        }
        
    }

    useEffect(()=>{
        if(!userInfo){
            router.push('/login?redirect=profile')
        }
        setValue("username", userInfo.username);
        setValue("email", userInfo.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
      <Layout title="profile">
       <Grid container>
       <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <Link href="/profile">
                <ListItem button selected>
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/order-history">
                <ListItem button>
                  <ListItemText primary="Order History"></ListItemText>
                </ListItem>
              </Link>
            </List>
          </Card>
        </Grid>
           <Grid item md={9} xs={12}>
          <form onSubmit={handleSubmit(submitHandler)} >
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
                <Button variant='contained' color='primary' fullWidth type='submit'>Update</Button> 
            </ListItem>
            </List>
        </form>
        </Grid>
       </Grid>
      </Layout>  
    );
}


export default dynamic(() => Promise.resolve(Profile), { ssr: false });