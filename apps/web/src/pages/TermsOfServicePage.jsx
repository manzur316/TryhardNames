import React from 'react';
import SeoHead from '@/seo/SeoHead.jsx';

const TermsOfServicePage = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
    <SeoHead
      title="Terms of Service – TryhardNames"
      description="Terms governing TryhardNames generators, Gaming Passport drafts, user content, and acceptable use."
      path="/terms-of-service"
    />
    <div className="bg-gradient-dark text-dark-300 font-sans py-20 px-4 flex-grow flex flex-col">
      <div className="container mx-auto max-w-4xl bg-dark-800 border border-dark-700 rounded-3xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-black text-dark-50 mb-4">Terms of Service</h1>
        <p className="text-dark-400 mb-12">Last updated: {lastUpdated}</p>

        <div className="space-y-10 prose prose-invert prose-slate max-w-none">
          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">1. Agreement to Terms</h2>
            <p className="text-dark-300 leading-relaxed">
              By accessing or using TryhardNames, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">2. Use License</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on TryhardNames's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>attempt to decompile or reverse engineer any software contained on TryhardNames's website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">3. Gaming Passport</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              Gaming Passport is a user-controlled identity and presentation surface. A private draft does not mean
              public publication. Public sharing, when implemented, requires explicit user action and must use approved
              public fields only.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>You must not impersonate another person, player, creator, team, brand, or organization.</li>
              <li>You must not submit content, avatars, names, images, or profile details that you do not have rights to use.</li>
              <li>TryhardNames does not guarantee provider approval, provider availability, proof availability, ranking accuracy, MMR, ELO, or competitive status.</li>
              <li>Google Auth is Parent Auth only and is not a gaming proof, badge, or public provider account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">4. Riot and Third-Party Game Services</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              Riot integration is pending Riot approval. Riot OAuth / Riot Sign On is not currently available through
              TryhardNames, and TryhardNames does not display live Riot data in production.
            </p>
            <p className="text-dark-300 leading-relaxed mb-4">
              TryhardNames Gaming Passport is not endorsed by Riot Games and does not reflect the views or opinions of
              Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and
              all associated properties are trademarks or registered trademarks of Riot Games, Inc.
            </p>
            <p className="text-dark-300 leading-relaxed">
              Riot-owned trademarks, game data, properties, and assets remain Riot-owned. Users may not use
              TryhardNames to imply official Riot endorsement, approval, certification, employment, team membership, or
              access to non-public Riot data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">5. Monetization Boundaries</h2>
            <p className="text-dark-300 leading-relaxed">
              Public generators remain free. Future monetization, if any, applies only to TryhardNames-owned cosmetics,
              themes, borders, animations, or presentation features. Riot-owned data and assets are not monetized
              directly, and Riot data is not placed behind a paywall.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">6. Disclaimer</h2>
            <p className="text-dark-300 leading-relaxed">
              The materials on TryhardNames's website are provided on an 'as is' basis. TryhardNames makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">7. Limitations</h2>
            <p className="text-dark-300 leading-relaxed">
              In no event shall TryhardNames or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TryhardNames's website, even if TryhardNames or a TryhardNames authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">8. Accuracy of Materials</h2>
            <p className="text-dark-300 leading-relaxed">
              The materials appearing on TryhardNames's website could include technical, typographical, or photographic errors. TryhardNames does not warrant that any of the materials on its website are accurate, complete or current. TryhardNames may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">9. Links</h2>
            <p className="text-dark-300 leading-relaxed">
              TryhardNames has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by TryhardNames of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">10. Modifications</h2>
            <p className="text-dark-300 leading-relaxed">
              TryhardNames may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">11. Governing Law</h2>
            <p className="text-dark-300 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">12. Third-Party Services and Advertising</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              TryhardNames may display third-party advertisements (including through services such as Google AdSense) on selected pages.
              Those services are subject to their own terms and privacy policies. How Google uses data when showing ads is described in our{' '}
              <a href="/privacy-policy" className="text-accent-cyan hover:underline">Privacy Policy</a>{' '}
              and in Google&apos;s documentation for publishers and users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">13. Contact Us</h2>
            <p className="text-dark-300 leading-relaxed">
              If you have any questions about these Terms, please contact us at <a href="/contact" className="text-accent-cyan hover:underline">our contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
};

export default TermsOfServicePage;
