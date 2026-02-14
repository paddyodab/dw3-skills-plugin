# DW3 Skills - Cowork Official Edition

Domain expert skills for cloud architecture, security compliance, QA, and UX design powered by SpiceAI hybrid search. Built specifically for Claude Cowork using official plugin creation patterns.

## What This Plugin Provides

**Four Expert Domains:**
- **Cloud Architecture** — AWS, infrastructure as code, containers, CI/CD
- **Security & Compliance** — HIPAA, HITRUST, SOC2, authentication, encryption
- **Quality Assurance** — Testing strategies, automation, coverage, QA processes
- **UX Design & Accessibility** — WCAG 2.1 AA, usability, design systems

**Two Ways to Use:**
1. **Auto-trigger** — Skills activate automatically when you discuss relevant topics
2. **Explicit commands** — `/cloud-expert`, `/security-expert`, `/quality-expert`, `/ux-design-expert`

## How It Works

This plugin queries your organization's SpiceAI datasets using hybrid RRF (Reciprocal Rank Fusion) search, which combines:
- **Vector search** — Semantic/conceptual understanding
- **Text search** — Exact keyword and acronym matching

The MCP server wraps the `spice sql` CLI, running on your host machine where `spice` is installed, and bridges results into the Cowork VM.

## Prerequisites

**Required:**
- Claude Cowork (desktop app)
- `spice` CLI installed on your host machine ([installation guide](https://docs.spiceai.org/))
- `SPICE_CLOUD_API_KEY` environment variable set
- Node.js installed (for the MCP server)
- SpiceAI datasets populated: `cloud_spec`, `security_spec`, `quality_spec`, `ux_design_spec`

**Optional:**
- Organization-specific documentation in the SpiceAI datasets for best results

## Installation

### 1. Set Environment Variable

The MCP server needs your Spice Cloud API key:

```bash
export SPICE_CLOUD_API_KEY="your-api-key-here"
```

Add this to your shell profile (`~/.zshrc` or `~/.bashrc`) to persist across sessions.

### 2. Install MCP Server Dependencies

Navigate to the plugin's MCP server directory and install dependencies:

```bash
cd /path/to/plugin/mcp-server
npm install
```

### 3. Install the Plugin

**Option A: From marketplace** (if published)
```
1. Open Claude Cowork
2. Go to Plugins
3. Add marketplace: <your-org>/dw3-skills-plugin
4. Install: dw3-skills-cowork-official
```

**Option B: Local installation**
```
1. Open Claude Cowork
2. Go to Plugins
3. Upload the .plugin file
```

### 4. Verify Installation

After installing, check that:
- Skills appear in the plugin list
- Commands are available: try `/cloud-expert` in a chat
- MCP server starts without errors (check Cowork logs)

## Usage Examples

### Auto-Trigger (Skills)

Just ask questions naturally — the relevant skill activates automatically:

```
"How should we deploy a new microservice to production?"
→ cloud-expert skill activates, queries cloud_spec

"Do we need MFA for this internal admin tool?"
→ security-expert skill activates, queries security_spec

"What test coverage should we aim for?"
→ quality-expert skill activates, queries quality_spec

"How do we make this form accessible for screen readers?"
→ ux-design-expert skill activates, queries ux_design_spec
```

### Explicit Commands

Invoke experts directly with slash commands:

```
/cloud-expert
How should we handle secrets in our CI/CD pipeline?

/security-expert
What are the HIPAA requirements for audit log retention?

/quality-expert
Should we write E2E tests before or after unit tests?

/ux-design-expert
What color contrast ratio do we need for button text?
```

## Troubleshooting

### MCP Server Won't Start

**Symptoms:** Skills work but queries return "Failed to execute spice command"

**Fixes:**
1. Verify `spice` is on your PATH: `which spice`
2. Check `SPICE_CLOUD_API_KEY` is set: `echo $SPICE_CLOUD_API_KEY`
3. Test `spice` manually: `echo "SELECT 1;" | spice sql --cloud --api-key YOUR_KEY`
4. Check MCP server logs in Cowork debug console

### No Results from Queries

**Symptoms:** Queries run but return empty results

**Fixes:**
1. Verify datasets are populated in Spice Cloud
2. Check dataset names match: `cloud_spec`, `security_spec`, `quality_spec`, `ux_design_spec`
3. Test queries directly via `spice sql` CLI
4. Review query syntax in SKILL.md files

### Skills Not Auto-Triggering

**Symptoms:** Must use slash commands; skills don't activate automatically

**Fixes:**
1. Use technical keywords from skill descriptions (AWS, HIPAA, testing, WCAG)
2. Check skill frontmatter `description` fields include trigger phrases
3. Skills may take 1-2 messages to activate in new conversations

## Organization Standards

This plugin is configured for an organization with these standards:

**Cloud:**
- AWS only (no GCP/Azure)
- Terraform for IaC
- ECS Fargate for compute
- GitHub Actions for CI/CD

**Security:**
- Healthcare industry (HIPAA applies)
- HITRUST certified
- SOC2 Type II required

**UX:**
- WCAG 2.1 Level AA mandatory
- SUS score ≥ 80 required
- ADA and Section 508 compliance

To adapt for your organization, update the SpiceAI datasets with your specific standards and documentation.

## Architecture

```
Plugin Structure:
├── .claude-plugin/
│   └── plugin.json                   # Plugin manifest
├── commands/
│   ├── cloud-expert.md              # /cloud-expert command
│   ├── security-expert.md           # /security-expert command
│   ├── quality-expert.md            # /quality-expert command
│   └── ux-design-expert.md          # /ux-design-expert command
├── skills/
│   ├── cloud-expert/SKILL.md        # Auto-trigger cloud skill
│   ├── security-expert/SKILL.md     # Auto-trigger security skill
│   ├── quality-expert/SKILL.md      # Auto-trigger QA skill
│   └── ux-design-expert/SKILL.md    # Auto-trigger UX skill
├── mcp-server/
│   ├── index.js                     # MCP server implementation
│   └── package.json                 # Node dependencies
├── .mcp.json                        # MCP server config
└── README.md                        # This file
```

**Data Flow:**
1. User asks a question in Cowork
2. Skill activates (auto or via command)
3. Skill constructs hybrid RRF SQL query
4. Query sent to `spice_sql` MCP tool
5. MCP server (running on host) executes `spice sql` CLI
6. Results returned to Cowork VM
7. Claude synthesizes answer with citations

## License

See LICENSE file in the parent repository.

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Cowork logs and MCP server output
3. Test `spice` CLI directly to isolate issues
4. Verify SpiceAI datasets are accessible and populated
