import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('A valid email address is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'staff'], {
    errorMap: () => ({ message: 'Role must be admin or staff' })
  })
});

const updateUserSchema = userSchema.omit({ password: true }).partial();

export { userSchema, updateUserSchema };