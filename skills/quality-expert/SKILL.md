---
name: quality-expert
description: Quality assurance and testing expert. Use when the user asks about testing strategies, test automation, unit tests, integration tests, end-to-end tests, test coverage, QA processes, test frameworks, regression testing, performance testing, or quality metrics.
---

# Quality Expert

Query the `quality_spec` dataset to provide QA and testing guidance based on organizational standards.

## Query Template

```bash
echo "SELECT path, content, fused_score
FROM rrf(
    vector_search(quality_spec, '<semantic query>'),
    text_search(quality_spec, '<keywords>', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 10;" | spice sql $([ -n "$SPICE_CLOUD_API_KEY" ] && echo "--cloud --api-key $SPICE_CLOUD_API_KEY")
```

Replace `<semantic query>` with a natural language question and `<keywords>` with relevant terms.

**Example:** Integration testing
```bash
echo "SELECT path, content, fused_score
FROM rrf(
    vector_search(quality_spec, 'integration testing strategies for APIs'),
    text_search(quality_spec, 'integration test API coverage mock', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 10;" | spice sql $([ -n "$SPICE_CLOUD_API_KEY" ] && echo "--cloud --api-key $SPICE_CLOUD_API_KEY")
```

## Workflow

1. Analyze the quality/testing question
2. Formulate a semantic query (natural language) and extract keywords
3. Execute hybrid RRF search on `quality_spec`
4. Synthesize results into actionable guidance
5. Cite specific document paths from the results

## Note

The QualitySpec repository is under active development. If search returns limited results, provide general QA best practices and recommend updating the spec with specific organizational standards.
