import React from 'react';
import { ChevronRight } from 'lucide-react';

const LeagueOfLegendsPageFAQ = () => {
  const faqs = [
    {
      q: 'What makes a good League of Legends name?',
      a: 'A good League of Legends name is memorable, easy to pronounce, and reflects your playstyle or main role. The best names are usually short, clean (without excessive numbers or symbols), and convey a sense of skill or intimidation.'
    },
    {
      q: 'Can I change my summoner name in League of Legends?',
      a: 'Yes, Riot Games has transitioned from Summoner Names to Riot IDs. You can change your Riot ID for free every 90 days through your Riot account management page.'
    },
    {
      q: 'Are there naming restrictions for LoL accounts?',
      a: 'Yes. Riot IDs must be between 3 and 16 characters long. They cannot contain profanity, hate speech, or impersonate Riot employees or esports professionals. Violating these rules can result in a forced name change or account ban.'
    },
    {
      q: 'What are the best names for different roles?',
      a: 'Top laners often use imposing, tanky names (e.g., IronWall). Junglers prefer stealthy or predatory names (e.g., ShadowHunter). Mid laners lean towards magical or assassin themes (e.g., SpellMaster). ADCs use damage-focused names (e.g., CriticalStrike), and Supports use protective names (e.g., GuardianAngel).'
    },
    {
      q: 'How often can I change my summoner name?',
      a: 'Under the new Riot ID system, you can change your name for free once every 90 days.'
    },
    {
      q: 'What makes a LoL team name stand out?',
      a: 'A standout LoL team name is professional, unified, and intimidating. It often consists of a strong adjective and a noun (e.g., TitanForce, ShadowCrew) and is accompanied by a recognizable 3-4 letter tag.'
    },
    {
      q: 'Can I use special characters in LoL names?',
      a: 'Riot IDs support a wide range of Unicode characters, depending on your region. However, keeping it to standard alphanumeric characters is recommended for a cleaner, more competitive look.'
    },
    {
      q: 'What are the most popular LoL names?',
      a: 'Popular names often mimic professional players, use anime references, or combine a cool adjective with a role or champion name. Short, single-word names are highly sought after in high elo.'
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="space-y-6">
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Frequently Asked Questions</h2>
        <p className="text-foreground/60">Everything you need to know about League of Legends names.</p>
      </div>
      
      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, idx) => (
          <details 
            key={idx} 
            className="group bg-card border border-border/50 rounded-xl p-6 cursor-pointer shadow-sm hover:border-[#0A8CC9]/50 transition-colors"
          >
            <summary className="font-bold text-lg flex justify-between items-center list-none outline-none">
              {faq.q}
              <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90 text-[#0A8CC9]" />
            </summary>
            <p className="mt-4 text-foreground/70 leading-relaxed border-t border-border/30 pt-4">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default LeagueOfLegendsPageFAQ;