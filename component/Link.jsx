import NextLink from 'next/link';
import MuiLink from '@mui/material/Link';


const Link = ({href,children}) => {

  return (
    <NextLink href={href} passHref>
      <MuiLink underline='none' >
          {children}
      </MuiLink>
    </NextLink>
  );
}

export default Link;