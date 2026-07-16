---
id: proj_auranode_001
title: AuraNode (Organic Harvest)
category: Project
description: High-performance E-Commerce platform built with Next.js and Supabase.
aliases: [AuraNode, Organic Harvest Platform]
tags: [project, e-commerce, nextjs, supabase, saas]
keywords: [Next.js e-commerce, Supabase RLS, high traffic scaling]
created: 2026-07-08
updated: 2026-07-08
version: 1.0.0
confidence: High
source_documents: []
related_documents: [novasole.md]
related_projects: []
related_skills: [Next.js, Supabase, Zustand, Tailwind CSS]
related_services: [Full-Stack Software Engineering (Web & SaaS)]
---

# AuraNode

**Source Code:** [GitHub Repository](https://github.com/engrmaziz/AuraNode) (Organic Harvest)

## Executive Summary
AuraNode is a scalable, SEO-optimized e-commerce platform built specifically for the "Organic Harvest" brand. Leveraging Next.js App Router for server-side rendering and Supabase for a robust backend-as-a-service, it delivers exceptional Core Web Vitals and seamless inventory management.

## Problem Statement & Business Context
Traditional e-commerce platforms (like Shopify or WooCommerce) often suffer from slow page load speeds and limited developer flexibility when building custom, multi-channel inventory pipelines. The client required a bespoke solution capable of handling high traffic spikes during seasonal sales without degradation in performance.

## Objectives
- Achieve perfect 100/100 Lighthouse scores for SEO and Performance.
- Implement strict data security using Row-Level Security (RLS).
- Create a real-time admin dashboard for inventory management.

## Key Features
- **AI Smart-Bundling**: Increases average order value with mathematically discounted, real-time cart upsell recommendations.
- **Ghost Revenue Retriever**: Automatically recovers lost revenue from abandoned carts by issuing unique promo codes.
- **Post-Purchase Drip Campaigns**: Retains customers via timed review requests and returning-customer discounts.
- **Cryptographic Coupon Engine**: Prevents margin abuse with a mathematically secure, single-use promo code architecture.

## Solution Architecture

### High-Level Architecture
A fully serverless architecture. The Next.js frontend is deployed on Vercel, utilizing React Server Components (RSC) to fetch data directly from the Supabase PostgreSQL database at the edge. 

### System Components
- **Frontend:** Next.js 14+ (App Router), React, Tailwind CSS.
- **State Management:** Zustand (for complex cart logic).
- **Backend/DB:** Supabase (PostgreSQL, Auth, Storage).
- **Email/Comms:** Resend API.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js (App Router), React, Tailwind CSS |
| **Backend & DB** | Supabase (PostgreSQL) |
| **State Management** | Zustand |
| **Hosting & Cron** | Vercel |
| **Transactional Email** | Resend |

## AI Components
AuraNode implements four core serverless engines:
1. **AI Smart-Bundling**: Cross-references real-time cart state against the catalog to curate a 1-click bundle with a precise 15% discount.
2. **Ghost Revenue Retriever**: Vercel Cron jobs poll Supabase for `status = 'draft'` orders older than 24 hours, generate single-use cryptographic coupons, and dispatch recovery emails via Resend.
3. **Automated Drip Campaigns**: Employs an `email_queue` table to schedule and dispatch review requests (+7 days) and loyalty discounts (+14 days).
4. **Cryptographic Coupons**: Derives promo codes using `crypto.randomUUID()` + HMAC-SHA256, storing them with a strict `max_uses` constraint to prevent brute-forcing.

## Database Design
- **Row-Level Security (RLS):** Implemented strict RLS policies in Supabase ensuring users can only read/write their own cart and order data, while admins have elevated privileges.
- **`promo_codes`**: Tracks generated coupons with hashed values, `max_uses`, `use_count`, and `expires_at` TTL parameters.
- **`email_queue`**: Decoupled asynchronous job table for processing scheduled drip campaigns.

## Project Structure
- `app/(store)/`: Public storefront routes.
- `app/(dashboard)/`: Protected admin inventory and coupon management.
- `app/api/cron/`: Secure serverless cron handlers for cart recovery and drip campaigns.
- `lib/coupons.ts`: Core cryptographic generation logic.

## Deployment
Fully serverless architecture deployed to **Vercel**. Backend PostgreSQL database managed via **Supabase**. Cron jobs strictly authenticated via header-injected `CRON_SECRET` tokens.

## Security & Database
- **Authentication:** Supabase Auth with magic links and OAuth providers.

## Challenges & Lessons Learned
- **Challenge:** Managing complex client-side state (the shopping cart) alongside Server Components.
- **Solution:** Adopted Zustand for lightweight, un-opinionated client-side state management, passing only necessary dehydrated state from the server to the client.

## Recruiter Summary
A prime example of modern Full-Stack SaaS development. Demonstrates mastery over the Next.js/Supabase ecosystem, emphasizing performance, server-side rendering, and secure database design.

## Interview Questions
- "How did you implement Row-Level Security in Supabase for the AuraNode cart system?"
- "Why did you choose Zustand over Redux or React Context for this project?"



