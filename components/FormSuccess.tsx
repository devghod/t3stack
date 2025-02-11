import { Alert } from "@mantine/core";
import { FaCheckCircle } from "react-icons/fa";

export default function FormSuccess({ 
  message 
} : {
  message?: string
}) {
  if(!message) return null;

  return (
    <Alert
      style={{ 
        padding: '10px', 
        marginTop: '10px', 
        marginBottom: '10px'
      }}
      icon={<FaCheckCircle />}
      title={message}
      color="lime"
      variant="light"
    ></Alert>
  );
}
