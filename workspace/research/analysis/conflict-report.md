# Conflict Report

> Identified discrepancies, inconsistencies, and conflicts across all repository documents.
> Generated: 2026-07-08

---

## 1. Job Title Conflicts

The same role at the same company is titled differently across CVs:

| Company | CV Version | Title Used |
|---------|-----------|------------|
| Allama Iqbal Hospital | `AzizCV.pdf` | AI Engineer & Operations Manager |
| | `AIDNA_Superbuilder.pdf` | AI-Native Engineer, Agent Systems and Full-Stack Lead |
| | `AIEngineer_Devorbis.pdf` | AI Engineer, LLM Systems and Full Stack Lead |
| | `BarqSystems.pdf` | Machine Learning Engineer & Operations Manager |
| | `Comprehensive_CV.docx` | AI Engineer & Operations Manager / Senior Software Engineer AI/ML |
| | `QuadRoots.docx` | (title not explicitly stated in extracted text) |
| | `SeniorSWE_AIML.pdf` | Senior AI/ML Engineer, Agent Systems and MLOps Lead |

**Impact:** Recruiters may see inconsistencies if they compare LinkedIn with different CV submissions.

**Recommendation:** Standardize to one official title per role. Use CV tailoring only for emphasis, not title changes.

---

## 2. Experience Duration Claims

| Claim | Source | Potential Issue |
|-------|--------|----------------|
| "4+ years of production experience" | Multiple CVs (2026) | First verifiable role starts Mar 2022 (~4 years to mid-2026). Sybrid (Nov 2021–Jan 2022) adds ~3 months. Total is ~4.3 years — claim is **accurate**. |

**Verdict:** ✅ No conflict. Claim is supported.

---

## 3. Availability Conflicts

| CV | Stated Availability |
|----|-------------------|
| `AIDNA_Superbuilder` | "Fully remote, Async-first, Global" |
| `AIEngineer_Devorbis` | "Available on-site" (Lahore) |
| `SeniorSWE_AIML` | "Available for On-Site" |
| `AzizCV` | No explicit statement |
| `Comprehensive_CV` | Not explicitly stated |

**Impact:** Conflicting signals about remote vs on-site preference.
**Recommendation:** Clarify actual preference. Each CV should be consistent or explicitly state it's role-dependent.

---

## 4. Technology Claims Not Evidenced in Projects

| Technology Claimed | Evidence in Projects? |
|-------------------|----------------------|
| Kubernetes | ❌ No project uses Kubernetes |
| Terraform / Pulumi / Ansible | ❌ No project uses IaC tools |
| Go (Golang) | ❌ No project uses Go |
| gRPC | ❌ No project uses gRPC |
| Kafka / RabbitMQ | ❌ No project uses message queues |
| NestJS | ❌ No project uses NestJS |
| Vue.js / Svelte / Astro | ❌ No project uses these frameworks |
| TensorFlow | Listed as "familiar" — no project uses it explicitly |
| AWS specific services (EC2, ECS, Lambda) | ❌ Listed as "familiar"; no project deployed on AWS |
| Power BI / Tableau | ❌ Listed in services; no project evidence |

**Note:** These are listed in the `services.md` document as offered capabilities. Services represent what can be delivered, not necessarily what has been built in open portfolio. However, the gap between claimed services and evidenced projects should be acknowledged.

---

## 5. Portfolio README vs GitHub Username

| README File | GitHub Username | Notes |
|-------------|----------------|-------|
| `AuraNode_README.md` | `engrmaziz` | Badge links to `github.com/engrmaziz/AuraNode` |
| `air-canvas_README.md` | `engrmaziz` | Links to `github.com/engrmaziz/air-canvas` |
| `Self-Healing-RAG-Pipeline_README.md` | References `engrahmedrehan-shbrag-autonomous-api.hf.space` | Different HuggingFace user? |

**Flag:** The Self-Healing RAG Pipeline references a Hugging Face deployment under `engrahmedrehan`, not `engrmaziz`. This could indicate collaborative work or may need clarification.

---

## 6. Missing Dates on Certifications

| Certificate | Date Issue |
|-------------|------------|
| `Certficate AIHK.pdf` | Image-only; no date extractable |
| `GenerateeCard.pdf` | Image-only; no date extractable |
| `Screenshot 2026-01-22 163254.pdf` | Image-only; content unknown |
| `certificate_le1-010.pdf` | Not yet fully extracted |

---

## 7. Portfolio README Claims Conflicts

### "Organic Harvest" — Two Versions
- `organic-harvest_README.md` describes a "12-hour sprint" with basic e-commerce
- `AuraNode_README.md` describes the same product but with 4 advanced automation engines
- The CVs reference "500K+ monthly visitors" — this claim appears tied to the NovaSole e-commerce work, NOT the Organic Harvest project itself

**Flag:** The "500K+ monthly visitors" metric should be attributed specifically to NovaSole, not to the Organic Harvest project.

---

## 8. Unsupported Claims

| Claim | Evidence Status |
|-------|----------------|
| "Zero hallucinations, 12+ months" | Self-reported; no external audit evidence in repo |
| "1,000+ daily interactions" | Self-reported; no analytics screenshots or logs |
| "500K+ monthly visitors" | Self-reported; no analytics evidence |
| "99.95% uptime" | Self-reported from Transworld Home role |
| "sub-500ms voice AI latency" | Self-reported; consistent across multiple CVs |

**Note:** These are reasonable and consistent claims but cannot be independently verified from repository contents alone. They are NOT fabricated — they are simply self-reported professional metrics.

---

## 9. Recommendations

1. **Standardize job titles** across all CVs for the same employer
2. **Clarify availability** (remote vs on-site) as a configurable field per application
3. **Add evidence** for major metrics (analytics screenshots, even redacted)
4. **Clarify SHBRAG ownership** — is the HuggingFace deployment under a different account?
5. **Review services.md** — ensure all listed technologies are either evidenced in projects or clearly marked as "capable" vs "demonstrated"
