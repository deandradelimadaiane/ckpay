
import * as z from 'zod';

// Schema for product form validation
export const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Preço deve ser maior que zero'),
  image_url: z.string().url('URL inválida').optional().nullable(),
  banner_image_url: z.string().url('URL inválida').optional().nullable(),
  type: z.enum(['digital', 'physical'], {
    required_error: 'Por favor, selecione o tipo do produto',
  }),
  status: z.boolean().default(true),
  slug: z.string().optional(),
  has_whatsapp_support: z.boolean().default(false),
  whatsapp_number: z.string()
    .optional()
    .refine(val => {
      if (!val) return true;
      return /^\d+$/.test(val);
    }, {
      message: 'O número deve conter apenas dígitos',
    }),
  use_global_colors: z.boolean().default(true),
  button_color: z.string().optional(),
  heading_color: z.string().optional(),
  banner_color: z.string().optional()
});

export type ProductFormValues = z.infer<typeof productSchema>;

// Function to generate a slug from product name
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};
