import { createTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const theme = createTheme();
const useStyles = makeStyles({
    HeaderBar : {
    '& a': {
      color: '#ffffff',
      marginLeft: 10,
    }
    },
    iconButton: {
        backgroundColor: '#e8ae00',
        padding: 5,
        borderRadius: '0 5px 5px 0',
        '& span': {
          color: '#000000',
        },
      },
    section: {
        marginTop: 10,
        marginBottom: 10,
    },
    transparentBackgroud: {
      backgroundColor: 'transparent',
    },
    navbarButton: {
        color: "#fff",
        textTransform: "lowercase"
    },
    Footer: {
        textAlign: 'center',
        padding: 30
    },
    grow: {
        flexGrow: 1
    },
    MenuItem: {
        marginRight: 10
    },
    Link: {
        textDecoration: 'none',
        color: 'white',
        marginLeft: 10
    },
    Brand: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    ToolBar: {
        justifyContent: 'space-between',
      },
    Section: {
        fontSize: 16,
        margin: 20
    },
  searchForm: {
    border: "1px solid #e8ae00",
    paddingLeft: 16,
    borderRadius: 5,
  },
    Main: {
        minHeight: '80vh',
        marginTop: 16
    },
    mt1: { marginTop: '1rem' },
    sort: {
      marginRight: 5,
    },
    reviewItem: {
      marginRight: '1rem',
      borderRight: '1px #808080 solid',
      paddingRight: '1rem',
    },
    fullWidth: {
        width: '100%',
    },
    searchSection: {
      display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    },
    featuredImage: {
        width: "100%",
        height: "auto",
    },
    Divider: {
        marginBottom: "2em",
        color: "#ff6000",
    }
  });
  
  export default useStyles;