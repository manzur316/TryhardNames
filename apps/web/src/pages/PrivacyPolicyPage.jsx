import React from 'react';
import SeoHead from '@/seo/SeoHead.jsx';

const PrivacyPolicyPage = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
    <SeoHead
      title="Privacy Policy – TryhardNames"
      description="How TryhardNames collects, uses, and protects data for public tools, Parent Auth, and private Gaming Passport drafts."
      path="/privacy-policy"
    />
    <div className="bg-gradient-dark text-dark-300 font-sans py-20 px-4 flex-grow flex flex-col">
      <div className="container mx-auto max-w-4xl bg-dark-800 border border-dark-700 rounded-3xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-black text-dark-50 mb-4">Privacy Policy</h1>
        <p className="text-dark-400 mb-12">Last updated: {lastUpdated}</p>

        <div className="space-y-10 prose prose-invert prose-slate max-w-none">
          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">1. Introduction</h2>
            <p className="text-dark-300 leading-relaxed">
              Welcome to TryhardNames. We respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we handle information when you visit our website, use our free tools,
              sign in with Parent Auth, or manage a private Gaming Passport draft.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">2. Information We Collect</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              We collect limited information needed to operate and improve the Service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li><strong>Information you provide:</strong> For example, if you contact us (such as name, email address, and message content).</li>
              <li><strong>TryhardNames account and Parent Auth information:</strong> For example, account email, user ID, session state, and provider identifiers needed to sign you into TryhardNames.</li>
              <li><strong>Gaming Passport private draft fields:</strong> For example, alias, avatar URL, short bio, and visual presentation choices that you save in your private draft.</li>
              <li><strong>Usage data:</strong> Such as pages viewed, approximate region from IP, browser type, device type, and timestamps. This helps us understand performance and fix issues.</li>
              <li><strong>Cookies and similar technologies:</strong> Small files or storage used to remember preferences, measure traffic, and support security.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">3. Gaming Passport, Parent Auth, and Future Providers</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              Parent Auth is the account system used to sign into TryhardNames. Google Auth signs users into
              TryhardNames only. Google is Parent Auth only and is not shown as a gaming proof, badge, or public
              provider account.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>Account email and user ID may be used to own a private Gaming Passport draft.</li>
              <li>Gaming Passport starts as a private draft. Draft fields may include alias, avatar URL, short bio, and visual presentation choices.</li>
              <li>A draft is not public by default. Publishing requires explicit user action.</li>
              <li>Riot and Discord are future linked provider accounts and are not live yet.</li>
              <li>Riot data is not currently collected in production.</li>
              <li>If Riot or Discord providers are implemented later, they will require explicit authorization.</li>
              <li>Provider tokens will stay server-side when implemented.</li>
              <li>Public pages will show only approved/allowlisted fields.</li>
              <li>We do not sell Riot data, use hidden player data, or put Riot data behind a paywall.</li>
              <li>Unlink/revoke is planned before provider launch and is not currently available.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">4. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>To provide, maintain, and secure the Service</li>
              <li>To authenticate TryhardNames accounts and protect private Gaming Passport drafts</li>
              <li>To respond to support requests and communications</li>
              <li>To understand aggregate usage and improve performance and content quality</li>
              <li>To detect, prevent, and address technical or abusive activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">5. Cookies and Similar Technologies</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              We and our partners may use cookies, local storage, pixels, and similar technologies for purposes such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>Remembering preferences (for example theme settings stored locally in your browser)</li>
              <li>Measuring traffic and product analytics</li>
              <li>Delivering and measuring advertising where enabled (see below)</li>
            </ul>
            <p className="text-dark-300 leading-relaxed mt-4">
              You can control cookies through your browser settings. Blocking some cookies may affect certain features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">6. Advertising and Google AdSense</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              On selected pages, we may use third-party advertising services such as <strong>Google AdSense</strong> to show ads.
              Google and its partners may use cookies and similar technologies to serve ads based on your visits to this and other sites.
            </p>
            <p className="text-dark-300 leading-relaxed mb-4">
              Where applicable, ads may be personalized (including based on prior visits to TryhardNames or other sites), subject to your settings and applicable law.
            </p>
            <p className="text-dark-300 leading-relaxed mb-4">
              For how Google uses data when you use our partners&apos; sites or apps, see{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                className="text-accent-cyan hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s Privacy &amp; Terms
              </a>
              . You can manage personalized advertising preferences via{' '}
              <a
                href="https://www.google.com/settings/ads"
                className="text-accent-cyan hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ads Settings
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">7. Analytics</h2>
            <p className="text-dark-300 leading-relaxed">
              We use analytics tools (such as Google Analytics) to understand aggregated usage. These tools may collect device and usage information as described by their providers.
              We configure analytics to prioritize privacy where possible (for example IP anonymization where available).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">8. Sharing of Information</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>Service providers who help us host, analyze, or secure the website</li>
              <li>Advertising and analytics partners where those services are enabled</li>
              <li>Authorities when required by law or to protect rights and safety</li>
            </ul>
            <p className="text-dark-300 leading-relaxed mt-4">
              Riot data is not currently collected in production. If a Riot provider is implemented later, Riot data
              will not be sold and will not be placed behind a paywall.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">9. Data Retention</h2>
            <p className="text-dark-300 leading-relaxed">
              We retain information only as long as needed for the purposes described in this policy, unless a longer period is required or permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">10. Security</h2>
            <p className="text-dark-300 leading-relaxed">
              We use commercially reasonable safeguards to protect information. No online transmission or storage is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">11. Children&apos;s Privacy</h2>
            <p className="text-dark-300 leading-relaxed">
              TryhardNames is not directed to children under 13, and we do not knowingly collect personal information from children.
              If you believe we have collected information from a child, please contact us and we will take appropriate steps.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">12. International Visitors</h2>
            <p className="text-dark-300 leading-relaxed">
              If you access the Service from outside your home country, your information may be processed in countries where our providers operate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">13. Changes to This Policy</h2>
            <p className="text-dark-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Continued use of the Service after changes means you accept the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">14. Contact Us</h2>
            <p className="text-dark-300 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-dark-300">
              <li>By visiting: <a href="/contact" className="text-accent-cyan hover:underline">Contact Us</a></li>
              <li>By email: support@tryhardnames.com</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
    </>
  );
};

export default PrivacyPolicyPage;
