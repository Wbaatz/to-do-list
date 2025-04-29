import { z } from "zod";

const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    username: z.string().min(5, {
      message: "Username must be at least 5 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }).regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    }).regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    }).regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    }),
  })

  export default formSchema;