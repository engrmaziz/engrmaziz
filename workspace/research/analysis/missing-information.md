# Missing Information Report

> Gaps, absent data, and information that could not be found in the repository.
> Generated: 2026-07-08

---

## 1. Missing Evidence / Supporting Materials

| Missing Item | Expected Location | Impact |
|-------------|-------------------|--------|
| Analytics screenshots (traffic, users) | Should be in CVs or projects | Cannot verify "500K+ monthly visitors" or "1,000+ daily interactions" |
| LLM evaluation results / reports | Expected with llm-eval-cicd project | Cannot verify "zero hallucinations" claim |
| Published research paper PDF | Expected in certifications/ | Only citation exists; actual paper not in repo |
| PEC registration card content | `GenerateeCard.pdf` is image-only | Cannot extract registration details |
| Hospital award certificate content | `Certficate AIHK.pdf` is image-only | Cannot verify award details |
| Screenshot PDF content | `Screenshot 2026-01-22 163254.pdf` is image-only | Unknown content |
| `certificate_le1-010.pdf` details | certifications/ | Not fully identified |

---

## 2. Missing Project READMEs / Documentation

| System Described in CVs | Has README? | Notes |
|------------------------|-------------|-------|
| Hospital Multi-Agent System (production) | ❌ No | Core system referenced in all CVs; likely private/proprietary |
| Hospital n8n Automation (16-node) | ❌ No | Internal workflow system |
| NovaSole E-Commerce Platform | ❌ No | Likely proprietary; AuraNode is a separate personal project |
| Ihsan Solar NOC System | ❌ No | Internal monitoring system |
| Transworld Home Operations | ❌ No | ISP operations — no software output expected |
| Voice AI Agent (Vapi/Retell) | Partial | `voice-rag_README.md` exists but may not cover the hospital implementation |
| DeepEval Evaluation Pipeline | Partial | `llm-eval-cicd_README.md` exists but may not include production configs |
| Ghost Assist | ❌ Limited | README exists but content not fully examined |

---

## 3. Missing Personal Information

| Missing Field | Status | Notes |
|--------------|--------|-------|
| Date of Birth | Not provided | Expected for some international applications |
| Nationality / Citizenship | Implied Pakistani | Never explicitly stated |
| Passport / Visa Status | Not provided | Relevant for remote international work |
| Marital Status | Not provided | Sometimes requested in some countries |
| Professional Photo | Not in repo | CVs may need headshot for some markets |

---

## 4. Missing Certification PDFs

The following certifications are listed in CVs but have **no corresponding PDF** in the `certifications/` folder:

| Certification | Provider | Date |
|--------------|----------|------|
| Google AI Professional Certificate | Google / Coursera | Apr 2026 |
| AI Fluency: Framework & Foundations | Anthropic / UCC | 2026 |
| PyTorch & Deep Learning for Decision Makers (LFS116) | Linux Foundation | 2026 |
| Fundamentals of Predictive Project Management | PMI | 2025 |
| General Principles of Engineering Ethics (1 PDH) | Professional Engineering | Aug 2025 |
| Registered Electrical Engineer (PEC) | PEC | Active since 2021 |

**Note:** The PEC registration may be partially evidenced by `GenerateeCard.pdf` (image-only).

---

## 5. Missing Deployment Evidence

| Project | Live URL in README? | Deployment Status |
|---------|--------------------|--------------------|
| AegisFlow | ❌ No | Unknown |
| Collab | ❌ No | Unknown |
| Self-Healing-RAG | ✅ HuggingFace Space link | May be active |
| dentl2 | ❌ No | Unknown |
| dentl3 | ✅ GitHub Pages link | Likely active |
| Green Navigator | ❌ No | Unknown |
| OpenScholar | ❌ No | Unknown |
| VoiceRAG | ❌ No | Unknown |

---

## 6. Missing Technical Details

| Gap | Description |
|-----|-------------|
| No `package.json` or `requirements.txt` | Only READMEs are in the repo; actual source code is in separate GitHub repos |
| No architecture diagrams as images | Only Mermaid diagrams in Markdown (Collab, dentl2) |
| No test reports | No test coverage or CI/CD pass rate evidence |
| No performance benchmarks | Claims about latency and throughput are not backed by benchmark data |

---

## 7. Missing Services Evidence

Services 30–33 in `services.md` have limited portfolio evidence:

| Service | Evidence Status |
|---------|----------------|
| 30. AI Training & Upskilling | No training materials or curricula in repo |
| 31. Digital Transformation Consulting | No consulting deliverables in repo |
| 32. NLP Services | Partially evidenced (LLM projects use NLP) |
| 33. Open Source Consulting | Partially evidenced (MCP servers are open source) |

---

## 8. Recommendations

1. **Add missing certification PDFs** (Google AI, Anthropic, Linux Foundation, PMI, PEC)
2. **OCR the image-only PDFs** (Certficate AIHK, GenerateeCard, Screenshot) to extract content
3. **Add deployment URLs** to project READMEs where possible
4. **Consider a case studies folder** for the proprietary hospital and NovaSole work (redacted)
5. **Add a professional headshot** for CV/portfolio use
6. **Create architecture diagram images** from the Mermaid diagrams for use outside Markdown
