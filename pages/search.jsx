import { Button, Grid, List, ListItem, MenuItem, Pagination, Rating, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Layout from '../component/Layout';
import useStyles from '../utils/style';
import prisma from '../lib/prisma';
import Product from '../component/Product';
import axios from 'axios';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import CancelIcon from '@mui/icons-material/Cancel';



const PAGE_SIZE = 3;

const Search = ({ products, pages, countProducts, pageCount, currentPage }) => {

    const classes = useStyles();
    const router = useRouter();
  const {
    query = 'all',
    category = 'all',
    brand = 'all',
    price = 'all',
    rating = 'all',
    sort = 'featured',
  } = router.query;

  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;

    router.push({
      pathname: path,
      query: query,
    });
  };

    /// search handlers
    const categoryHandler = (e) => {
      filterSearch({ category: e.target.value })
    }
    const pageHandler = (e, page) => {
      filterSearch({ page });
    };
    const brandHandler = (e) => {
      filterSearch({ brand: e.target.value });
    };
    const sortHandler = (e) => {
      filterSearch({ sort: e.target.value });
    };
    const priceHandler = (e) => {
      filterSearch({ price: e.target.value });
    };
    const ratingHandler = (e) => {
      filterSearch({ rating: e.target.value });
    };

    /// define types
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    useEffect(()=>{

      const fetchCtegories = async () => {
        const { data } = await axios.post("/api/products/features",{ feature: "category" });
        setCategories(data);
      }
      fetchCtegories();
      const fetchBrands = async () => {
        const { data } = await axios.post("/api/products/features",{ feature: "brand" });
        setBrands(data);
      }
      fetchBrands();
    },[]);

    /// define some constant

    const prices = [
      {
        name: '$1 to $50',
        value: '1-50',
      },
      {
        name: '$51 to $200',
        value: '51-200',
      },
      {
        name: '$201 to $1000',
        value: '201-1000',
      },
    ];

    const ratings = [1, 2, 3, 4, 5];

    return (
        <Layout title="Search">
          <Grid className={classes.mt1} container spacing={1}>
          <Grid item md={3}>
            <List>
              <ListItem>
                <Box width="100%" >
                    <Typography>Categories</Typography>
                    <Select fullWidth value={category} onChange={categoryHandler} >
                  <MenuItem value="all">All</MenuItem>
                    {categories && categories.map(category => 
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    )}
                    </Select>
                </Box>
              </ListItem>
              <ListItem>
                <Box width="100%" >
                    <Typography>Brands</Typography>
                    <Select fullWidth value={brand} onChange={brandHandler} >
                  <MenuItem value="all">All</MenuItem>
                    {brands && brands.map(brand => 
                      <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                    )}
                    </Select>
                </Box>
              </ListItem>
              <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Prices</Typography>
                <Select value={price} onChange={priceHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {prices.map((price) => (
                    <MenuItem key={price.value} value={price.value}>
                      {price.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Ratings</Typography>
                <Select value={rating} onChange={ratingHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {ratings.map((rating) => (
                    <MenuItem dispaly="flex" key={rating} value={rating}>
                      <Rating value={rating} readOnly />
                      <Typography component="span">&amp; Up</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
              </List>
            </Grid>
         
            <Grid item md={9}>
              <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
              {products.length === 0 ? 'No' : countProducts} Results
              {query !== 'all' && query !== '' && ' : ' + query}
              {category !== 'all' && ' : ' + category}
              {brand !== 'all' && ' : ' + brand}
              {price !== 'all' && ' : Price ' + price}
              {rating !== 'all' && ' : Rating ' + rating + ' & up'}
              {(query !== 'all' && query !== '') ||
              category !== 'all' ||
              brand !== 'all' ||
              rating !== 'all' ||
              price !== 'all' ? (
                <Button onClick={() => router.push('/search')}>
                  <CancelIcon />
                </Button>
              ) : null}
            </Grid>
            <Grid item sx={{display: "grid"}} >
              <Typography component="span" className={classes.sort}>
                Sort by
              </Typography>
              <Select value={sort} onChange={sortHandler}>
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="lowest">Price: Low to High</MenuItem>
                <MenuItem value="highest">Price: High to Low</MenuItem>
                <MenuItem value="toprated">Customer Reviews</MenuItem>
                <MenuItem value="newest">Newest Arrivals</MenuItem>
              </Select>
            </Grid>
            </Grid>
          <Box marginTop="1rem" >
            <Product products={pages[currentPage - 1]} />
          </Box>
          
          <Pagination
            className={classes.mt1}
            defaultPage={parseInt(query.page || '1')}
            count={pageCount}
            onChange={pageHandler}
          ></Pagination>
          </Grid>
          </Grid>
        </Layout>
      );
    }

    export async function getServerSideProps({ query }) {
      
        const allProducts = await prisma.products.findMany(); /// all products

        //filter queries
        const filterQueries = (type) =>{
            if(type === 'all'){
              return '';
            }
            return type;
        }

        const filterPrice = (range, { price }) => {
          if(range !== "all" && range !== ""){
            const priceRange = range.split('-');
          return price >= priceRange[0] && price <= priceRange[1];
        }
        return true;
        }

        const filterSort = (sort, a, b) => {
          switch (sort) {
            case "lowest":
              return a.price - b.price;
            case "highest":
              return b.price - a.price;
            case "toprated":
                return b.rating - a.rating;
            case "newest":
              return b.createdAt - a.createdAt;
          
            default:
              return 0;
          }
        }
        
        /// search queries
        const searchQuery = query.query || '';
        const category = filterQueries(query.category) || '' ;
        const brand = filterQueries(query.brand) || '' ;
        const priceRange = filterQueries(query.price) || '' ;
        const rating = filterQueries(query.rating) || 0;
        const sortBy = query.sort || "featured";
        const pageSize = query.pageSize || PAGE_SIZE;
        const currentPage = query.page || 1;

        /// regex
        const regex = (reg) => RegExp(reg,"i");

        /// filter
        const products = allProducts.filter(Product => regex(searchQuery).test(Product.name)) 
                                    .filter(Product => regex(category).test(Product.category))
                                    .filter(Product => regex(brand).test(Product.brand))
                                    .filter(Product => filterPrice(priceRange,Product) )
                                    .filter(Product => Product.rating >= rating )
                                    .sort((a,b) => filterSort(sortBy, a, b));
        /// count length
        const countProducts = products.length;


        /// define pages
        const pageCount = Math.ceil(countProducts / pageSize);
        const pages = (() => {
          const arr = [];
          for (let i = 0; i < 2; i++) {
            arr.push(products.slice(i*3,i*3+3))
          }
          return arr;
          })();

      
        return {
          props: {
            products,
            pages,
            countProducts,
            currentPage,
            pageCount
          },
        };
      }

export default Search;