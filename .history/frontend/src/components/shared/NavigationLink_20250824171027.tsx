// src/components/shared/NavigationLink.tsx
import { Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  to: string;
  text: string;
  onClick?: () => void;
  variant?: 'solid' | 'ghost';
};

const NavigationLink = ({ to, text, onClick, variant = 'solid' }: Props) => {
  return (
    <Button
      as={RouterLink} // Use Button as a React Router Link
      to={to}
      onClick={onClick}
      variant={variant}
      colorScheme={variant === 'solid' ? 'blue' : undefined}
      color="white"
      fontWeight="600"
      _hover={{
        bg: variant === 'solid' ? 'blue.600' : 'whiteAlpha.200',
      }}
    >
      {text}
    </Button>
  );
};

export default NavigationLink;