---
entity_type: Architecture
component_type: system
c4_layer: container
technology_stack: ["Astro", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "Biome", "pnpm"]
status: active
document_purpose: Container architecture and internal components
containers: ["Astro Web Application", "Static Assets", "Content Management", "Analytics Integration"]
---

# Zabaca Web Container Architecture

## Container Overview
Monorepo architecture built around Astro static site generator with React components and modern toolchain for optimal performance.

## Primary Containers

### **Astro Web Application**
- **Technology**: Astro 5.x with React 19 integration
- **Purpose**: Main application container handling SSG, routing, and page rendering
- **Key Functions**: Page generation, component hydration, build optimization, development server

### **Static Assets Container**
- **Technology**: File system with CDN integration
- **Purpose**: Serves images, icons, fonts, and other static resources
- **Key Functions**: Asset optimization, caching headers, responsive image delivery

### **Content Management System**
- **Technology**: Astro Content Collections with Markdown
- **Purpose**: Manages press releases and structured content
- **Key Functions**: Content validation, schema enforcement, static content generation

### **Analytics Integration**
- **Technology**: PostHog JavaScript client
- **Purpose**: User behavior tracking and performance monitoring
- **Key Functions**: Event tracking, session recording, performance metrics

### **Development Toolchain**
- **Technology**: pnpm workspace, TypeScript, Biome
- **Purpose**: Build system, code quality, and development workflow
- **Key Functions**: Dependency management, linting, formatting, type checking

## Container Diagram
```mermaid
C4Container
    title Container Diagram for Zabaca Web
    
    Person(users, "Website Users", "Visitors and prospects")
    Person(developers, "Development Team", "Site maintainers")
    
    Container_Boundary(zabaca_system, "Zabaca Web System") {
        Container(astro_app, "Astro Web App", "Astro 5 + React 19", "Generates static pages with interactive components")
        Container(content_cms, "Content System", "Astro Collections + Markdown", "Manages structured content and press releases")
        Container(assets, "Static Assets", "File System + CDN", "Serves optimized images, fonts, and resources")
        Container(analytics, "Analytics Client", "PostHog JS", "Tracks user behavior and performance")
        Container(toolchain, "Dev Toolchain", "pnpm + TypeScript + Biome", "Build system and code quality tools")
    }
    
    System_Ext(browsers, "Web Browsers", "Client rendering engines")
    System_Ext(cdn, "CDN Network", "Global asset delivery")
    System_Ext(posthog_service, "PostHog Service", "Analytics backend")
    System_Ext(github, "GitHub", "Code repository")
    
    Rel(users, astro_app, "Requests pages, interacts")
    Rel(astro_app, content_cms, "Fetches content")
    Rel(astro_app, assets, "References static files")
    Rel(astro_app, analytics, "Embeds tracking")
    Rel(developers, toolchain, "Develops with")
    Rel(toolchain, astro_app, "Builds and optimizes")
    
    Rel(astro_app, browsers, "Serves HTML/CSS/JS")
    Rel(assets, cdn, "Delivers via")
    Rel(analytics, posthog_service, "Sends events to")
    Rel(toolchain, github, "Commits to")
```