# Custom GitHub Copilot agents

These repository-level agent profiles are designed for the AI learning platform.

| Agent | Use it for |
|---|---|
| [Learning Platform Architect](learning-platform-architect.agent.md) | Architecture, technical planning, integrations, and implementation |
| [Source-Grounded Learning](source-grounded-learning.agent.md) | Source-only tutoring, retrieval, citations, and abstention |
| [Assessment Designer](assessment-designer.agent.md) | Quizzes, flashcards, feedback, remediation, and mastery tracking |
| [Quality and Security Auditor](quality-security-auditor.agent.md) | Independent quality, privacy, security, and evidence review |

## Important
These files define reusable specialist profiles for GitHub Copilot. They do not create four independently running services or provide AI inference by themselves. To run them in GitHub's Agents tab, the repository must have Copilot cloud agent enabled and the account must have an eligible paid Copilot plan. After the files are committed to the default branch, refresh the Agents tab and choose the required profile from the agent selector.
