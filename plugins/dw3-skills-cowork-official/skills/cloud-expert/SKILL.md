---
name: cloud-expert
description: Provides cloud architecture and infrastructure guidance when the user discusses AWS, Kubernetes, containers, Docker, ECS, serverless, infrastructure as code, Terraform, CloudFormation, networking, load balancing, auto-scaling, CI/CD pipelines, GitHub Actions, or cloud deployment strategies.
---

# Cloud Architecture Expert

Query organizational cloud standards from the `cloud_spec` dataset using SpiceAI hybrid search.

## When to Use This Skill

Activate when the user asks about:
- AWS services and architecture patterns
- Container orchestration (Kubernetes, ECS, Docker)
- Infrastructure as code (Terraform, CloudFormation)
- Cloud networking, load balancing, auto-scaling
- CI/CD pipelines and deployment strategies
- Serverless architectures
- GitHub Actions workflows

## How to Query

Use the `spice_sql` tool with hybrid RRF (Reciprocal Rank Fusion) search:

```sql
SELECT path, LEFT(content, 500) as content_preview, fused_score
FROM rrf(
    vector_search(cloud_spec, '<natural language query>'),
    text_search(cloud_spec, '<keywords>', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 5;
```

**Query Construction:**
- `<natural language query>`: Semantic description of what the user needs (e.g., "best practices for container deployment in production")
- `<keywords>`: Space-separated technical terms from the question (e.g., "ECS Fargate container deployment scaling")
- `LEFT(content, 500)`: Truncates content to first 500 characters to keep responses manageable
- `LIMIT 5`: Returns top 5 results for focused synthesis

**Example Query:**
```sql
SELECT path, LEFT(content, 500) as content_preview, fused_score
FROM rrf(
    vector_search(cloud_spec, 'container deployment best practices for production'),
    text_search(cloud_spec, 'ECS Fargate container deployment scaling', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 5;
```

## Workflow

1. **Analyze the question** — Identify the core cloud/infrastructure need
2. **Formulate queries** — Create a semantic query and extract keywords
3. **Execute search** — Use the `spice_sql` tool with the RRF query
4. **Synthesize results** — Combine search results with general cloud best practices
5. **Cite sources** — Reference specific document paths from the search results

## How to Synthesize Results

When the `spice_sql` tool returns results:

1. **Parse the tool output** — Extract `path`, `content_preview`, and `fused_score` from each row
2. **Focus on top 3-5 results** — Prioritize by `fused_score` (higher is better)
3. **Extract key guidance** — Summarize the main points from each `content_preview`
4. **Cite sources** — Reference the `path` field for each insight (e.g., "Per `CloudSpec/deployment-patterns/ecs-microservices.md`...")
5. **Combine with best practices** — Supplement dataset results with general AWS Well-Architected Framework principles
6. **Handle large responses** — If tool output is too large, focus on the top 3 results only and mention that additional results are available

**Example synthesis:**
```
Based on the cloud_spec dataset, here's the recommended approach:

1. **Use ECS Fargate for containerized workloads** (CloudSpec/deployment-patterns/ecs-microservices.md)
   - The organization standardizes on Fargate to reduce operational overhead
   - Configure auto-scaling based on CPU/memory thresholds

2. **Implement External Exposure Review** (CloudSpec/compliance-requirements/external-exposure-review.md)
   - All internet-facing resources require security review before deployment
   - Use ALB with WAF for public endpoints

3. **Follow Terraform patterns** (CloudSpec/infrastructure/terraform-standards.md)
   - Infrastructure as code is mandatory for production resources
   - Use modules from the approved registry
```

## Organization Standards

This organization follows these cloud standards:

| Category | Standard |
|----------|----------|
| Cloud Provider | **AWS only** (no GCP, Azure) |
| Data Warehouse | **Snowflake** |
| Infrastructure as Code | **Terraform** (preferred) or CloudFormation |
| Compute | **ECS Fargate** (preferred) |
| CI/CD | **GitHub Actions** |
| Logging | **CloudWatch** |

**Important:** All internet-facing resources require External Exposure Review per `CloudSpec/compliance-requirements/external-exposure-review.md`.

## Fallback Guidance

Handle different error scenarios:

**1. No results found:**
- Acknowledge: "The cloud_spec dataset doesn't have specific guidance on this topic."
- Provide general AWS best practices aligned with the organization's standards
- Use AWS Well-Architected Framework principles as baseline
- Recommend updating the spec repository or consulting with the cloud architecture team

**2. Results too large to process:**
- Focus on top 3 results only
- Acknowledge: "The cloud_spec dataset has extensive guidance on this topic. Here are the top recommendations..."
- Provide synthesis from the most relevant results
- Suggest more specific queries if the user needs details

**3. Tool timeout or error:**
- Acknowledge: "Unable to query the cloud_spec dataset at this time."
- Provide general best practices based on organization standards above
- Recommend retrying with a more specific query
- Fall back to AWS Well-Architected Framework principles

**4. Malformed or unexpected response:**
- Log the issue for investigation
- Provide general guidance based on organization standards
- Recommend manual consultation of the CloudSpec repository

## Examples

**User asks:** "How should we deploy a new microservice to production?"

**Response approach:**
1. Query: `vector_search(cloud_spec, 'microservice deployment production best practices')` + `text_search(cloud_spec, 'ECS Fargate deployment microservice production', content)`
2. Synthesize: Combine results with ECS Fargate deployment patterns
3. Cite: Reference specific docs like `CloudSpec/deployment-patterns/ecs-microservices.md`
4. Advise: Recommend External Exposure Review if the service is internet-facing

**User asks:** "What's the best way to handle secrets in our CI/CD pipeline?"

**Response approach:**
1. Query: `vector_search(cloud_spec, 'secrets management CI/CD GitHub Actions')` + `text_search(cloud_spec, 'secrets GitHub Actions AWS Secrets Manager', content)`
2. Synthesize: GitHub Actions secrets + AWS Secrets Manager integration
3. Cite: Reference `CloudSpec/ci-cd/secrets-management.md`
4. Fallback: If no results, recommend AWS Secrets Manager with IAM role-based access, never hardcoded credentials
