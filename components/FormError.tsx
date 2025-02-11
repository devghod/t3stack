import { Alert } from "@mantine/core";
import { FaExclamationTriangle } from "react-icons/fa";

export default function FormError({ 
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
      icon={<FaExclamationTriangle />}
      title={message}
      color="red"
      variant="light"
    ></Alert>
  );
}
