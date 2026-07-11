---
id: proj_dentl2_001
title: dentl2
category: Project
description: Healthcare SaaS platform for dental clinics built with Next.js 15.
aliases: [Dentl2, Dental Clinic SaaS]
tags: [project, healthcare, saas, nextjs, threejs]
keywords: [Healthcare SaaS Development, Next.js 15, Three.js integration, Express.js backend]
created: 2026-07-08
updated: 2026-07-08
version: 1.0.0
confidence: High
source_documents: []
related_documents: []
related_projects: []
related_skills: [Next.js, Express.js, Three.js, SQLite]
related_services: [Full-Stack Software Engineering (Web & SaaS)]
---
# dentl2

**Source Code:** [GitHub Repository](https://github.com/engrmaziz/dentl2)
## Executive Summary
dentl2 is a specialized SaaS platform designed for dental clinics. It provides a comprehensive suite of tools for patient management, appointment scheduling, and interactive 3D dental charting utilizing WebGL technologies.

## Problem Statement & Business Context
Dental clinics rely heavily on visual charting to track patient histories. Existing software often relies on static 2D images, making it difficult to record complex procedures. Furthermore, legacy systems are often siloed, lacking modern API integrations for SMS reminders or online booking.

## Objectives
- Integrate interactive 3D rendering directly into the browser for dental charting.
- Provide a robust, secure backend for managing sensitive patient data.
- Ensure the application is lightweight and fast enough to run on standard clinic hardware.

## Solution Architecture

### High-Level Architecture
A Next.js frontend serving as the interactive dashboard, coupled with a lightweight Node.js/Express backend API. The 3D charting is handled client-side using Three.js, offloading rendering work to the user's GPU to keep server costs negligible.

### System Components
- **Frontend:** Next.js 15, React, Tailwind CSS.
- **3D Engine:** Three.js (for rendering interactive teeth models).
- **Backend:** Node.js, Express.js.
- **Database:** SQLite (chosen for easy portability and zero-config setup for smaller clinics, with an ORM for easy migration to PostgreSQL for enterprise clients).

## Challenges & Lessons Learned
- **Challenge:** Rendering high-fidelity 3D models in the browser without causing memory leaks or UI stuttering.
- **Solution:** Optimized the Three.js geometry, implemented frustum culling, and ensured all WebGL contexts were properly disposed of when the React component unmounted.

## Recruiter Summary
Showcases the ability to integrate specialized, complex frontend technologies (Three.js/WebGL) into standard enterprise SaaS frameworks (Next.js), while maintaining a clean, easily deployable backend architecture.

## Interview Questions
- "How did you prevent memory leaks when integrating Three.js within a React/Next.js component lifecycle?"
- "Why choose SQLite for the backend, and how would you migrate it if a client needed horizontal scaling?"


## Telemetry & Media Status
> [!NOTE]
> **Screenshots/Diagrams:** [Missing Source Information] - Visual assets have not been provided in the current repository.
> **Deployment Metrics:** Standard CI/CD deployment utilized. Explicit latency/throughput KPIs are documented only where explicitly provided in the core analysis.
