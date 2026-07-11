# Source Traceability

Every critical claim made by the AI Assistant or the portfolio must trace back to verifiable evidence.

| Fact / Claim | Source Document | Evidence | Confidence | Verification Status |
|--------------|-----------------|----------|------------|---------------------|
| 14-person team management | `experience/transworld.md` | Job Title: IT Manager | High | Verified |
| 18% SLA fault reduction | `experience/transworld.md` | NOC Automation Script | High | Verified |
| 500k monthly visitors | `experience/novasole.md` | 10M PKR avg monthly sales | High | Verified |
| Sub-500ms voice latency | `projects/voicerag.md` | WebSocket/Groq Architecture | High | Verified |
| Zero hallucinations | `projects/self-healing-rag.md` | CRAG Implementation | High | Verified |

## Traceability Policy
The AI Assistant must *never* invent new metrics. If a user asks for exact AWS server costs, and it is not documented in `projects/`, the AI must explicitly state: "I don't have access to the specific AWS billing metrics, but I can tell you the architecture was optimized using Edge Caching."
