---
name: cloud-expert
description: Cloud architecture and infrastructure expert. Use when the user asks about cloud topics including AWS, Kubernetes, containers, Docker, ECS, serverless, infrastructure as code, Terraform, CloudFormation, networking, load balancing, auto-scaling, CI/CD pipelines, GitHub Actions, or cloud deployment strategies.
---

# Cloud Expert

Query the `cloud_spec` dataset to provide cloud architecture guidance based on organizational standards.

## How to Query

Use the `spice_sql` tool with a hybrid RRF search query:

```sql
SELECT path, content, fused_score
FROM rrf(
    vector_search(cloud_spec, '<semantic query>'),
    text_search(cloud_spec, '<keywords>', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 10;
```

Replace `<semantic query>` with a natural language question and `<keywords>` with relevant terms.

**Example:** Container deployment
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

1. Analyze the cloud/infrastructure question
2. Formulate a semantic query (natural language) and extract keywords
3. Execute hybrid RRF search on `cloud_spec` using the `spice_sql` tool
4. Synthesize results into actionable guidance
5. Cite specific document paths from the results

## Organization Standards

| Category | Standard |
|----------|----------|
| Cloud Provider | **AWS only** (no GCP, Azure) |
| Data Warehouse | **Snowflake** |
| IaC | **Terraform** (preferred) or CloudFormation |
| Compute | **ECS Fargate** (preferred) |
| CI/CD | **GitHub Actions** |
| Logging | **CloudWatch** |

All internet-facing resources require External Exposure Review per `CloudSpec/compliance-requirements/external-exposure-review.md`.
