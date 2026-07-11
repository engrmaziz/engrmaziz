# Duplicate Analysis

> Cross-comparison of all documents for duplicates, older revisions, partial copies, and renamed files.
> Generated: 2026-07-08

---

## 1. CV Duplicates & Versions

All 7 CVs describe the **same person** (Musharraf Aziz) with the **same core experience**. They are NOT duplicates — they are **role-targeted variants** of the same professional history.

### Variant Classification

| CV | Target | Framing | Unique Content |
|----|--------|---------|----------------|
| `Musharraf_AzizCV.pdf` | Generic AI Engineer | Agentic AI + RAG | Baseline; no community work |
| `AIDNA_Superbuilder (1).pdf` | AI DNA / Superbuilder | AI-native engineer | AI operating model section; most narrative detail |
| `AIEngineer_Devorbis.pdf` | Devorbis (on-site) | AI Engineer Python | On-site Lahore; voice AI (Vapi, Deepgram) mentioned |
| `BarqSystems_AIEngineer_CV.pdf` | Barq Systems | ML Engineer | Reframed as ML lifecycle; no voice AI mention |
| `Comprehensive_CV (1).docx` | Master document | Senior SWE AI/ML | Everything; references, community, all certs |
| `QuadRoots_SeniorAIBackend (1).docx` | QuadRoots | AI Backend | RAG + Voice AI backend; Redis mentioned; shortest |
| `SeniorSWE_AIML.pdf` | Senior SWE AI/ML | Senior Engineer | Most comprehensive technical skills table |

### Key Differences Across CV Variants

| Element | Varies? | Details |
|---------|---------|---------|
| Job titles | ✅ Yes | "AI Engineer", "AI-Native Engineer", "Machine Learning Engineer", "Senior AI/ML Engineer" |
| Company names | ❌ Same | Allama Iqbal Hospital → NovaSole → Ihsan Solar → Transworld Home (consistent) |
| Employment dates | ❌ Same | Consistent across all |
| Projects listed | ✅ Yes | Varies by target role; some exclude voice AI, some exclude MCP |
| Skills emphasis | ✅ Yes | Some lead with Python/ML, others with agentic AI, others with backend |
| Availability | ✅ Yes | Some say "remote/async-first", others say "available on-site Lahore" |

---

## 2. Project Duplicates

### Organic Harvest — 2 README files
- `AuraNode_README.md` — Named "Organic Harvest" but repo is "AuraNode". Contains the **advanced version** with 4 automation engines (AI Smart-Bundling, Ghost Revenue Retriever, Drip Campaigns, Cryptographic Coupon Engine). GitHub Actions CI/CD badge present.
- `organic-harvest_README.md` — Named "Organic Harvest" with simpler description. Describes a "12-hour sprint" build. **Earlier/simpler version.**

**Verdict:** `AuraNode_README.md` supersedes `organic-harvest_README.md` for the Organic Harvest project.

### Dental Projects — 3 README files
- `DENTL_README.md` — "Premium Dental SaaS Template" — Next.js 14+, Supabase, Resend. Basic SaaS template.
- `dentl2_README.md` — "Smile Dental Clinic Management Platform" — Next.js 15, Express.js 5, SQLite. Full-stack with admin dashboard, Google Calendar, SMTP. **Major evolution.**
- `dentl3_README.md` — "LUMIÈRE Dental" — Single HTML file, zero dependencies. Marketing website. **Different scope entirely.**

**Verdict:** These are 3 distinct projects showing **progressive evolution** of dental practice software. NOT duplicates. DENTL → dentl2 → dentl3 represents increasing complexity then a different approach.

---

## 3. Certification Duplicates

### PEC CPD Webinars — 6 files with similar naming
Files `7972355`, `7988250`, `7999925`, `8007025`, `8014172`, `8021551` are all **distinct PEC CPD certificates** for different webinars. NOT duplicates.

### Image-only files
- `Certficate AIHK.pdf` — Unique; likely hospital award/certificate
- `GenerateeCard.pdf` — Unique; likely PEC registration e-card
- `Screenshot 2026-01-22 163254.pdf` — Unknown; needs manual review

---

## 4. Renamed Files

| File | Actual Content | Notes |
|------|---------------|-------|
| `AuraNode_README.md` | Organic Harvest project | Repo named "AuraNode", project named "Organic Harvest" |
| `Asset-Thief_README.md` | "SVGs and IMGs Downloader" | Repo named "Asset-Thief", product named differently |

---

## 5. Obsolete Files

No files are confirmed obsolete. The `organic-harvest_README.md` may represent an earlier build iteration but is not necessarily obsolete — it describes a different development approach (12-hour sprint).

---

## 6. Conflicting Information Between Files

See `conflict-report.md` for detailed analysis.
