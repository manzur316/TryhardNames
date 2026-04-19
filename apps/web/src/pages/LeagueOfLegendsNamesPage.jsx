import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Crosshair, Zap, Target, Heart, Trophy, Flame, Hash, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import CopyButton from '@/components/CopyButton.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';

const LeagueOfLegendsNamesPage = () => {
  const roles = [
    {
      title: 'Top Lane (Tank/Bruiser)',
      icon: Shield,
      color: 'text-[#0A8CC9]',
      bg: 'bg-[#0A8CC9]/10',
      border: 'border-[#0A8CC9]/30',
      names: ['IronPlate', 'TitanForce', 'BruiserKing', 'TankMaster', 'VanguardPro', 'SteelWall', 'DefenseElite', 'BarrierLord', 'ShieldBearer', 'ArmourKing', 'ToughGuy', 'IronSkin', 'SteelHeart', 'RockSolid', 'UnbreakableWall', 'TankGod', 'DefenseGod', 'ProtectorPro', 'GuardianForce', 'SentryKing']
    },
    {
      title: 'Jungle (Gank-Focused)',
      icon: Target,
      color: 'text-[#5B2C6F]',
      bg: 'bg-[#5B2C6F]/10',
      border: 'border-[#5B2C6F]/30',
      names: ['GankMaster', 'JunglePredator', 'ShadowHunter', 'PathfinderPro', 'ClearKing', 'GankLord', 'PredatorForce', 'HunterElite', 'ShadowAssassin', 'NightStalker', 'JungleGod', 'GankGod', 'ClearGod', 'PathfinderGod', 'ShadowKing', 'AssassinPro', 'HunterKing', 'PredatorKing', 'StalkerPro', 'NightHunter']
    },
    {
      title: 'Mid Lane (Mage/Assassin)',
      icon: Zap,
      color: 'text-[#C89B3C]',
      bg: 'bg-[#C89B3C]/10',
      border: 'border-[#C89B3C]/30',
      names: ['MageLord', 'AssassinKing', 'SpellMaster', 'MysticForce', 'ArcaneElite', 'SpellSlinger', 'MageGod', 'AssassinGod', 'SpellGod', 'MysticGod', 'ArcaneGod', 'MagicMaster', 'SpellCaster', 'MysticMaster', 'ArcaneMaster', 'MageKing', 'AssassinMaster', 'SpellKing', 'MysticKing', 'ArcaneKing']
    },
    {
      title: 'ADC (Carry)',
      icon: Crosshair,
      color: 'text-[#0A8CC9]',
      bg: 'bg-[#0A8CC9]/10',
      border: 'border-[#0A8CC9]/30',
      names: ['CarryKing', 'DamageDealer', 'ADCMaster', 'MarksMaster', 'CriticalStrike', 'DamageGod', 'CarryGod', 'ADCGod', 'MarksmanGod', 'CritGod', 'CarryMaster', 'DealerMaster', 'MarksmanMaster', 'CritMaster', 'CarryPro', 'DealerPro', 'MarksmanPro', 'CritPro', 'CarryElite', 'DealerElite']
    },
    {
      title: 'Support (Utility)',
      icon: Heart,
      color: 'text-[#5B2C6F]',
      bg: 'bg-[#5B2C6F]/10',
      border: 'border-[#5B2C6F]/30',
      names: ['SupportKing', 'ProtectorPro', 'UtilityMaster', 'HealerKing', 'ShieldMaster', 'SupportGod', 'ProtectorGod', 'UtilityGod', 'HealerGod', 'ShieldGod', 'SupportMaster', 'ProtectorMaster', 'UtilityPro', 'HealerPro', 'ShieldPro', 'SupportPro', 'ProtectorElite', 'UtilityElite', 'HealerElite', 'ShieldElite']
    }
  ];

  const tiers = [
    {
      title: 'Challenger Tier',
      icon: Trophy,
      color: 'text-[#C89B3C]',
      names: ['ChallengerPro', 'ChallengerKing', 'ChallengerGod', 'ChallengerElite', 'ChallengerForce', 'ChallengerMaster', 'ChallengerLord', 'ChallengerTitan', 'ChallengerPhoenix', 'ChallengerDragon', 'ChallengerVenom', 'ChallengerNemesis', 'ChallengerVortex', 'ChallengerInferno', 'ChallengerNova']
    },
    {
      title: 'Diamond Tier',
      icon: Trophy,
      color: 'text-[#0A8CC9]',
      names: ['DiamondPro', 'DiamondKing', 'DiamondGod', 'DiamondElite', 'DiamondForce', 'DiamondMaster', 'DiamondLord', 'DiamondTitan', 'DiamondPhoenix', 'DiamondDragon', 'DiamondVenom', 'DiamondNemesis', 'DiamondVortex', 'DiamondInferno', 'DiamondNova']
    },
    {
      title: 'Smurf Accounts',
      icon: Shield,
      color: 'text-[#5B2C6F]',
      names: ['SmurfKing', 'HiddenPower', 'SilentKiller', 'UnderCover', 'DisguisedPro', 'SecretForce', 'HiddenForce', 'SilentForce', 'UnderCoverPro', 'DisguisedKing', 'SecretKing', 'HiddenKing', 'SilentKing', 'UnderCoverKing', 'DisguisedForce']
    }
  ];

  const toxicNames = ['ToxicMaster', 'RageKing', 'TiltMaster', 'FlameWarrior', 'SaltLord', 'ToxicForce', 'RageForce', 'TiltForce', 'FlameForce', 'SaltForce', 'ToxicGod', 'RageGod', 'TiltGod', 'FlameGod', 'SaltGod', 'ToxicPro', 'RagePro', 'TiltPro', 'FlamePro', 'SaltPro'];
  
  const shortTags = ['LOL', 'LGD', 'FNC', 'G2', 'T1', 'DWG', 'EDG', 'JDG', 'HLE', 'DRX', 'GEN', 'KT', 'AF', 'NS', 'BRO', 'LSB', 'KDF', 'DK', 'SB', 'HM', 'FOX', 'GRF', 'JAG', 'KZ', 'MVP', 'ROX', 'SKT', 'SSW', 'SSB', 'CJ', 'IM', 'NJ', 'OMG', 'IG', 'RNG', 'WE'];

  const faqs = [
    { q: 'What makes a good League of Legends tryhard name?', a: 'A good League of Legends tryhard name is usually short, memorable, and intimidating. It often reflects your main role, champion pool, or playstyle, using clean formatting without excessive numbers or symbols.' },
    { q: 'Can I change my League of Legends name?', a: 'Yes, you can change your Riot ID (which serves as your League of Legends name) for free every 90 days through your Riot account management page.' },
    { q: 'Are there name restrictions in League of Legends?', a: 'Yes, names must be between 3 and 16 characters long. They cannot contain profanity, hate speech, or impersonate Riot employees or esports professionals.' },
    { q: 'What are the best names for each role?', a: 'Top laners often use imposing, tanky names (Titan, Iron). Junglers prefer stealthy or predatory names (Shadow, Hunter). Mid laners lean towards magical or assassin themes (Arcane, Mystic). ADCs use damage-focused names (Carry, Crit), and Supports use protective names (Shield, Guardian).' },
    { q: 'How do I get a Challenger-level name?', a: 'Challenger-level names are typically very clean, often just one word, without numbers or special characters. They exude confidence and simplicity.' },
    { q: 'What are smurf account names?', a: 'Smurf names are used by high-ranking players on lower-ranked alternate accounts. They often feature ironic, hidden, or barcode-style names to conceal their true identity.' },
    { q: 'Can I use special characters in my LoL name?', a: 'Riot IDs support a wide range of Unicode characters, depending on your region. However, keeping it to standard alphanumeric characters is recommended for a cleaner "tryhard" look.' },
    { q: 'How often can I change my League name?', a: 'You can change your Riot ID for free once every 90 days.' },
    { q: 'What are the most popular LoL names?', a: 'Popular names often mimic professional players, use anime references, or combine a cool adjective with a role or champion name.' },
    { q: 'How do I make my name stand out?', a: 'To stand out, avoid common tropes like adding "xX" or birth years. Opt for a unique, single-word moniker or a clever two-word combination that reflects your gaming persona.' }
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
    <>
      <Helmet>
        <title>League of Legends Tryhard Names – Pro & Competitive Names 2026</title>
        <meta name="description" content="Generate the best League of Legends tryhard names by role (Top, Jungle, Mid, ADC, Support). Challenger, Diamond, and smurf account names included." />
        <link rel="canonical" href="https://tryhardnames.com/league-of-legends-tryhard-names" />
        <link rel="alternate" hrefLang="en" href="https://tryhardnames.com/league-of-legends-tryhard-names" />
        <link rel="alternate" hrefLang="es" href="https://tryhardnames.com/es/nombres-lol-tryhard" />
        <link rel="alternate" hrefLang="x-default" href="https://tryhardnames.com/" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="bg-background text-foreground selection:bg-[#C89B3C]/30 flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden min-h-[80vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A8CC9]/10 via-background to-background z-10"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5B2C6F]/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C89B3C]/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                League of Legends <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A8CC9] via-[#C89B3C] to-[#5B2C6F]">
                  Tryhard Names
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto font-medium leading-relaxed">
                Dominate the Rift with the most intimidating, competitive, and professional League of Legends names for every role and rank.
              </p>
            </motion.div>
          </div>
        </section>

        <AdPlaceholderZone position="top" />

        {/* Role-Based Names */}
        <section className="py-20 bg-card/30 border-y border-border/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Best Names by <span className="text-[#C89B3C]">Role</span></h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">Find the perfect moniker that matches your playstyle and lane dominance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {roles.map((role, idx) => (
                <motion.div 
                  key={role.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-card rounded-2xl p-6 border ${role.border} shadow-lg hover:shadow-2xl transition-all duration-300 group`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-xl ${role.bg} ${role.color}`}>
                      <role.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold">{role.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {role.names.map((name, nIdx) => (
                      <div key={nIdx} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50 hover:border-[#C89B3C]/50 transition-colors">
                        <span className="font-medium text-lg">{name}</span>
                        <CopyButton textToCopy={name} className="h-10 w-10" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <AdPlaceholderZone position="mid" />

        {/* Ranked Tiers */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Ranked Tier <span className="text-[#0A8CC9]">Tryhard Names</span></h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">Names that strike fear into the hearts of your solo queue opponents.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tiers.map((tier, idx) => (
                <motion.div 
                  key={tier.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-6 justify-center">
                    <tier.icon className={`w-8 h-8 ${tier.color}`} />
                    <h3 className="text-2xl font-bold">{tier.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {tier.names.map((name, nIdx) => (
                      <div key={nIdx} className="flex items-center justify-between bg-background p-3 rounded-lg border border-border/30 hover:border-primary/50 transition-colors">
                        <span className="font-medium">{name}</span>
                        <CopyButton textToCopy={name} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Toxic & Edgy / Short Tags */}
        <section className="py-20 bg-card/30 border-y border-border/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Toxic/Edgy */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Flame className="w-8 h-8 text-red-500" />
                  <h2 className="text-3xl font-black">Toxic & Edgy Names</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {toxicNames.map((name, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-background p-3 rounded-lg border border-border/50 hover:border-red-500/50 transition-colors">
                      <span className="font-medium">{name}</span>
                      <CopyButton textToCopy={name} />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Short Tags */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Hash className="w-8 h-8 text-[#C89B3C]" />
                  <h2 className="text-3xl font-black">Short LoL Tags</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {shortTags.map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-background px-4 py-2 rounded-full border border-border/50 hover:border-[#C89B3C]/50 transition-colors">
                      <span className="font-bold tracking-wider">{tag}</span>
                      <CopyButton textToCopy={tag} className="h-6 w-6 p-1" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl prose prose-invert prose-lg">
            <h2 className="text-3xl font-black text-[#C89B3C] mb-6">Why League of Legends Tryhard Names Matter</h2>
            <p>In the highly competitive environment of League of Legends, your summoner name (now Riot ID) is your first impression. A tryhard name signals to your teammates and opponents that you take the game seriously, understand the meta, and are here to win. It sets a psychological tone before the minions even spawn. Whether you are grinding through Silver or pushing for Challenger, a clean, intimidating name can give you a subtle mental edge.</p>

            <h2 className="text-3xl font-black text-[#0A8CC9] mt-12 mb-6">Best League of Legends Tryhard Names by Role</h2>
            <p>Every role in League of Legends has its own distinct identity and playstyle, and your name should reflect that. <strong>Top laners</strong> often choose names that convey unyielding strength and resilience, acting as the immovable object for their team. <strong>Junglers</strong> benefit from names that imply stealth, predation, and map control, striking fear into overextended enemies. <strong>Mid laners</strong>, often the star carries, lean towards names highlighting magical prowess or lethal assassination skills. <strong>ADCs</strong> need names that scream high damage output and mechanical perfection, while <strong>Supports</strong> utilize names that emphasize utility, protection, and vision control.</p>

            <h2 className="text-3xl font-black text-[#5B2C6F] mt-12 mb-6">Ranked Tier Tryhard Names</h2>
            <p>As you climb the ranked ladder, the naming conventions change. In lower elos, you might see longer, more complex names. However, as you approach Diamond, Master, and Challenger, names become shorter, cleaner, and more abstract. A true Challenger tryhard name is often a single, correctly spelled word without any numbers or special characters. Smurf accounts, on the other hand, often use barcode names (like lIllIlII) or ironic, unassuming names to hide their true skill level until they load onto the Rift.</p>

            <h2 className="text-3xl font-black text-red-500 mt-12 mb-6">Toxic & Edgy League Names</h2>
            <p>While we always encourage positive gameplay, the reality of competitive gaming is that some players prefer an edgy or "toxic" aesthetic. These names are designed to tilt opponents and establish dominance through sheer intimidation. Words associated with rage, salt, and darkness are common here. Use these at your own risk, as they might make you a target for enemy jungler ganks!</p>

            <h2 className="text-3xl font-black text-[#C89B3C] mt-12 mb-6">Short LoL Tags for Clans & Teams</h2>
            <p>If you are playing Clash or forming a competitive team, having a recognizable 3-4 letter tag is essential. Drawing inspiration from professional esports organizations (like T1, G2, or FNC), a strong tag unifies your team and looks incredibly professional on the loading screen. Combine these tags with your tryhard name for the ultimate competitive aesthetic.</p>

            <h2 className="text-3xl font-black text-foreground mt-12 mb-6">How to Choose the Perfect League of Legends Tryhard Name</h2>
            <p>Choosing the perfect name requires balancing uniqueness with simplicity. Start by identifying your main champion or role. Extract core themes (e.g., shadows for Zed, ice for Ashe). Avoid using your real name or birth year. Keep it under 10 characters if possible. The best tryhard names are easy to pronounce, making them perfect for voice comms and potential esports casting.</p>

            <h2 className="text-3xl font-black text-foreground mt-12 mb-6">League of Legends Naming Tips & Tricks</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Keep it clean:</strong> Avoid excessive numbers (e.g., Shadow99) or Xx_ formatting.</li>
              <li><strong>Use capitalization wisely:</strong> CamelCase (e.g., ShadowHunter) is acceptable, but all lowercase (e.g., shadowhunter) often looks more "tryhard" in high elo.</li>
              <li><strong>Check availability:</strong> With the transition to Riot IDs, you can have the same name as someone else, differentiated by the tagline (e.g., Name#NA1). This makes getting your dream name much easier!</li>
            </ul>

            <h2 className="text-3xl font-black text-foreground mt-12 mb-6">Trending League Names 2026</h2>
            <p>In 2026, the trend is moving heavily towards minimalist, single-word concepts. Abstract nouns, mythological references, and subtle nods to game mechanics are highly sought after. Players are moving away from champion-specific names (like "YasuoGod") in favor of broader, more versatile monikers that remain relevant even if the meta shifts.</p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-card/30 border-t border-border/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Frequently Asked <span className="text-[#0A8CC9]">Questions</span></h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="group bg-card border border-border/50 rounded-xl p-6 cursor-pointer shadow-sm hover:border-[#0A8CC9]/50 transition-colors">
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
        </section>

        {/* Interlinks */}
        <section className="py-12 border-t border-border/30">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-bold mb-6 text-foreground/60 uppercase tracking-wider">Explore More Tools</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/stylish-text-generator" className="px-6 py-3 bg-card border border-border/50 rounded-full hover:border-primary hover:text-primary transition-colors">Stylish Text Generator</Link>
              <Link to="/clan-name-generator" className="px-6 py-3 bg-card border border-border/50 rounded-full hover:border-primary hover:text-primary transition-colors">Clan Name Generator</Link>
              <Link to="/gamer-bio-generator" className="px-6 py-3 bg-card border border-border/50 rounded-full hover:border-primary hover:text-primary transition-colors">Gamer Bio Generator</Link>
              <Link to="/valorant-tryhard-names" className="px-6 py-3 bg-card border border-border/50 rounded-full hover:border-primary hover:text-primary transition-colors">Valorant Names</Link>
              <Link to="/fortnite-tryhard-names" className="px-6 py-3 bg-card border border-border/50 rounded-full hover:border-primary hover:text-primary transition-colors">Fortnite Names</Link>
            </div>
          </div>
        </section>

        <AdPlaceholderZone position="bottom" />
      </div>
    </>
  );
};

export default LeagueOfLegendsNamesPage;