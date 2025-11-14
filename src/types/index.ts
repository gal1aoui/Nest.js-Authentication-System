import z from 'zod';

export const userLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const userRegisterSchema = z.object({
  email: z.email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});
