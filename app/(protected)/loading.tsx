import { Center, Loader } from "@mantine/core";

export default function Loading() {
  return (
    <Center h="100vh">
      <Loader size={30} />
    </Center>
  );
}
