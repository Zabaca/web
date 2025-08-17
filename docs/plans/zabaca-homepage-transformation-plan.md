# Zabaca Homepage Transformation Plan

## Objective
Transform the current AI Business Cards-focused homepage into a multi-product company homepage that showcases all three Zabaca products: Stiqr, AI Business Cards, and TemporalBridge. Create dedicated product pages and update the overall site architecture to support a product portfolio approach.

## Context
- **Created**: 2025-08-17
- **Status**: [ ] Not Started / [x] In Progress / [ ] Completed
- **Complexity**: High

## Prerequisites
- Current homepage is fully functional with AI Business Cards content
- Stiqr press content available for reference
- TemporalBridge documentation and features understood
- Development server is running and accessible

## Relevant Resources
### Guides
- Current homepage structure at `/src/pages/index.astro`
- Hero section component at `/src/components/sections/HeroSection.tsx`
- Service cards component at `/src/components/sections/ServiceCards.tsx`
- Navigation component architecture

### Files
- `/src/pages/index.astro` - Main homepage transformation
- `/src/pages/products/` - New product pages directory
- `/src/components/sections/HeroSection.tsx` - Generic hero component
- `/src/components/sections/ServiceCards.tsx` - Transform to product cards
- Navigation components - Add Products dropdown
- All references to "Vibeboard" → "Stiqr"

### Documentation
- `../vibeboard/docs/press.md` - Stiqr product content
- `../temporal-bridge/README.md` - TemporalBridge features
- Current homepage styling and components

## Goals

### Parent Goal 1: Create Product Pages Infrastructure
- [x] Create `/src/pages/products/` directory structure
- [x] Create `/src/pages/products/stiqr.astro` with hero + features + demo + contact
- [x] Create `/src/pages/products/ai-business-cards.astro` using current homepage content
- [x] Create `/src/pages/products/temporal-bridge.astro` with compelling memory-focused content
- [x] Ensure all product pages follow consistent layout structure

### Parent Goal 2: Transform Homepage to Multi-Product Focus
- [x] Update hero section headline to "AI-Powered Tools for the Future of Work"
- [x] Update hero subheadline to describe the product ecosystem
- [x] Change hero CTA from username claiming to "Explore our Products"
- [x] Remove AI Business Cards-specific content (chat interface, username form)
- [x] Make hero section generic and company-focused

### Parent Goal 3: Create Product Showcase Cards
- [x] Replace "How It Works" section with "Our Products" section
- [x] Create Stiqr product card with meeting visualization focus
- [x] Create AI Business Cards product card with business discovery focus
- [x] Create TemporalBridge product card with AI memory focus
- [x] Link each card directly to respective product page
- [x] Order products: Stiqr, AI Business Cards, TemporalBridge

### Parent Goal 4: Update Navigation and Site Architecture
- [x] Add "Products" dropdown to main navigation
- [x] Include links to all three product pages in dropdown
- [x] Order dropdown items: Stiqr, AI Business Cards, TemporalBridge
- [x] Update mobile navigation to support dropdown
- [x] Ensure navigation is consistent across all pages

### Parent Goal 5: Rebrand Vibeboard to Stiqr
- [x] Update all "Vibeboard" references to "Stiqr" in codebase
- [x] Update repository/project name references where applicable
- [x] Ensure consistent Stiqr branding across all new content
- [x] Verify no remaining Vibeboard references in visible content
- [x] Update all references to uptownhr github links to zabaca

## Implementation Notes

### Design Consistency
- All product pages should follow the same structure: Hero → Features/Cards → Demo/Example → Contact
- Maintain the existing color scheme and design language
- Use the same component architecture for consistency

### Content Strategy
- **Stiqr**: Focus on "AI Meeting Visualizer" concept from press.md
- **AI Business Cards**: Repurpose existing homepage content
- **TemporalBridge**: Emphasize "persistent AI memory" and "knowledge graphs"

### Technical Considerations
- Maintain existing Astro + React architecture
- Reuse existing components where possible
- Ensure responsive design across all new pages
- Keep current styling framework and conventions

## Testing Strategy
- [ ] Verify all product pages render correctly
- [ ] Test navigation dropdown functionality
- [ ] Ensure responsive design works on mobile
- [ ] Validate all links work correctly
- [ ] Check that homepage transformation maintains visual appeal
- [ ] Verify no broken references after Vibeboard → Stiqr changes

## Risks & Mitigations
- **Risk**: Homepage loses conversion focus
  - **Mitigation**: Include clear CTAs on product cards and maintain professional design
- **Risk**: Content inconsistency across product pages
  - **Mitigation**: Use consistent templates and review all content for tone/quality
- **Risk**: Navigation complexity increases
  - **Mitigation**: Keep dropdown simple and intuitive

## Timeline Estimate
- Planning: 30 minutes (completed)
- Product Pages Creation: 2 hours
- Homepage Transformation: 1 hour
- Navigation Updates: 45 minutes
- Vibeboard → Stiqr Rebranding: 30 minutes
- Testing & Refinement: 45 minutes
- **Total**: ~5 hours

## Discussion
**Confirmed Requirements:**
1. All product pages follow same structure as current homepage
2. Update all "Vibeboard" references to "Stiqr" throughout codebase
3. Navigation order: Stiqr first, then AI Business Cards, then TemporalBridge
4. Homepage should be generic, not AI Business Cards-specific
5. Product cards should link directly to product pages

**Key Decisions:**
- Stiqr positioned as flagship product (first in navigation)
- Focus on creating compelling individual product narratives
- Maintain existing design system for consistency
- Generic homepage serves as company overview and product discovery hub