import { z } from "zod";

const formSchema = z.object({
    email: z.string(),
    password: z.string(),
  })

  export default formSchema;