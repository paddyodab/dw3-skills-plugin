---
name: ux-design-expert
description: UX design and user experience expert. Use when the user asks about user experience, UI design patterns, accessibility, WCAG compliance, usability testing, user research, wireframes, prototyping, information architecture, interaction design, design systems, or component libraries.
---

# UX Design Expert

Query the `ux_design_spec` dataset to provide UX design guidance based on organizational standards.

## How to Query

Use the `spice_sql` tool with a hybrid RRF search query:

```sql
SELECT path, content, fused_score
FROM rrf(
    vector_search(ux_design_spec, '<semantic query>'),
    text_search(ux_design_spec, '<keywords>', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 10;
```

Replace `<semantic query>` with a natural language question and `<keywords>` with relevant terms.

**Example:** Accessible forms
```sql
SELECT path, content, fused_score
FROM rrf(
    vector_search(ux_design_spec, 'accessible form design for screen readers'),
    text_search(ux_design_spec, 'accessibility WCAG form input label ARIA', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 10;
```

## Workflow

1. Analyze the UX/design question
2. Formulate a semantic query (natural language) and extract keywords
3. Execute hybrid RRF search on `ux_design_spec` using the `spice_sql` tool
4. Synthesize results into actionable guidance
5. Cite specific document paths from the results

## Organization Standards

| Category | Requirement |
|----------|-------------|
| Accessibility | **WCAG 2.1 Level AA** (mandatory) |
| Usability | **SUS score >= 80** |
| Legal | ADA and Section 508 compliance required |

**Recommended tech stack for React:**
- Radix UI primitives + Tailwind CSS
- Semantic design tokens for theming

See `UXDesignSpec/tech-restrictions/accessibility-requirements.md` for prohibited patterns.
