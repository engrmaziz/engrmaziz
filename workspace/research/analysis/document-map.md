# Document Map

> Visual and structural map of how all documents relate to each other.
> Generated: 2026-07-08

---

## Repository Structure

```
mak/
├── cvs/                           ← 7 files (5 PDF, 2 DOCX)
│   ├── Musharraf_AzizCV.pdf                          [GENERIC AI ENGINEER]
│   ├── Musharraf_Aziz_AIDNA_Superbuilder (1).pdf     [AI DNA / SUPERBUILDER]
│   ├── Musharraf_Aziz_AIEngineer_Devorbis.pdf        [DEVORBIS ON-SITE]
│   ├── Musharraf_Aziz_BarqSystems_AIEngineer_CV.pdf  [BARQ SYSTEMS ML]
│   ├── Musharraf_Aziz_Comprehensive_CV (1).docx      [★ MASTER SOURCE]
│   ├── Musharraf_Aziz_QuadRoots_SeniorAIBackend.docx [QUADROOTS BACKEND]
│   └── Musharraf_Aziz_SeniorSWE_AIML.pdf             [SENIOR SWE AI/ML]
│
├── certifications/                ← 21 files (all PDF)
│   ├── [6x PEC CPD Webinars]                         [1 CPD each]
│   ├── AI for Business Professionals.pdf             [HP LIFE]
│   ├── Certficate AIHK.pdf                           [IMAGE ONLY]
│   ├── Coursera.pdf                                  [Business Analysis]
│   ├── [5x OpenLearn Courses]                        [Various topics]
│   ├── GenerateeCard.pdf                             [IMAGE ONLY]
│   ├── McKinsey.orgForward20260120-30-xcping.pdf     [McKinsey Forward]
│   ├── Print_Your_Record_of_Completion.pdf           [Solar Math]
│   ├── Screenshot 2026-01-22 163254.pdf              [IMAGE ONLY]
│   └── certificate_le1-010.pdf                       [Unknown]
│
├── projects/                      ← 37 Markdown files
│   ├── [AI/ML Projects]
│   │   ├── AegisFlow_README.md                       [FinTech SaaS]
│   │   ├── Self-Healing-RAG-Pipeline_README.md       [RAG Pipeline]
│   │   ├── LLM-GUARDRAIL-GATEWAY_README.md           [AI Security]
│   │   ├── llm-eval-cicd_README.md                   [MLOps]
│   │   ├── emotional-support-rag_README.md           [RAG + Security]
│   │   ├── voice-rag_README.md                       [Voice AI + RAG]
│   │   ├── synthtox-engine_README.md                 [Edge RAG]
│   │   └── transcription-pipeline_README.md          [Audio AI]
│   │
│   ├── [Developer Tools]
│   │   ├── git-archaeologist-mcp_README.md           [Published MCP]
│   │   ├── doc-sync_README.md                        [MCP Server]
│   │   ├── Asset-Thief_README.md                     [Chrome Extension]
│   │   ├── domain-drainer_README.md                  [Chrome Extension]
│   │   ├── chat-saved_README.md                      [Chrome Extension]
│   │   ├── nexus_README.md                           [Desktop App]
│   │   └── nexus-android_README.md                   [Mobile App]
│   │
│   ├── [Full-Stack Applications]
│   │   ├── collab_README.md                          [Collaboration SaaS]
│   │   ├── dentl2_README.md                          [Healthcare Platform]
│   │   ├── dentl3_README.md                          [Static Website]
│   │   ├── DENTL_README.md                           [SaaS Template]
│   │   ├── green-navigator_README.md                 [ESG SaaS]
│   │   ├── openscholar_README.md                     [Academic Platform]
│   │   ├── visa-path_README.md                       [Travel SaaS]
│   │   ├── payverify_README.md                       [FinTech]
│   │   ├── salary-trends-dashboard_README.md         [Data Dashboard]
│   │   └── overwatch-ai_README.md                    [Scam Detection]
│   │
│   ├── [Computer Vision]
│   │   ├── emotion-detector_README.md                [Browser AI]
│   │   ├── air-canvas_README.md                      [Drawing App]
│   │   └── gesture-control_README.md                 [Gesture App]
│   │
│   ├── [E-Commerce]
│   │   ├── AuraNode_README.md                        [Organic Harvest v2]
│   │   └── organic-harvest_README.md                 [Organic Harvest v1]
│   │
│   ├── [ML Applications]
│   │   ├── ml-spam-classifier_README.md              [Classical ML]
│   │   ├── heart-disease-platform_README.md          [Healthcare ML]
│   │   └── multimodal-cancer-survival-transformer_README.md [Research ML]
│   │
│   ├── [Audio/Voice]
│   │   └── voice-guard_README.md                     [Voice Security]
│   │
│   ├── [Profile]
│   │   ├── portfolio_README.md                       [Personal Site]
│   │   └── engrmaziz_README.md                       [GitHub Profile]
│   │
│   └── [Other]
│       └── ghost-assist_README.md                    [AI Agent]
│
├── services/                      ← 1 file
│   └── services.md                                   [33 Service Categories]
│
└── analysis/                      ← Generated output (this folder)
    ├── repository-inventory.md
    ├── document-map.md            ← THIS FILE
    ├── duplicate-analysis.md
    ├── knowledge-discovery.md
    ├── conflict-report.md
    ├── missing-information.md
    ├── taxonomy.md
    ├── relationship-map.md
    ├── source-of-truth.md
    ├── execution-plan.md
    └── extracted_text.md          [Raw extraction from PDFs/DOCX]
```

---

## Information Flow

```
┌──────────────────────┐
│ CVs (7 variants)     │──→ Employment History ──→ Knowledge Base
│                      │──→ Skills Inventory   ──→ Knowledge Base
│                      │──→ Project Claims     ──→ Cross-reference with Projects/
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│ Certifications (21)  │──→ Credential Validation ──→ Knowledge Base
│                      │──→ CPD Tracking           ──→ Knowledge Base
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│ Projects (37 READMEs)│──→ Technical Evidence ──→ Knowledge Base
│                      │──→ Architecture Details ──→ Knowledge Base
│                      │──→ Tech Stack Proof    ──→ Validates CV Claims
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│ Services (1 file)    │──→ Service Catalog ──→ Knowledge Base
│                      │──→ Capability Map  ──→ Cross-reference with Projects
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│ Analysis (10 files)  │──→ Phase 1 Complete
│                      │──→ Ready for Knowledge Base Generation
└──────────────────────┘
```
