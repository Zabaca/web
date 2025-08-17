// Example validation utilities following CLAUDE.md standards
import { z } from "zod";

// Rule 7: Result type for error handling
export type Result<T, E = Error> =
	| { success: true; data: T }
	| { success: false; error: E };

// IO Boundary Validation (CLAUDE.md #481-537): Use Zod for all IO boundaries
export const pageMetaSchema = z.object({
	title: z.string().min(1).max(60),
	description: z.string().min(1).max(160),
	keywords: z.array(z.string()).optional(),
});

export type PageMeta = z.infer<typeof pageMetaSchema>;

// Environment variables validation (CLAUDE.md example)
export const envSchema = z.object({
	PUBLIC_API_URL: z.string().url(),
	PUBLIC_SITE_URL: z.string().url(),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

// Rule 4: Small function (under 25 lines)
export function validatePageMeta(input: unknown): Result<PageMeta, Error> {
	try {
		const data = pageMetaSchema.parse(input);
		return { success: true, data };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: new Error(error.errors.map((e) => e.message).join(", ")),
			};
		}
		return {
			success: false,
			error: error instanceof Error ? error : new Error("Unknown error"),
		};
	}
}

// HTTP Request validation (CLAUDE.md example)
export async function fetchPageMeta(
	url: string,
): Promise<Result<PageMeta, Error>> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			return { success: false, error: new Error(`HTTP ${response.status}`) };
		}
		const json = await response.json();
		const config = pageMetaSchema.parse(json);
		return { success: true, data: config };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error : new Error("Failed to fetch config"),
		};
	}
}

// Rule 1: No complex control flow - early returns
export function formatPageTitle(title: string, siteName?: string): string {
	if (!title) {
		throw new Error("Title is required");
	}

	if (!siteName) {
		return title;
	}

	if (title === siteName) {
		return title;
	}

	return `${title} | ${siteName}`;
}

// Rule 3: Dependency injection pattern
export interface UrlFormatter {
	format(path: string): string;
}

export function createUrlFormatter(baseUrl: string): UrlFormatter {
	// Validate base URL
	if (!baseUrl) {
		throw new Error("Base URL is required");
	}
	if (!baseUrl.startsWith("http")) {
		throw new Error("Base URL must start with http");
	}

	const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

	return {
		format(path: string): string {
			if (!path) {
				return base;
			}
			const cleanPath = path.startsWith("/") ? path : `/${path}`;
			return `${base}${cleanPath}`;
		},
	};
}
