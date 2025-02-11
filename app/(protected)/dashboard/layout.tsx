"use client";
import { Grid } from "@mantine/core";

export default function Layout({ 
  children,
  analytics,
  profile
}: { 
  children: React.ReactNode,
  analytics: React.ReactNode,
  profile: React.ReactNode
}) {
  return (
    <>
      {children}
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          {profile}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          {analytics}
        </Grid.Col>
      </Grid>
    </>
  )
}
