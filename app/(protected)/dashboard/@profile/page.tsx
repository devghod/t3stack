import { Card, CardSection } from "@mantine/core"; 
import { Calendar } from "@mantine/dates";
import '@mantine/dates/styles.css';

export default function Page() {
  return (
    <>
      <Card withBorder radius="md" p="xl" shadow="none" h={300}>
        <CardSection>
          <Calendar />
        </CardSection>
      </Card>
    </>
  );
}
