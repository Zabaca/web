---
entity_type: ArchitectureDecision
decision_title: "Astro Framework Selection"
status: accepted
decision_date: "2025-01-07"
impact_scope: system-wide
technology_stack: ["Astro", "Static Site Generation", "Islands Architecture"]
decision_topic: technology_selection
---

# ADR-001: Astro Framework Selection

## Status
**Accepted** - 2025-01-07

## Context
Zabaca needed a modern web framework for their company website that could deliver exceptional performance while supporting interactive React components for product demonstrations.

## Decision
We will use Astro as the primary framework for the Zabaca company website.

## Rationale
List of key reasons for this choice:
- **Performance First**: Static site generation with minimal JavaScript bundle sizes
- **Component Islands**: Selective hydration allows mixing static content with interactive React components
- **Developer Experience**: File-based routing, built-in TypeScript support, and modern tooling
- **SEO Optimization**: Server-side rendering ensures optimal search engine visibility

## Consequences
### Positive
- Excellent Core Web Vitals and page load performance
- Reduced JavaScript bundle size compared to traditional SPA frameworks
- Better SEO and social media sharing capabilities

### Trade-offs
- Learning curve for developers unfamiliar with islands architecture
- Limited client-side routing capabilities compared to SPAs

## Review Criteria
This decision should be reviewed if performance requirements change or if more complex interactive features require SPA-style navigation.