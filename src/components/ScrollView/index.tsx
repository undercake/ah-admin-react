import { useState, useEffect, type FC, type ReactNode } from 'react';
import Box from '@mui/material/Box';

interface CustomScrollbarProps {
    className?: string;
    color?: string;
    children: ReactNode;
    [key: string]: any;
}

const CustomScrollbar: FC<CustomScrollbarProps> = ({
    className = '',
    children,
    sx = {},
    ...props
}: {
    color?: string;
    children: ReactNode;
    [key: string]: any;
}) => {
    return (
        <Box
            className={`custom-scrollbar ` + className}
            sx={{
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                    width: '0.4rem',
                    height: '0.4rem'
                },
                '&::-webkit-scrollbar-thumb': {
                    transition: 'background-color .6s',
                    backgroundColor: 'rgba(204,204,204,0)',
                    borderRadius: '0.4rem',
                },
                '&:hover::-webkit-scrollbar': {
                },
                '&:hover::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(204,204,204,1)',
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </Box>
    );
};

export default CustomScrollbar;