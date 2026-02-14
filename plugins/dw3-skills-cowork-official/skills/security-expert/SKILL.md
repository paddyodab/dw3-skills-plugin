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

Use the `spice_sql` tool with hybrid RRF search:

```sql
SELECT path, content, fused_score
FROM rrf(
    vector_search(security_spec, '<natural language query>'),
    text_search(security_spec, '<keywords>', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 10;
```

**Example Query:**
```sql
SELECT path, content, fused_score
FROM rrf(
    vector_search(security_spec, 'authentication requirements for healthcare applications'),
    text_search(security_spec, 'authentication MFA password HIPAA session', content),
    join_key => 'path'
)
ORDER BY fused_score DESC
LIMIT 10;
```

## Workflow

1. **Identify the security domain** — Compliance framework, security control, or threat category
2. **Formulate queries** — Semantic query + relevant keywords (MFA, PHI, encryption, etc.)
3. **Execute search** — Use `spice_sql` with RRF query
4. **Apply framework context** — Filter results by applicable compliance frameworks
5. **Cite sources** — Reference specific security spec documents

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

If `spice_sql` returns no results or errors:

1. **Acknowledge the gap** — "The security_spec dataset doesn't have specific guidance on this topic."
2. **Apply general security principles**:
   - **Authentication**: Multi-factor authentication (MFA) required for all systems
   - **Encryption**: Data at rest (AES-256) and in transit (TLS 1.2+)
   - **Access Control**: Principle of least privilege, role-based access
   - **Audit Logging**: Log all authentication events, data access, and configuration changes
   - **PHI Handling**: HIPAA minimum necessary rule, encryption required
3. **Recommend next steps** — Update security spec or consult security/compliance team

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
