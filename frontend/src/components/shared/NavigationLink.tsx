// src/components/shared/NavigationLink.tsx
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  text: string;
  variant?: 'solid' | 'ghost';
  onClick?: () => Promise<void>;
};

const NavigationLink = (props: Props) => {
  const isSolid = props.variant !== 'ghost';

  return (
    <Button
      component={Link} // Use the Link component from react-router-dom
      to={props.to}
      onClick={props.onClick}
      sx={{
        color: 'white',
        borderRadius: '999px', // pill shape
        mx: 1,
        textTransform: 'none', // Prevent uppercase text
        fontWeight: '600',
        background: isSolid ? 'black' : 'transparent',
        border: '2px solid transparent',
        backgroundOrigin: 'border-box',
        backgroundClip: 'content-box, border-box',
        backgroundImage: `linear-gradient(${
          isSolid ? 'black, black' : 'transparent, transparent'
        }), linear-gradient(to right, #FF69B4, #8A2BE2, #00FFFF)`,
        '&:hover': {
          background: isSolid ? '#1c1c1c' : 'rgba(255, 255, 255, 0.1)',
          backgroundImage: `linear-gradient(${
            isSolid ? '#1c1c1c, #1c1c1c' : 'transparent, transparent'
          }), linear-gradient(to right, #FF69B4, #8A2BE2, #00FFFF)`,
        },
      }}
    >
      {props.text}
    </Button>
  );
};

export default NavigationLink;