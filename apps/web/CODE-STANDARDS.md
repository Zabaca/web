# Code Standards for Astro App

This Astro application follows the TypeScript code standards defined in the monorepo's CLAUDE.md file.

## Configuration

### TypeScript Configuration

The app extends the root `tsconfig.json`, inheriting all strict settings:
- `strict: true` with all sub-options
- `noImplicitAny`, `noImplicitReturns`, `noUnusedLocals`, etc.
- `exactOptionalPropertyTypes: true`
- `noUncheckedIndexedAccess: true` (inherited from root)

Astro-specific additions:
- `jsx: "preserve"` - Required for Astro components
- `jsxImportSource: "astro"` - Use Astro's JSX runtime
- `moduleResolution: "bundler"` - Astro's preferred resolution

### Biome Configuration

Uses Biome for linting and formatting, extending root configuration:

```bash
# Type check
bun run typecheck

# Format code
bun run format

# Check code quality
bun run check

# Fix issues automatically
bun run check:fix

# Full lint (TypeScript + Biome)
bun run lint
```

## Astro Component Guidelines

### Component Structure
```astro
---
// TypeScript code with strict typing
import type { Props } from './types';
import { validateProps } from './utils';

interface ComponentProps {
  readonly title: string;
  readonly description?: string;
}

const props = Astro.props as ComponentProps;

// Validate props using Result pattern
const validation = validateProps(props);
if (!validation.success) {
  throw new Error(validation.error.message);
}
---

<div class="component">
  <h1>{props.title}</h1>
  {props.description && <p>{props.description}</p>}
</div>

<style>
  .component {
    /* Scoped styles */
  }
</style>
```

### TypeScript in Astro

Follow the same 10 rules from CLAUDE.md:

1. **No Complex Control Flow** - Use early returns
2. **Bounded Loops** - No while loops without bounds
3. **Dependency Injection** - Pass services as props
4. **Small Functions** - Keep under 25 lines
5. **Type Guards** - Validate all inputs
6. **Minimal Scope** - Use const, explicit types
7. **Handle All Results** - Use Result types
8. **Simple Types** - Avoid advanced TypeScript
9. **Shallow Access** - No deep property chains
10. **Zero Warnings** - Strict compilation

### Example: Typed API Route

```typescript
// src/pages/api/data.json.ts
import type { APIRoute } from 'astro';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
});

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);
  
  const validation = querySchema.safeParse(params);
  if (!validation.success) {
    return new Response(
      JSON.stringify({ error: 'Invalid parameters' }), 
      { status: 400 }
    );
  }
  
  const { page, limit } = validation.data;
  
  // Your logic here
  
  return new Response(
    JSON.stringify({ page, limit, data: [] }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
```

### Example: Typed Component Props

```astro
---
// src/components/Card.astro
import { z } from 'zod';

const propsSchema = z.object({
  title: z.string(),
  href: z.string().url(),
  body: z.string(),
  featured: z.boolean().optional(),
});

type CardProps = z.infer<typeof propsSchema>;

const props = propsSchema.parse(Astro.props);
---

<li class={`link-card ${props.featured ? 'featured' : ''}`}>
  <a href={props.href}>
    <h2>{props.title}</h2>
    <p>{props.body}</p>
  </a>
</li>
```

## Validation Pattern (CLAUDE.md #481-537)

**MANDATORY**: Use Zod for runtime validation at ALL IO boundaries:

### 1. Environment Variables
```typescript
import { z } from 'zod';

const envSchema = z.object({
  PUBLIC_API_URL: z.string().url(),
  PUBLIC_SITE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

// Parse at startup
const env = envSchema.parse(import.meta.env);
```

### 2. API Responses
```typescript
const apiResponseSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    title: z.string(),
    published: z.boolean(),
  })),
  total: z.number(),
});

const response = await fetch('/api/posts');
const json = await response.json();
const validated = apiResponseSchema.parse(json);
```

### 3. Form Data
```typescript
const contactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const result = contactFormSchema.safeParse(data);
  
  if (!result.success) {
    return new Response(JSON.stringify({ errors: result.error.flatten() }), {
      status: 400,
    });
  }
  
  // Use result.data safely
};
```

## Best Practices

1. **Type all component props** - No implicit any
2. **Validate external data** - API responses, form data
3. **Use const assertions** - For literal types
4. **Prefer named exports** - Except for pages/layouts
5. **Handle loading states** - No undefined data access
6. **Use CSS modules or scoped styles** - Avoid global styles
7. **Keep components focused** - Single responsibility

## Testing

While Astro doesn't have built-in testing, follow these patterns:

```typescript
// src/utils/example.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './example';

describe('calculateTotal', () => {
  it('should handle valid input', () => {
    const result = calculateTotal([1, 2, 3]);
    expect(result).toEqual({ success: true, data: 6 });
  });
  
  it('should handle empty array', () => {
    const result = calculateTotal([]);
    expect(result).toEqual({ 
      success: false, 
      error: new Error('Array cannot be empty') 
    });
  });
});
```