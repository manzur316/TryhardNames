
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const ClanNameSEOContent = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What makes a good clan name?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A good clan name is memorable, easy to pronounce, and reflects your team's personality or playstyle. It should be relatively short (1-2 words) so it fits well on leaderboards and can easily be abbreviated into a 3-4 letter clan tag."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use special characters in clan names?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It depends on the game. Games like Free Fire and PUBG Mobile often allow special Unicode characters and symbols (like ★ or ⚡). However, competitive shooters like Valorant or Call of Duty usually restrict names to standard alphanumeric characters."
        }
      },
      {
        "@type": "Question",
        "name": "What are the best clan names for esports?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Esports team names tend to be clean, professional, and impactful. Words like 'Cloud', 'Liquid', 'FaZe', or 'Optic' set the standard. This lane blends similar modern, aggressive words like 'Apex', 'Nexus', and 'Vanguard' to surface esports-ready names."
        }
      },
      {
        "@type": "Question",
        "name": "How do I choose between cool and tryhard clan names?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Choose based on your team's goals. If you play casually with friends, a 'cool' or funny name works best. If you grind ranked modes and participate in tournaments, a 'tryhard' or sweaty name (often featuring words like 'Lethal' or 'Sweat') establishes dominance."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use clan names on all gaming platforms?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the names generated here can be used across PC, PlayStation, Xbox, Switch, and mobile games. Just be aware that each platform (PSN, Xbox Live, Steam) has its own character limits and restrictions on offensive language."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between a clan name and a clan tag?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A clan name is the full title of your group (e.g., 'Shadow Legion'). A clan tag is a short, 2-4 letter abbreviation of that name (e.g., '[SHDW]') that players put in front of their personal usernames in-game."
        }
      },
      {
        "@type": "Question",
        "name": "Are there any restrictions on clan names?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most games restrict clan names that contain profanity, hate speech, or impersonate official developers. Additionally, there are usually length limits, typically between 3 and 16 characters for the full name."
        }
      },
      {
        "@type": "Question",
        "name": "How do I make my clan name unique?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To make your clan name unique, try combining two unrelated words (e.g., 'Neon' + 'Kraken'), using a custom prefix that means something to your friend group, or translating a cool word into another language like Latin or Japanese."
        }
      },
      {
        "@type": "Question",
        "name": "What are trending clan names in 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In 2026, trending clan names lean towards cyberpunk aesthetics, space themes, and short, punchy one-word titles. Names ending in 'X' or 'Z' (like 'VoidX') or featuring words like 'Cyber', 'Nova', and 'Pulse' are highly popular."
        }
      },
      {
        "@type": "Question",
        "name": "Can I change my clan name later?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This varies by game. Some games allow free clan name changes, while others require you to spend premium currency (like COD Points or V-Bucks) or disband and recreate the clan entirely. Always double-check before finalizing your choice!"
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <section className="max-w-4xl mx-auto py-12 space-y-12 md:space-y-16">
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-lg text-foreground/90 leading-relaxed">
            Plan a <strong>clan name</strong> that reads clean on rosters, streams, and killfeeds—whether you're a casual squad or an esports roster. Your team title is the banner opponents clock first and allies rally behind. Sample cool, tryhard, and sweaty clan-style tags here until something fits your vibe and platform rules.
          </p>
        </div>

        <article className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-primary">Cool Clan Names</h2>
          <p className="text-foreground/90 leading-relaxed">
            A cool clan name strikes the perfect balance between edgy and memorable. It shouldn't be too complicated. The best cool names often combine a powerful adjective with a strong noun. Think of legendary groups in gaming history—their names are usually just one or two syllables. This lane pulls from a curated library of modern gaming terminology so samples read like legitimate, established teams.
          </p>
          <div className="bg-card border border-border/50 rounded-xl p-6 mt-4 shadow-refined">
            <h3 className="text-xl font-semibold text-foreground mb-3">Examples of Cool Clan Names:</h3>
            <p className="text-foreground/80 leading-relaxed font-mono text-sm">
              ShadowCore, NeonVanguard, CyberLegion, AstralKnights, QuantumSquad, LunarWolves, SolarEmpire, StellarAlliance, MysticBrotherhood, CosmicCartel, PhantomSyndicate, RogueNation, EliteHunters, PrimeWarriors, GhostAssassins
            </p>
          </div>
        </article>

        <article className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-secondary">Tryhard Clan Names</h2>
          <p className="text-foreground/90 leading-relaxed">
            If your squad is all about grinding ranked, dominating tournaments, and making opponents rage quit, you need a tryhard clan name. Tryhard names are aggressive, intimidating, and often feature words related to destruction, darkness, or elite skill. Adding symbols or numbers can also increase the "sweaty" factor of your team's title.
          </p>
          <div className="bg-card border border-border/50 rounded-xl p-6 mt-4 shadow-refined">
            <h3 className="text-xl font-semibold text-foreground mb-3">Examples of Tryhard Clan Names:</h3>
            <p className="text-foreground/80 leading-relaxed font-mono text-sm">
              VoidX, DarkPulse, ApexFury, VenomStrike, ChaosForce, InfernoEsports, EclipseGaming, NexusPro, OblivionElite, AbyssPrime, KrakenNova, PhoenixIron, DragonLethal, TitanBrutal, ValkyrieSavage
            </p>
          </div>
        </article>

        <article className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-accent">Esports Team Names</h2>
          <p className="text-foreground/90 leading-relaxed">
            Looking to go pro? Esports team names need to look good on a jersey and sound great when shouted by a caster. They are usually clean, one-word names or a word followed by "Esports" or "Gaming". Avoid excessive numbers or symbols if you want to be taken seriously in the competitive scene.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <li><Link to="/valorant/sweaty" className="text-secondary hover:underline flex items-center gap-2">★ Valorant Team Names</Link></li>
            <li><Link to="/cod/sweaty" className="text-green-500 hover:underline flex items-center gap-2">★ Call of Duty Rosters</Link></li>
            <li><Link to="/fortnite/tryhard" className="text-primary hover:underline flex items-center gap-2">★ Fortnite Trios</Link></li>
          </ul>
        </article>

        <article className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-primary">Short Clan Tags</h2>
          <p className="text-foreground/90 leading-relaxed">
            Almost every multiplayer game uses Clan Tags—a 2 to 4 letter prefix that appears before your username. A great clan tag is an abbreviation of your full clan name, but sometimes teams choose a tag first and build the name around it. Use our dedicated Clan Tag Generator tool above to find the perfect 3-letter combination for your squad.
          </p>
        </article>

        <article className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-secondary">How to Choose a Clan Name</h2>
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4 shadow-refined">
            <ol className="list-decimal list-inside space-y-3 text-foreground/90">
              <li><strong>Consider your game:</strong> A name for a Roblox group might differ from a hardcore CS:GO team.</li>
              <li><strong>Keep it short:</strong> 1-2 words is the sweet spot. Long names get truncated on scoreboards.</li>
              <li><strong>Check availability:</strong> Before you get attached, make sure the name and tag aren't already taken in your game.</li>
              <li><strong>Think about the tag:</strong> Ensure your chosen name can be abbreviated into a cool 3-4 letter tag.</li>
              <li><strong>Ask your team:</strong> A clan name represents everyone, so put your top 3 generated names to a squad vote!</li>
            </ol>
          </div>
        </article>

        {/* FAQ Section */}
        <article className="space-y-8 bg-card border border-border/50 rounded-2xl p-8 shadow-refined mt-16">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            Frequently Asked Questions
          </h2>
          
          <div className="grid gap-6">
            {faqSchema.mainEntity.map((faq, idx) => (
              <div key={idx} className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
                <h3 className="text-xl font-semibold text-primary">{faq.name}</h3>
                <p className="text-foreground/80 leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
};

export default ClanNameSEOContent;
