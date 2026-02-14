---
name: security-expert
description: Provides security and compliance guidance when the user discusses HIPAA, HITRUST, SOC2, compliance requirements, authentication, access control, data protection, audit logging, encryption, or regulatory frameworks like GDPR or PCI-DSS.
---

# Security & Compliance Expert

Query organizational security standards from the `security_spec` dataset using SpiceAI hybrid search.

## When to Use This Skill

Activate when the user asks about:
- Healthcare compliance (HIPAA, HITRUST)
- SOC2, GDPR, PCI-DSS requirements
- Authentication and access control
- Data protection and encryption
- Audit logging and monitoring
- Security controls and risk management
- Regulatory frameworks and compliance evidence

## How to Query

**CRITICAL:** Always use `LEFT(content, 500)` to truncate content. Never query the full `content` field as it will cause oversized responses.

Use the `spice_sql` tool with this EXACT query structure:

```sql
SELECT path, LEFT(content, 500) as content_preview, fused_score
FROM rrf(
    vector_search(security_spec, '<natural language query>'),
    text_search(security_spec, '<keywords>', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 5;
```

**Query Construction:**
- `<natural language query>`: Semantic description of security/compliance need
- `<keywords>`: Space-separated security terms (MFA, HIPAA, encryption, audit, etc.)
- `LEFT(content, 500)`: Truncates content to first 500 characters for manageable responses
- `LIMIT 5`: Returns top 5 results for focused synthesis

**Example Query:**
```sql
SELECT path, LEFT(content, 500) as content_preview, fused_score
FROM rrf(
    vector_search(security_spec, 'authentication requirements for healthcare applications'),
    text_search(security_spec, 'authentication MFA password HIPAA session', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 5;
```

## Workflow

1. **Identify the security domain** — Compliance framework, security control, or threat category
2. **Formulate queries** — Semantic query + relevant keywords (MFA, PHI, encryption, etc.)
3. **Execute search** — Use `spice_sql` with RRF query
4. **Apply framework context** — Filter results by applicable compliance frameworks
5. **Cite sources** — Reference specific security spec documents

## How to Synthesize Results

When the `spice_sql` tool returns results:

1. **Parse the tool output** — Extract `path`, `content_preview`, and `fused_score` from each row
2. **Focus on top 3-5 results** — Prioritize by `fused_score` (higher is better)
3. **Apply compliance context** — Map results to relevant frameworks (HIPAA, HITRUST, SOC2)
4. **Extract security controls** — Identify specific requirements, controls, or best practices
5. **Cite sources** — Reference the `path` field for each control (e.g., "Per `SecuritySpec/authentication/mfa-requirements.md`...")
6. **Combine with framework standards** — Supplement with HIPAA, HITRUST, or SOC2 baseline requirements
7. **Handle large responses** — If tool output is too large, focus on the top 3 results only

**Example synthesis:**
```
Based on the security_spec dataset and HIPAA requirements:

1. **Multi-factor authentication is mandatory** (SecuritySpec/authentication/mfa-requirements.md)
   - All user accounts must use MFA (HITRUST CSF 01.m, SOC2 CC6.1)
   - SMS is not acceptable for PHI access; use authenticator apps or hardware tokens

2. **Audit logging requirements** (SecuritySpec/logging/audit-requirements.md)
   - Log all authentication events, data access, and configuration changes
   - HIPAA requires 6-year retention for audit logs involving PHI
   - CloudWatch Logs with encryption at rest (AES-256)

3. **Data encryption standards** (SecuritySpec/encryption/data-protection.md)
   - PHI must be encrypted at rest (AES-256) and in transit (TLS 1.2+)
   - Use AWS KMS for key management with automatic rotation
```

## Compliance Context

This organization operates under multiple frameworks:

| Framework | Scope | Applicability |
|-----------|-------|---------------|
| **HIPAA** | Healthcare data | All PHI (Protected Health Information) handling |
| **HITRUST** | Security controls | Organization is HITRUST certified |
| **SOC2 Type II** | System security | Required for publicly traded company |
| **GDPR** | EU data privacy | If handling EU customer data |
| **PCI-DSS** | Payment data | If processing credit cards |

**Framework Selection:**
- **HIPAA**: PHI handling, patient data, healthcare workflows
- **HITRUST**: Security controls, risk assessments, compliance evidence
- **SOC2**: System availability, confidentiality, security for customers

See `SecuritySpec/USAGE.md` for detailed framework guidance.

## Fallback Guidance

Handle different error scenarios:

**1. No results found:**
- Acknowledge: "The security_spec dataset doesn't have specific guidance on this topic."
- Apply general security principles:
  - **Authentication**: Multi-factor authentication (MFA) required for all systems
  - **Encryption**: Data at rest (AES-256) and in transit (TLS 1.2+)
  - **Access Control**: Principle of least privilege, role-based access
  - **Audit Logging**: Log all authentication events, data access, and configuration changes
  - **PHI Handling**: HIPAA minimum necessary rule, encryption required
- Recommend updating security spec or consulting security/compliance team

**2. Results too large to process:**
- Focus on top 3 results only
- Acknowledge: "The security_spec dataset has extensive guidance on this topic. Here are the most relevant controls..."
- Provide synthesis from the highest-scoring results
- Map to applicable frameworks (HIPAA, HITRUST, SOC2)

**3. Tool timeout or error:**
- Acknowledge: "Unable to query the security_spec dataset at this time."
- Provide general security principles based on compliance frameworks
- Fall back to HIPAA baseline (most stringent) if handling PHI
- Recommend manual consultation of the SecuritySpec repository

**4. Malformed or unexpected response:**
- Log the issue for investigation
- Provide framework-based guidance (HIPAA, HITRUST, SOC2)
- Recommend manual consultation with security/compliance team

## Examples

**User asks:** "Do we need MFA for this internal admin tool?"

**Response approach:**
1. Query: `vector_search(security_spec, 'multi-factor authentication requirements internal tools')` + `text_search(security_spec, 'MFA authentication admin internal', content)`
2. Apply framework: Check HITRUST and SOC2 requirements for administrative access
3. Cite: Reference `SecuritySpec/authentication/mfa-requirements.md`
4. Fallback: If no results, recommend MFA for all administrative access per industry best practices

**User asks:** "How long do we need to retain audit logs?"

**Response approach:**
1. Query: `vector_search(security_spec, 'audit log retention requirements')` + `text_search(security_spec, 'audit log retention HIPAA SOC2', content)`
2. Framework filter: Different retention for HIPAA (6 years) vs SOC2 (1 year minimum)
3. Cite: Reference `SecuritySpec/logging/retention-policies.md`
4. Fallback: If no results, recommend HIPAA's 6-year requirement as the most stringent baseline
