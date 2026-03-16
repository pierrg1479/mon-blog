import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = ({ image }) =>
	z.object({
		h1: z.string().optional(),
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
		author: z.object({
			name: z.string(),
			avatar: z.string(),
			url: z.string().url().optional(),
		}),
		draft: z.boolean().optional(),
	});

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: blogSchema,
});

const blogEn = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog-en/` directory.
	loader: glob({ base: './src/content/blog-en', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: blogSchema,
});

export const collections = { blog, blogEn };
