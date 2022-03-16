import { AppBar, Badge, Box, Button, Container, createTheme, CssBaseline, Divider, Drawer, IconButton, InputBase, List, ListItem, ListItemText, Menu, MenuItem, Paper, Switch, ThemeProvider, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import Link from "./Link"; 
import useStyles from "../utils/style";
import {Store} from "../utils/store";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import HistoryIcon from '@mui/icons-material/History';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/LoginRounded';
import CartIcon from '@mui/icons-material/ShoppingBasket';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import UseSwitchesCustom from '../utils/switch';
import Image from "next/image";


export default function Layout({children,title,description}) {
  
  const { state: { darkMode, userInfo, cart: {cartItems} } , dispatch } = useContext(Store);
  const [categories, setCategories] = useState([]);
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000'
      },
      secondary: {
        main: '#208080',
      },
      Badge: {
        main: darkMode ? '#0050cc' : '#000',
      }
    },
  });
  const classes = useStyles();
  const darkModeChange = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
  };

  const [sidbarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false)
  }

  /// menu handler 
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e,redirect) => {
    setAnchorEl(null);
    if(redirect && redirect !== "escapeKeyDown" && redirect !== "backdropClick" && redirect !== "tabKeyDown")
    router.push(redirect);
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    router.push('/');
  };
  const [query, setQuery] = useState('');
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  useEffect(()=>{

    const fetchCtegories = async () => {
      const { data } = await axios.post("/api/products/features",{ feature: "category" });
      setCategories(data);
    }
    fetchCtegories();
  },[])

  return (<>
  <Head>
    <title>{title ? `${title} - Next E-Commerce` : 'Next E-Commerce'}</title>
    {description && <meta name="description" content={description}></meta>}
  </Head>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Paper>
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static" className={classes.HeaderBar} >
      <Toolbar className={classes.ToolBar} >
      <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
                className={classes.menuButton}
              >
                <MenuIcon className={classes.navbarButton} />
              </IconButton>
              <Link href="/" >
                  <Typography className={classes.brand}>next ecommerce</Typography>
              </Link>
      </Box>
      <Drawer
              anchor="left"
              open={sidbarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>Shopping by category</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/search?category=${category}`}
                  >
                    <ListItem
                      button
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </Link>
                ))}
              </List>
      </Drawer>
      <div className={classes.searchSection}>
              <form onSubmit={submitHandler} className={classes.searchForm} >
                <InputBase
                  name="query"
                  className={classes.searchInput}
                  placeholder="Search products"
                  onChange={queryChangeHandler}
                />
                <IconButton
                  type="submit"
                  className={classes.iconButton}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </form>
      </div>
      <Box display="flex" alignItems="center">
        <UseSwitchesCustom 
            checked={darkMode}
            onChange={darkModeChange}
        />
        <Switch
          checked={darkMode}
          onChange={darkModeChange}
        />
      <Link href="/cart" >
        {cartItems.length === 0?
           <CartIcon />:
        <Badge badgeContent={cartItems.length} color="Badge" >
           <CartIcon />
       </Badge>
        }
        </Link>
      {userInfo? 
      <>
      <Button
        aria-controls="user-menu"
        aria-haspopup="true"
        onClick={loginClickHandler}
        className={classes.navbarButton}
      >
        <Box borderRadius="50%" >
          <Image src="/profile/logo.png" width={30} height={30} alt="" />
        </Box>
      </Button>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={loginMenuCloseHandler}
      >
        <MenuItem
          onClick={(e) => loginMenuCloseHandler(e, '/profile')}
        >
        <ProfileIcon color="secondary" /> {' '} Profile
        </MenuItem>
        <MenuItem
          onClick={(e) =>
            loginMenuCloseHandler(e, '/order-history')
          }
        >
        <HistoryIcon color="secondary" /> {' '}  Order Hisotry
        </MenuItem>
        {userInfo.isAdmin && (
          <MenuItem
            onClick={(e) =>
              loginMenuCloseHandler(e, '/admin/dashboard')
            }
          >
          <AdminIcon color="secondary" /> {' '}  Admin Dashboard
          </MenuItem>
        )}
        <MenuItem onClick={logoutClickHandler}>
        <LogoutIcon color="secondary" /> {" "}  Logout
        </MenuItem>
      </Menu>
    </>
      : 
      <Link href="/login" >
      <LoginIcon />
      </Link>}
      </Box>
        </Toolbar>
    </AppBar>
    </Box>
    <Container className={classes.Main} >
    {children}
    </Container>
    <footer className={classes.Footer} >
      <Typography>All rights reserved. Next E-Commerce.</Typography>
    </footer>
    </Paper>
    </ThemeProvider>
    </>
  );
}