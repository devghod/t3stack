import { LoginSchema } from "@/schemas";
import * as yup from "yup";

export const loginValidate = async (data: Record<string, any>) => { // eslint-disable-line
  try {
    const validatedData = await LoginSchema.validate(data, { abortEarly: true });
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { success: false, errors: error.errors };
    }
    throw error;
  }
};