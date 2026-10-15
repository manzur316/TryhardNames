import React from 'react';
import SeoHead from '@/seo/SeoHead.jsx';
import PassportWorkspace from '@/gaming-passport/components/PassportWorkspace.jsx';

export default function GamingPassportPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white">
      <SeoHead
        title="Gaming Passport - Visual, verifiable player resume | TryhardNames"
        description="TryhardNames Gaming Passport is a private-first, visual gaming resume for verified player identity, planned Riot account ownership, and user-controlled public proofs."
        path="/gaming-passport"
      />
      <PassportWorkspace />
      <details className="gp-policy">
        <summary>Privacy, integrations & legal</summary>
        <p>Parent Auth signs you into TryhardNames; it is never a public badge or proof. Public generators remain usable without an account. Saving a local draft does not publish it. Account publication requires consent and server-side eligibility checks.</p>
        <p>Riot and Discord will be linked accounts after sign-in, not login methods. League of Legends belongs to RiotProvider through LeagueOfLegendsAdapter.</p>
        <p><strong>Pending Riot approval.</strong> The planned integration uses Riot Sign On after approval. TryhardNames does not claim Riot account linking is live today, does not claim a production Riot key, and does not show live Riot data here.</p>
        <p>No custom competitive rating. No ladder calculator. No third-party stats clone. No in-game recommendations. No alternative ranking system. No hidden player data. No selling Riot data. Cosmetic artwork is original and does not confer a rank or verification.</p>
        <p><strong>Riot Games notice.</strong> Riot Games does not sponsor, approve, or operate TryhardNames Gaming Passport. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
      </details>
    </div>
  );
}
