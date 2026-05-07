import React from 'react';
import SeoHead from '@/seo/SeoHead.jsx';

const PrivacyPolicyPage = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
    <SeoHead
      title="Privacy Policy – TryhardNames"
      description="How TryhardNames collects, uses, and protects data when you use our gaming name and text tools."
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
              This Privacy Policy will inform you as to how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">2. Information Collection and Use</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <h3 className="text-xl font-semibold text-dark-50 mb-2 mt-6">Types of Data Collected:</h3>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (e.g., Email address, First name and last name).</li>
              <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used. This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</li>
              <li><strong>Tracking & Cookies Data:</strong> We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">3. Use of Data</h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              TryhardNames uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-dark-300">
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer care and support</li>
              <li>To provide analysis or valuable information so that we can improve the Service</li>
              <li>To monitor the usage of the Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">4. Security of Data</h2>
            <p className="text-dark-300 leading-relaxed">
              The security of your data is important to us, but remember that no method of transmission over the Internet, 
              or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect 
              your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-50 mb-4">5. Contact Us</h2>
            <p className="text-dark-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-dark-300">
              <li>By visiting this page on our website: <a href="/contact" className="text-accent-cyan hover:underline">Contact Us</a></li>
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