import {forwardRef, MouseEvent} from 'react';
import {Button as ButtonBase, ButtonProps, SxProps, Theme} from '@mui/material';

interface ButtonBaseProps extends ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  sx?: SxProps<Theme>;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ onClick, sx, href, children, ...props }, ref) => {
    return (
      <ButtonBase
        onClick={onClick}
        className=''
        ref={ref}
        href={href}
        variant='outlined'
        sx={{
          border: 'none',
          color: '#e5e5e5',
          fontFamily: 'PatrickHandSC, sans-serif',
          textTransform: 'capitalize',
          fontSize: '24px',
          fontWeight: 'bold',
          borderRadius: '4px',
          padding: '8px 10px 8px 10px',
          '&:hover': {
            backgroundColor: '#2d2d2d',
            border: 'none',
          },
          '&:focus': {
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          },
          ...sx,
        }}
        {...props}
      >
        <div>{children}</div>
      </ButtonBase>
    );
  },
);

Button.displayName = 'Button';
