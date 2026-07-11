"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export default function TermsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Terms of Service"
        description="Last updated: October 2026. Please read these terms carefully before using the platform."
      />
      <Container className="py-16 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert prose-p:text-secondary prose-h2:text-primary">
          <h2>1. Introduction</h2>
          <p>
            By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
          </p>

          <h2>2. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the exclusive property of the owner and its licensors. The service is protected by copyright, trademark, and other laws of both the Pakistan and foreign countries.
          </p>

          <h2>3. Service Availability</h2>
          <p>
            We are constantly updating our offerings. We may experience delays in updating information on the service and in our advertising on other websites. We cannot and do not guarantee the accuracy or completeness of any information, including prices, product images, specifications, availability, and services.
          </p>

          <h2>4. Links To Other Web Sites</h2>
          <p>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
          </p>

          <h2>5. Limitation Of Liability</h2>
          <p>
            In no event shall we, nor our directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2>6. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions.
          </p>

          <h2>7. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <p className="mt-8 text-sm text-secondary">
            For any questions regarding these Terms, please contact us at <a href="mailto:io@maziz.me">io@maziz.me</a>.
          </p>
        </div>
      </Container>
    </PageLayout>
  );
}
