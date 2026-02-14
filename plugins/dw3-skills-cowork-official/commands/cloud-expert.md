---
description: Provide cloud architecture and AWS infrastructure guidance
---

Load the cloud-expert skill and provide guidance on the user's cloud architecture or infrastructure question.

Query the `cloud_spec` dataset using the `spice_sql` tool with hybrid RRF search. Combine organizational standards with AWS best practices.

Cite specific document paths from the search results. If the query returns no results, provide general AWS guidance aligned with the organization's standards (AWS-only, Terraform, ECS Fargate, GitHub Actions, CloudWatch).
