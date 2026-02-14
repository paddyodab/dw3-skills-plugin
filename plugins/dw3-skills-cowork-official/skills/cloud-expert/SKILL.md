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
SELECT path, content, fused_score
FROM rrf(
    vector_search(cloud_spec, '<natural language query>'),
    text_search(cloud_spec, '<keywords>', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 10;
```

**Query Construction:**
- `<natural language query>`: Semantic description of what the user needs (e.g., "best practices for container deployment in production")
- `<keywords>`: Space-separated technical terms from the question (e.g., "ECS Fargate container deployment scaling")

**Example Query:**
```sql
SELECT path, content, fused_score
FROM rrf(
    vector_search(cloud_spec, 'container deployment best practices for production'),
    text_search(cloud_spec, 'ECS Fargate container deployment scaling', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 10;
```

## Workflow

1. **Analyze the question** — Identify the core cloud/infrastructure need
2. **Formulate queries** — Create a semantic query and extract keywords
3. **Execute search** — Use the `spice_sql` tool with the RRF query
4. **Synthesize results** — Combine search results with general cloud best practices
5. **Cite sources** — Reference specific document paths from the search results

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

If the `spice_sql` query returns no results or errors:

1. **Acknowledge the limitation** — "The cloud_spec dataset doesn't have specific guidance on this topic."
2. **Provide general AWS best practices** aligned with the organization's standards above
3. **Suggest next steps** — Recommend updating the spec repository or consulting with the cloud architecture team
4. **Use AWS Well-Architected Framework** principles as a baseline (security, reliability, performance, cost optimization, operational excellence)

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
