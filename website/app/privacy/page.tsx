"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export default function PrivacyPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Privacy Policy"
        description="Last updated: October 2026. How we handle and protect your data."
      />
      <Container className="py-16 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert prose-p:text-secondary prose-h2:text-primary">
          <h2>1. Information Collection</h2>
          <p>
            We collect information to provide better services to all our users. We collect information in the following ways:
            <br />
            - Information you give us (e.g., when you fill out a contact form or subscribe to a newsletter).
            <br />
            - Information we get from your use of our services (e.g., standard analytics data).
          </p>

          <h2>2. Use of Information</h2>
          <p>
            We use the information we collect to provide, maintain, protect and improve our services, to develop new ones, and to protect our users. We also use this information to offer you tailored content.
          </p>

          <h2>3. Information Sharing</h2>
          <p>
            We do not share personal information with companies, organizations and individuals outside of our organization unless one of the following circumstances applies:
            <br />
            - With your consent.
            <br />
            - For external processing by trusted partners.
            <br />
            - For legal reasons.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold. We use secure servers, encryption, and best practices to safeguard your data.
          </p>

          <h2>5. Cookies and Trackers</h2>
          <p>
            We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2>6. Changes to This Policy</h2>
          <p>
            Our Privacy Policy may change from time to time. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice.
          </p>

          <p className="mt-8 text-sm text-secondary">
            For any privacy-related concerns, please contact us at <a href="mailto:io@maziz.me">io@maziz.me</a>.
          </p>
        </div>
      </Container>
    </PageLayout>
  );
}
