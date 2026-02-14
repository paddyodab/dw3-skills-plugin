---
name: quality-expert
description: Provides QA and testing guidance when the user discusses testing strategies, test automation, unit tests, integration tests, end-to-end tests, test coverage, QA processes, test frameworks, regression testing, performance testing, or quality metrics.
---

# Quality Assurance & Testing Expert

Query organizational QA standards from the `quality_spec` dataset using SpiceAI hybrid search.

## When to Use This Skill

Activate when the user asks about:
- Testing strategies and methodologies
- Test automation frameworks
- Unit, integration, and end-to-end testing
- Test coverage requirements and metrics
- QA processes and workflows
- Regression and performance testing
- Quality gates and CI/CD integration

## How to Query

Use the `spice_sql` tool with hybrid RRF search:

```sql
SELECT path, LEFT(content, 500) as content_preview, fused_score
FROM rrf(
    vector_search(quality_spec, '<natural language query>'),
    text_search(quality_spec, '<keywords>', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 5;
```

**Query Construction:**
- `<natural language query>`: Semantic description of testing/QA need
- `<keywords>`: Space-separated testing terms (unit, integration, coverage, mock, etc.)
- `LEFT(content, 500)`: Truncates content to first 500 characters for manageable responses
- `LIMIT 5`: Returns top 5 results for focused synthesis

**Example Query:**
```sql
SELECT path, LEFT(content, 500) as content_preview, fused_score
FROM rrf(
    vector_search(quality_spec, 'integration testing strategies for APIs'),
    text_search(quality_spec, 'integration test API coverage mock', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 5;
```

## Workflow

1. **Identify testing scope** — Unit, integration, E2E, performance, or process question
2. **Formulate queries** — Semantic query + testing keywords
3. **Execute search** — Use `spice_sql` with RRF query
4. **Apply testing best practices** — Combine results with general QA principles
5. **Cite sources** — Reference quality spec documents

## How to Synthesize Results

When the `spice_sql` tool returns results:

1. **Parse the tool output** — Extract `path`, `content_preview`, and `fused_score` from each row
2. **Focus on top 3-5 results** — Prioritize by `fused_score` (higher is better)
3. **Extract testing guidance** — Identify coverage requirements, testing patterns, or QA processes
4. **Apply test pyramid principles** — Map guidance to unit/integration/E2E testing layers
5. **Cite sources** — Reference the `path` field for each practice (e.g., "Per `QualitySpec/coverage-requirements.md`...")
6. **Combine with industry best practices** — Supplement with test pyramid, shift-left testing, automation-first principles
7. **Handle large responses** — If tool output is too large, focus on the top 3 results only

**Example synthesis:**
```
Based on the quality_spec dataset and testing best practices:

1. **Coverage requirements for APIs** (QualitySpec/coverage-requirements.md)
   - Unit test coverage: 80%+ for business logic and data transformations
   - Integration test coverage: 60%+ for API endpoints and database interactions
   - Block deployments if coverage drops below thresholds

2. **Testing strategy follows test pyramid** (QualitySpec/testing-strategies/test-pyramid.md)
   - Many fast unit tests (< 1ms each)
   - Fewer integration tests (database, external APIs)
   - Minimal E2E tests (critical user workflows only)

3. **Mocking and stubbing patterns** (QualitySpec/patterns/mocking-strategies.md)
   - Mock external dependencies in unit tests for speed and isolation
   - Use test databases (not production) for integration tests
   - Stub third-party APIs with contract testing
```

## Fallback Guidance

Handle different error scenarios:

**1. No results found:**
- Acknowledge: "The quality_spec repository is under development for this topic."
- Provide general QA best practices:
  - **Test Pyramid**: Many unit tests, fewer integration tests, minimal E2E tests
  - **Coverage Goals**: 80%+ unit test coverage for critical paths
  - **Test Isolation**: Each test should be independent and idempotent
  - **Automation First**: Automate regression tests, manual for exploratory
  - **Shift Left**: Test early in development, not just at the end
  - **Quality Gates**: Block deployments on test failures or coverage drops
- Recommend updating quality_spec with organizational standards

**2. Results too large to process:**
- Focus on top 3 results only
- Acknowledge: "The quality_spec dataset has extensive guidance on this topic. Here are the most relevant practices..."
- Provide synthesis from the highest-scoring results
- Apply test pyramid principles to organize guidance

**3. Tool timeout or error:**
- Acknowledge: "Unable to query the quality_spec dataset at this time."
- Provide industry-standard QA best practices
- Recommend testing frameworks based on tech stack (Jest for JS, pytest for Python)
- Fall back to test pyramid and shift-left testing principles

**4. Malformed or unexpected response:**
- Log the issue for investigation
- Provide general testing best practices
- Recommend manual consultation of the QualitySpec repository or QA team

## Testing Best Practices

**Unit Testing:**
- Test single functions/methods in isolation
- Mock external dependencies
- Fast execution (< 1ms per test)
- Cover edge cases, error conditions, and happy paths

**Integration Testing:**
- Test component interactions
- Use test databases, not production
- Slower but still automated
- Focus on API contracts and data flows

**End-to-End Testing:**
- Test full user workflows
- Run in staging environment
- Slowest, most brittle
- Keep minimal, focus on critical paths

**Performance Testing:**
- Load testing for expected traffic
- Stress testing for peak scenarios
- Establish performance baselines
- Monitor in CI/CD for regressions

## Examples

**User asks:** "What test coverage should we aim for in our new API service?"

**Response approach:**
1. Query: `vector_search(quality_spec, 'test coverage requirements API services')` + `text_search(quality_spec, 'coverage API unit integration percentage', content)`
2. Synthesize: Combine org standards with industry best practices
3. Cite: Reference `QualitySpec/coverage-requirements.md`
4. Fallback: If no results, recommend 80%+ unit coverage, 60%+ integration coverage

**User asks:** "Should we write E2E tests before or after unit tests?"

**Response approach:**
1. Query: `vector_search(quality_spec, 'testing strategy test pyramid order')` + `text_search(quality_spec, 'unit integration E2E test pyramid', content)`
2. Apply test pyramid: Unit tests first (fast feedback), then integration, then E2E
3. Cite: Reference `QualitySpec/testing-strategies/test-pyramid.md`
4. Fallback: If no results, recommend unit tests first for faster feedback cycles

**Note:** The QualitySpec repository may be under active development. If search results are limited, provide industry-standard QA guidance and recommend updating the spec with organizational practices.
