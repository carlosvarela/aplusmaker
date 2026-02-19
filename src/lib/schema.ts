import { z } from "zod";

export const ImageSchema = z.object({
  url: z.string().min(1, "image.url es requerido"),
  alt: z.string().optional(),
});

export const BlockSchema = z.object({
  title: z.string().min(1, "block.title es requerido"),
  text: z.string().min(1, "block.text es requerido"),
  image: ImageSchema,
});

export const FontsSchema = z.object({
  primaryName: z.string().optional(),
  secondaryName: z.string().optional(),
  primaryWoff2: z.string().optional(),
  primaryWoff: z.string().optional(),
  secondaryWoff2: z.string().optional(),
  secondaryWoff: z.string().optional(),
});

export const BaseDataSchema = z.object({
  pageTitle: z.string().optional(),

  brand: z
    .object({
      name: z.string().optional(),
      website: z.string().optional(),
      accentColor: z.string().optional(),
      fonts: FontsSchema.optional(),
    })
    .optional(),

  product: z
    .object({
      sku: z.string().optional(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      topCode: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),

  hero: z
    .object({
      topImage: ImageSchema.optional(),
      image: ImageSchema.optional(),
      badges: z.array(z.string()).optional(),
    })
    .optional(),

  blocks: z.array(BlockSchema).optional(),

  video: z
    .object({
      url: z.string().optional(),
      title: z.string().optional(),
    })
    .optional(),

  specsTitle: z.string().optional(),
  specs: z.record(z.string()).optional(),

  sustainabilityImages: z.array(ImageSchema).optional(),

  footer: z
    .object({
      logos: ImageSchema.optional(),
    })
    .optional(),
});

export type BaseData = z.infer<typeof BaseDataSchema>;
