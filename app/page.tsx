'use client';

import { Button, Container, Flex } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Container>
      <Flex h="100vh" justify="center" align="center">
        <Button onClick={() => router.push("/auth/login")}>Login</Button>
      </Flex>
    </Container>
  );
}
