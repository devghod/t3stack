"use client";

import { AppShell, Card, Overlay, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import Navbar from '@/components/dashboard/Navbar';
import Header from '@/components/dashboard/Header';

export default function DashboardLayout({ 
  children 
} : {
  children: React.ReactNode
}) {
  
  const setProfile = useAuthStore((state) => state.setProfile);
  const [navbarWidth, setNavbarWidth] = useState(80);
  const [navbarOpened, { toggle: toggleNavbar }] = useDisclosure();
  const [width, setWidth] = useState(80);
  const isDesktop = useMediaQuery('(min-width: 768px)') || false;
  const theme = useMantineTheme();
  
  useEffect(() => {
    setProfile();
  }, [setProfile]);
  
  useEffect(() => {
    if (isDesktop) {
      if (!navbarOpened) toggleNavbar();
      setNavbarWidth(250);
    } else {
      if (navbarOpened) toggleNavbar();
    }

    setWidth(!isDesktop ? 60 : 80);
  }, [isDesktop, width]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setNavbarWidth(navbarOpened ? 250 : width);
  }, [navbarOpened, width]);

  const handleToggleNavbar = () => {
    if (isDesktop) {
      setNavbarWidth(250);
    }
    toggleNavbar();
  }

  return (
    <AppShell
      header={{ height: { 
        base: 50,
        md: 60 
        } 
      }}
      navbar={{
        width: navbarWidth,
        breakpoint: '',
      }}
      padding="md"
      transitionDuration={500}
      transitionTimingFunction="ease"
      style={{ 
        overflow: "hidden",
        transition: 'transform 500ms ease',
        transitionDelay: '500ms',
        transitionProperty: 'transform',
      }}
    >
      <AppShell.Header zIndex={100}>
        <Header />
      </AppShell.Header>

      <AppShell.Navbar 
        p={isDesktop ? "md" : "xs"}
        style={{
          position: "absolute",
          top: isDesktop ? 60 : 50,
          left: 0,
          height: "calc(100vh - 60px)",
          boxShadow: theme.shadows.md,
          zIndex: 100,
          transition: 'width 0.3s ease-in-out, opacity 0.3s ease-in-out',
        }}
      >
        <Navbar 
          isDesktop={isDesktop}
          openedNavbar={navbarOpened} 
          toggleNavbar={handleToggleNavbar}
        />

      </AppShell.Navbar>

      <AppShell.Main 
        style={{ 
          backgroundColor: theme.colors.gray[0],
          position: 'relative',
          transition: 'width 0.3s ease-in-out, opacity 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          padding: !isDesktop ? '16px' : undefined,
          height: `calc(100vh - ${isDesktop ? 60 : 50}px)`,
        }}
      >
        {!isDesktop && navbarOpened && (
          <Overlay
            color={theme.colors.gray[5]}
            blur={100}
            opacity={0.8}
            zIndex={90}
            onClick={handleToggleNavbar}
          />
        )}
        <Card 
          withBorder 
          radius="md" 
          p="md" 
          shadow="sm"
          style={{
            marginLeft: !isDesktop ? 60 : 0,
            marginTop: !isDesktop ? 50 : 0,
            position: 'relative',
            flex: 1,
            transition: 'transform 500ms ease',
            overflow: 'auto',
          }}
        >
          {children}
        </Card>
      </AppShell.Main>

    </AppShell>
  );
}
