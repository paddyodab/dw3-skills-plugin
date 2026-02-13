---
name: quality-expert
description: Quality assurance and testing expert. Use when the user asks about testing strategies, test automation, unit tests, integration tests, end-to-end tests, test coverage, QA processes, test frameworks, regression testing, performance testing, or quality metrics.
---

# Quality Expert

Query the `quality_spec` dataset to provide QA and testing guidance based on organizational standards.

## How to Query

Use the `spice_sql` tool with a hybrid RRF search query:

```sql
SELECT path, content, fused_score
FROM rrf(
    vector_search(quality_spec, '<semantic query>'),
    text_search(quality_spec, '<keywords>', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 10;
```

Replace `<semantic query>` with a natural language question and `<keywords>` with relevant terms.

**Example:** Integration testing
```sql
SELECT path, content, fused_score
FROM rrf(
    vector_search(quality_spec, 'integration testing strategies for APIs'),
    text_search(quality_spec, 'integration test API coverage mock', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 10;
```

## Workflow

1. Analyze the quality/testing question
2. Formulate a semantic query (natural language) and extract keywords
3. Execute hybrid RRF search on `quality_spec` using the `spice_sql` tool
4. Synthesize results into actionable guidance
5. Cite specific document paths from the results

## Note

The QualitySpec repository is under active development. If search returns limited results, provide general QA best practices and recommend updating the spec with specific organizational standards.
