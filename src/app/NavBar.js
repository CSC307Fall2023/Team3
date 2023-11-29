'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import { Box, Button } from '@mui/material';
import Link from 'next/link';
import SantaSleigh from 'src/app/SantaSleigh';

export default function NavBar() {
  const pathname = usePathname();
  const links = [
    { path: '/', name: 'Home' },
    { path: '/todos', name: 'ToDos' },
  ];

  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, color: '#fff',  }}>
      {links.map((l) => {
        const isActive = l.path === pathname;
        return (
          <Button
            component={Link}
            href={l.path}
            sx={{
              my: 2,
              mx: 1,
              color: 'inherit',
              display: 'block',
              textDecoration: isActive ? 'underline' : 'inherit',
              '&:hover': {
                color: '#ffee58', // Yellow
              },
            }}
            key={l.path}
          >
            {l.name}
          </Button>
        );
      })}
      
    </Box>
  );
}
