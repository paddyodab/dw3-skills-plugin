---
name: ux-design-expert
description: Provides UX design and accessibility guidance when the user discusses user experience, UI design patterns, accessibility, WCAG compliance, usability testing, user research, wireframes, prototyping, information architecture, interaction design, design systems, or component libraries.
---

# UX Design & Accessibility Expert

Query organizational UX standards from the `ux_design_spec` dataset using SpiceAI hybrid search.

## When to Use This Skill

Activate when the user asks about:
- User experience (UX) and user interface (UI) design
- Accessibility and WCAG compliance
- Usability testing and user research
- Wireframes, prototypes, and mockups
- Information architecture
- Interaction design patterns
- Design systems and component libraries
- ADA and Section 508 compliance

## How to Query

Use the `spice_sql` tool with hybrid RRF search:

```sql
SELECT path, content, fused_score
FROM rrf(
    vector_search(ux_design_spec, '<natural language query>'),
    text_search(ux_design_spec, '<keywords>', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 10;
```

**Example Query:**
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

1. **Identify UX domain** — Accessibility, usability, design patterns, or research
2. **Formulate queries** — Semantic query + UX/accessibility keywords
3. **Execute search** — Use `spice_sql` with RRF query
4. **Apply WCAG standards** — Filter by Level A, AA, or AAA requirements
5. **Cite sources** — Reference UX design spec documents

## Organization Standards

This organization requires:

| Category | Requirement |
|----------|-------------|
| Accessibility | **WCAG 2.1 Level AA** (mandatory) |
| Usability | **SUS score ≥ 80** |
| Legal Compliance | **ADA and Section 508** required |

**Recommended Tech Stack (React):**
- **Component Library**: Radix UI primitives + Tailwind CSS
- **Design Tokens**: Semantic tokens for theming and consistency
- **Testing**: Automated accessibility testing with axe-core

See `UXDesignSpec/tech-restrictions/accessibility-requirements.md` for prohibited patterns.

## Fallback Guidance

If `spice_sql` returns no results or errors:

1. **Acknowledge the gap** — "The ux_design_spec dataset doesn't have specific guidance on this topic."
2. **Apply WCAG 2.1 Level AA standards**:
   - **Perceivable**: Text alternatives, captions, adaptable layouts, distinguishable content
   - **Operable**: Keyboard accessible, enough time, seizure-safe, navigable
   - **Understandable**: Readable, predictable, input assistance
   - **Robust**: Compatible with assistive technologies
3. **Provide general UX best practices**:
   - **Clear hierarchy**: Visual weight guides attention
   - **Consistent patterns**: Reuse familiar UI components
   - **User feedback**: Immediate response to actions
   - **Error prevention**: Validate input, confirm destructive actions
   - **Mobile-first**: Design for smallest screens, scale up
4. **Recommend next steps** — Update ux_design_spec or consult design team

## WCAG 2.1 Level AA Key Requirements

**Text:**
- Contrast ratio 4.5:1 for normal text, 3:1 for large text
- Text can be resized up to 200% without loss of content
- No images of text (use real text)

**Interactive Elements:**
- All functionality available via keyboard
- Focus indicators visible and clear
- No keyboard traps
- Skip navigation links for screen readers

**Forms:**
- Labels for all form inputs
- Error messages that identify and describe errors
- Suggestions for fixing errors
- Confirmation for submissions that cause legal/financial transactions

**Media:**
- Captions for prerecorded audio/video
- Audio descriptions for video content
- No auto-playing audio for more than 3 seconds

## Examples

**User asks:** "How do we make this form accessible for screen readers?"

**Response approach:**
1. Query: `vector_search(ux_design_spec, 'accessible forms screen readers best practices')` + `text_search(ux_design_spec, 'form accessibility ARIA label screen reader', content)`
2. Apply WCAG 2.1 AA: Labels, error messages, keyboard navigation
3. Cite: Reference `UXDesignSpec/patterns/accessible-forms.md`
4. Fallback: If no results, recommend `<label>` elements, `aria-describedby` for errors, logical tab order

**User asks:** "What color contrast ratio do we need for button text?"

**Response approach:**
1. Query: `vector_search(ux_design_spec, 'color contrast requirements buttons')` + `text_search(ux_design_spec, 'contrast ratio WCAG button text', content)`
2. Apply WCAG 2.1 AA: 4.5:1 for normal text, 3:1 for large text (18pt+)
3. Cite: Reference `UXDesignSpec/accessibility/color-contrast.md`
4. Fallback: If no results, cite WCAG 2.1 SC 1.4.3 (Contrast Minimum)

**User asks:** "Should we use Radix UI or build our own components?"

**Response approach:**
1. Query: `vector_search(ux_design_spec, 'component library selection Radix UI')` + `text_search(ux_design_spec, 'Radix UI component library React', content)`
2. Apply org standards: Radix UI + Tailwind recommended
3. Cite: Reference `UXDesignSpec/tech-restrictions/recommended-libraries.md`
4. Fallback: If no results, recommend Radix for built-in accessibility, unstyled primitives work with Tailwind
