import React from 'react';
import { Helmet } from 'react-helmet';

const SEOContent = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What makes a good tryhard name?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A good tryhard name combines aggressive or competitive words with stylish symbols and numbers. It should sound intimidating, memorable, and reflect your gaming prowess. Popular elements include dark themes (Shadow, Phantom), competitive terms (Clutch, Cracked), and stylish Unicode symbols (★, ⚡, ✨)."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use these names on Fortnite?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our generated tryhard names work perfectly for Fortnite, as well as other popular games like Valorant, Free Fire, PUBG, Call of Duty, and Apex Legends. Just make sure the name meets the character limit and content policy of your specific game."
        }
      },
      {
        "@type": "Question",
        "name": "Are these names unique?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our generator creates millions of unique combinations by mixing different word categories, numbers, and symbols. While we can't guarantee absolute uniqueness across all gaming platforms, the vast combination possibilities make it highly likely your generated name will be available."
        }
      },
      {
        "@type": "Question",
        "name": "How do I add symbols to my gaming name?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply toggle the 'Add Symbols' option in our generator. We automatically include stylish Unicode symbols like ★, ✦, ◆, ⚡, ✨, and ⚔️ that are compatible with most gaming platforms. These symbols make your name stand out and look more professional."
        }
      },
      {
        "@type": "Question",
        "name": "What are sweaty gamer names?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sweaty gamer names are competitive, tryhard-style nicknames that convey skill, dedication, and intensity. They often include words like 'Grind', 'Sweat', 'Clutch', 'Cracked', or 'Goated' combined with aggressive or dark-themed words. These names are popular in competitive gaming communities."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use numbers in my tryhard name?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Toggle the 'Add Numbers' option to include random numbers (0-999) in your generated name. Numbers add uniqueness and can represent your birth year, lucky number, or just make your name more distinctive when your preferred name is already taken."
        }
      },
      {
        "@type": "Question",
        "name": "What games are tryhard names best for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tryhard names are perfect for competitive shooters and battle royale games including Fortnite, Valorant, Free Fire, PUBG Mobile, Call of Duty Mobile, Apex Legends, CS:GO, Rainbow Six Siege, and Warzone. They're designed to intimidate opponents and showcase your competitive mindset."
        }
      },
      {
        "@type": "Question",
        "name": "How often can I generate new names?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can pull fresh name samples whenever you want—there's no paywall. Use the single-name action for one tag at a time or batch samples when you're comparing options. Keep iterating until something fits your profile or in-game constraints."
        }
      },
      {
        "@type": "Question",
        "name": "Are clan names different from regular tryhard names?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Clan tryhard names often include team-oriented words like 'Clan', 'Squad', 'Crew', or 'Legion' combined with aggressive terms. They're designed for gaming teams and clans who want a unified, intimidating presence. Our generator can create both individual and clan-style names."
        }
      },
      {
        "@type": "Question",
        "name": "Do these names work on mobile games?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our tryhard names are fully compatible with mobile gaming platforms including Free Fire, PUBG Mobile, Call of Duty Mobile, Mobile Legends, and Clash Royale. The symbols and characters we use are supported across iOS and Android devices."
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

      <section className="max-w-4xl mx-auto px-4 py-12 space-y-12 md:space-y-16">
        {/* Navigation Links */}
        <nav className="bg-card border border-border/50 rounded-lg p-6 shadow-refined">
          <h2 className="text-xl font-bold text-primary mb-4">Quick Navigation</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <li><a href="#fortnite" className="text-secondary hover:text-primary transition-colors">Fortnite Names</a></li>
            <li><a href="#valorant" className="text-secondary hover:text-primary transition-colors">Valorant Names</a></li>
            <li><a href="#sweaty" className="text-secondary hover:text-primary transition-colors">Sweaty Names</a></li>
            <li><a href="#stylish" className="text-secondary hover:text-primary transition-colors">Stylish Names</a></li>
            <li><a href="#short" className="text-secondary hover:text-primary transition-colors">Short Tags</a></li>
            <li><a href="#clan" className="text-secondary hover:text-primary transition-colors">Clan Names</a></li>
          </ul>
        </nav>

        {/* Fortnite Section */}
        <article id="fortnite" className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-primary">Tryhard Names for Fortnite</h2>
          <p className="text-foreground/90 leading-relaxed">
            Fortnite is the ultimate battle royale where your name represents your skill and dedication. A powerful tryhard name can intimidate opponents before the match even begins. Our generator creates Fortnite-optimized names that combine aggressive words like "Lethal", "Savage", and "Apex" with competitive gaming terms that resonate with the Fortnite community.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            The best Fortnite tryhard names often include dark themes (Shadow, Phantom, Reaper) paired with action words that reflect the fast-paced building and combat mechanics. Adding stylish symbols like ★ or ⚡ makes your name stand out in the lobby and on elimination feeds. Whether you're cranking 90s or going for high-ground retakes, your name should match your playstyle.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Popular Fortnite tryhard name styles include the classic "xX...Xx" format, TTV/YT suffixes for content creators, and number combinations that add uniqueness. Our generator understands these trends and creates names that fit perfectly within Fortnite's 16-character limit while maintaining maximum impact and memorability.
          </p>
        </article>

        {/* Valorant Section */}
        <article id="valorant" className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-secondary">Tryhard Names for Valorant</h2>
          <p className="text-foreground/90 leading-relaxed">
            Valorant demands precision, strategy, and mental fortitude - qualities that should be reflected in your in-game name. Valorant tryhard names often emphasize tactical prowess and competitive spirit with words like "Clutch", "Ace", "Frag", and "Pro". The game's tactical shooter nature calls for names that sound professional yet intimidating.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Unlike other games, Valorant players often prefer cleaner, more sophisticated tryhard names without excessive symbols. However, strategic use of Unicode characters like ◆ or ✦ can add elegance without appearing childish. Names that reference agent abilities, competitive ranks (Radiant, Immortal), or esports organizations are particularly popular in the Valorant community.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Our generator creates Valorant-specific tryhard names that balance aggression with professionalism. Whether you're a Jett main going for aggressive entries or a Sentinel player holding sites, your name should command respect and strike fear into enemy teams during agent select.
          </p>
        </article>

        {/* Sweaty Gamer Names Section */}
        <article id="sweaty" className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-accent">Sweaty Gamer Names</h2>
          <p className="text-foreground/90 leading-relaxed">
            "Sweaty" in gaming culture refers to players who take competition seriously, constantly grinding to improve their skills. Sweaty gamer names embrace this dedication with words like "Grind", "Sweat", "Hustle", "Dominate", and "Carry". These names proudly display your commitment to winning and climbing ranked ladders.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            The best sweaty names combine competitive terminology with power words that convey dominance. Terms like "Cracked" (extremely skilled), "Goated" (greatest of all time), and "Beaming" (accurate shooting) are popular in modern gaming slang. Our generator stays current with gaming culture, incorporating trending terms that resonate with competitive communities.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Sweaty names work across all competitive games - from battle royales to MOBAs to tactical shooters. They signal to teammates that you're serious about winning and warn opponents that you're not an easy target. Whether you're grinding ranked, competing in tournaments, or streaming your gameplay, a sweaty name reinforces your competitive identity.
          </p>
        </article>

        {/* Stylish Names Section */}
        <article id="stylish" className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-primary">Stylish Tryhard Names</h2>
          <p className="text-foreground/90 leading-relaxed">
            Stylish tryhard names elevate your gaming identity with aesthetic Unicode symbols and creative formatting. These names use characters like ★, ✦, ◆, ⚡, ✨, ⚔️, and ☠️ to create visual impact that stands out in player lists, leaderboards, and kill feeds. The key is balancing style with readability - too many symbols can make names difficult to remember or pronounce.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Popular stylish formats include symmetrical designs (★Name★), prefix/suffix combinations (xXNameXx), and strategic symbol placement that enhances rather than clutters. Our generator intelligently places symbols to maximize visual appeal while maintaining the aggressive, competitive tone that defines tryhard culture. These names work particularly well for content creators who want memorable branding.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Stylish tryhard names are perfect for players who want to express personality while maintaining competitive credibility. They're popular in games with strong visual identities like Free Fire, Mobile Legends, and Genshin Impact, where aesthetic presentation matters as much as skill. The right combination of words and symbols creates a name that's both beautiful and intimidating.
          </p>
        </article>

        {/* Short Tags Section */}
        <article id="short" className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-secondary">Short Tryhard Tags</h2>
          <p className="text-foreground/90 leading-relaxed">
            Short tryhard tags (3-6 characters) are highly sought after in gaming communities due to their rarity and impact. These concise names are memorable, easy to type, and often associated with veteran players or exclusive accounts. Words like "Ace", "Pro", "God", "King", and "Apex" work perfectly as standalone tags or combined with numbers for uniqueness.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            The challenge with short tags is availability - most simple combinations are already taken on popular platforms. Our generator creates short tryhard names by combining powerful single-syllable words with strategic numbers or symbols. Tags like "Ace47", "Pro★", or "God⚡" maintain brevity while adding uniqueness that increases availability across gaming platforms.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Short tags are particularly valuable for competitive players who want quick, punchy names that opponents remember after matches. They're ideal for clan tags, esports team abbreviations, and players who prefer minimalist aesthetics. In games with character limits or where names appear in small UI elements, short tags ensure maximum readability and impact.
          </p>
        </article>

        {/* Clan Names Section */}
        <article id="clan" className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-accent">Clan Tryhard Names</h2>
          <p className="text-foreground/90 leading-relaxed">
            Clan tryhard names unite gaming teams under a shared identity that projects power and coordination. These names often include collective terms like "Clan", "Squad", "Crew", "Legion", "Guild", or "Army" combined with aggressive words that represent the team's competitive spirit. A strong clan name intimidates opponents and builds team morale.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Successful clan names balance uniqueness with memorability. They should be easy for teammates to remember and opponents to fear. Popular formats include "[Adjective][Collective]" (ToxicLegion), "[Theme][Group]" (ShadowSquad), or single powerful words that represent the team's identity. Our generator creates clan names that work for teams of any size, from small friend groups to large competitive organizations.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Clan tryhard names are essential for team-based games like Valorant, CS:GO, Rainbow Six Siege, and Call of Duty. They appear in clan tags, team rosters, tournament brackets, and competitive leaderboards. A well-chosen clan name becomes part of your team's legacy, representing countless hours of practice, coordination, and competitive success. Whether you're forming a casual squad or building a competitive esports organization, your clan name is the foundation of your team's brand.
          </p>
        </article>

        {/* FAQ Section */}
        <article className="space-y-8 bg-card border border-border/50 rounded-lg p-8 shadow-refined mt-16">
          <h2 className="text-3xl font-bold text-primary">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
              <h3 className="text-xl font-semibold text-secondary">What makes a good tryhard name?</h3>
              <p className="text-foreground/90 leading-relaxed">
                A good tryhard name combines aggressive or competitive words with stylish symbols and numbers. It should sound intimidating, memorable, and reflect your gaming prowess. Popular elements include dark themes (Shadow, Phantom), competitive terms (Clutch, Cracked), and stylish Unicode symbols (★, ⚡, ✨).
              </p>
            </div>

            <div className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
              <h3 className="text-xl font-semibold text-secondary">Can I use these names on Fortnite?</h3>
              <p className="text-foreground/90 leading-relaxed">
                Yes! Our generated tryhard names work perfectly for Fortnite, as well as other popular games like Valorant, Free Fire, PUBG, Call of Duty, and Apex Legends. Just make sure the name meets the character limit and content policy of your specific game.
              </p>
            </div>

            <div className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
              <h3 className="text-xl font-semibold text-secondary">Are these names unique?</h3>
              <p className="text-foreground/90 leading-relaxed">
                Our generator creates millions of unique combinations by mixing different word categories, numbers, and symbols. While we can't guarantee absolute uniqueness across all gaming platforms, the vast combination possibilities make it highly likely your generated name will be available.
              </p>
            </div>

            <div className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
              <h3 className="text-xl font-semibold text-secondary">How do I add symbols to my gaming name?</h3>
              <p className="text-foreground/90 leading-relaxed">
                Simply toggle the 'Add Symbols' option in our generator. We automatically include stylish Unicode symbols like ★, ✦, ◆, ⚡, ✨, and ⚔️ that are compatible with most gaming platforms. These symbols make your name stand out and look more professional.
              </p>
            </div>

            <div className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
              <h3 className="text-xl font-semibold text-secondary">What are sweaty gamer names?</h3>
              <p className="text-foreground/90 leading-relaxed">
                Sweaty gamer names are competitive, tryhard-style nicknames that convey skill, dedication, and intensity. They often include words like 'Grind', 'Sweat', 'Clutch', 'Cracked', or 'Goated' combined with aggressive or dark-themed words. These names are popular in competitive gaming communities.
              </p>
            </div>

            <div className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
              <h3 className="text-xl font-semibold text-secondary">Can I use numbers in my tryhard name?</h3>
              <p className="text-foreground/90 leading-relaxed">
                Absolutely! Toggle the 'Add Numbers' option to include random numbers (0-999) in your generated name. Numbers add uniqueness and can represent your birth year, lucky number, or just make your name more distinctive when your preferred name is already taken.
              </p>
            </div>

            <div className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
              <h3 className="text-xl font-semibold text-secondary">What games are tryhard names best for?</h3>
              <p className="text-foreground/90 leading-relaxed">
                Tryhard names are perfect for competitive shooters and battle royale games including Fortnite, Valorant, Free Fire, PUBG Mobile, Call of Duty Mobile, Apex Legends, CS:GO, Rainbow Six Siege, and Warzone. They're designed to intimidate opponents and showcase your competitive mindset.
              </p>
            </div>

            <div className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
              <h3 className="text-xl font-semibold text-secondary">How often can I generate new names?</h3>
              <p className="text-foreground/90 leading-relaxed">
                You can pull fresh name samples whenever you want—there's no paywall. Use the single-name action for one tag at a time or batch samples when you're comparing options. Keep iterating until something fits your profile or in-game constraints.
              </p>
            </div>

            <div className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
              <h3 className="text-xl font-semibold text-secondary">Are clan names different from regular tryhard names?</h3>
              <p className="text-foreground/90 leading-relaxed">
                Clan tryhard names often include team-oriented words like 'Clan', 'Squad', 'Crew', or 'Legion' combined with aggressive terms. They're designed for gaming teams and clans who want a unified, intimidating presence. Our generator can create both individual and clan-style names.
              </p>
            </div>

            <div className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
              <h3 className="text-xl font-semibold text-secondary">Do these names work on mobile games?</h3>
              <p className="text-foreground/90 leading-relaxed">
                Yes! Our tryhard names are fully compatible with mobile gaming platforms including Free Fire, PUBG Mobile, Call of Duty Mobile, Mobile Legends, and Clash Royale. The symbols and characters we use are supported across iOS and Android devices.
              </p>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default SEOContent;