---
entity_type: Architecture
component_type: infrastructure
c4_layer: context
technology_stack: ["Astro", "React", "TypeScript", "Tailwind CSS", "pnpm workspace"]
status: active
document_purpose: System context and external dependencies
external_systems: ["CDNs", "Web browsers", "Analytics services", "PostHog", "GitHub", "Deployment platforms"]
stakeholders: ["Website visitors", "Business prospects", "Developers", "Content managers", "Marketing team"]
---

# Zabaca Web System Context

## System Purpose
Modern company website showcasing Zabaca's AI-powered product suite with interactive components and optimized user experience.

## Key External Systems
List of major external systems this system interacts with:
- **Web Browsers** - Client-side rendering and interaction platform
- **CDNs** - Static asset delivery and caching infrastructure  
- **PostHog Analytics** - User behavior tracking and analytics
- **GitHub** - Source code repository and CI/CD triggers
- **Deployment Platform** - Automated build and deployment pipeline

## System Boundaries
### **What This System Does**
- Renders responsive company website with product information
- Provides interactive product demos and examples
- Collects user analytics and engagement metrics
- Serves static content with optimized performance

### **What This System Does NOT Do** 
- User authentication or account management
- Backend data processing or API services
- Product functionality implementation
- Payment processing or e-commerce features

## Context Diagram
```mermaid
C4Context
    title System Context for Zabaca Web
    
    Person(visitors, "Website Visitors", "Potential customers and users")
    Person(developers, "Developers", "Team members maintaining the site")
    Person(content_team, "Content Team", "Marketing and content managers")
    
    System(zabaca_web, "Zabaca Web", "Company website showcasing AI products")
    
    System_Ext(browsers, "Web Browsers", "Chrome, Firefox, Safari rendering engine")
    System_Ext(cdn, "CDN Network", "Asset delivery and caching")
    System_Ext(posthog, "PostHog", "Analytics and user behavior tracking")
    System_Ext(github, "GitHub", "Source code repository and CI/CD")
    System_Ext(deployment, "Deployment Platform", "Build and hosting infrastructure")
    
    Rel(visitors, zabaca_web, "Views website, interacts with demos")
    Rel(developers, zabaca_web, "Develops and maintains")
    Rel(content_team, zabaca_web, "Updates content and press releases")
    
    Rel(zabaca_web, browsers, "Serves HTML/CSS/JS")
    Rel(zabaca_web, cdn, "Delivers static assets")
    Rel(zabaca_web, posthog, "Sends analytics events")
    Rel(github, deployment, "Triggers builds on push")
    Rel(deployment, zabaca_web, "Deploys built site")
```