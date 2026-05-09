import React from 'react';

const gameData = {
  fortnite: {
    name: "Fortnite",
    context: "In the fast-paced world of Fortnite Battle Royale, building mechanics and competitive seasons define the meta.",
    sections: {
      best: "When dropping into Apollo or Artemis, having one of the best Fortnite tryhard names sets the tone before you even deploy your glider. The competitive scene is fierce, with players constantly grinding Arena and FNCS. A top-tier name reflects your dedication to mastering piece control, editing, and raw aim. Players often look for names that are intimidating yet clean, avoiding unnecessary clutter that might make them look like a novice. The best names often combine a sleek prefix with a powerful noun, creating an identity that is instantly recognizable in the kill feed.",
      stylish: "Stylish Fortnite names are all about aesthetics. With the rise of content creation on platforms like TikTok and YouTube, having a visually appealing name is just as important as your skill level. These names often utilize special Unicode characters, symmetrical designs, or specific capitalization patterns (like alternating caps or all lowercase). A stylish name might incorporate subtle symbols like a single star (★) or a lightning bolt (⚡) to add flair without becoming unreadable. This aesthetic approach is particularly popular among players who focus on hitting clip-worthy sniper shots or complex build sequences.",
      short: "Short competitive gamer tags for Fortnite are the holy grail of the community. A 3 or 4-letter name is a massive flex, signaling that you've been around since the early seasons or that you take your branding seriously. Because Epic Games requires unique display names, securing a pure short name is incredibly difficult. As a result, players often use clever workarounds, such as replacing letters with similar-looking numbers or adding a subtle underscore. Short names are highly practical for competitive play, as they are easy for teammates to call out during chaotic endgame rotations.",
      sweaty: "Sweaty Fortnite names are designed to strike fear into the hearts of your opponents. These are the names you see right before someone cranks 90s to max height and one-pumps you. They often feature aggressive terminology like 'Toxic', 'Lethal', or 'Cracked'. Adding 'TTV' or 'YT' to the beginning or end of the name is a classic sweaty trope, indicating that the player is likely streaming and trying their hardest to get content. Sweaty names are a psychological weapon, making enemies second-guess their pushes and play more passively.",
      unique: "Finding unique Fortnite name ideas requires creativity. Instead of copying the exact names of pro players, the best approach is to blend different elements. Consider combining a mythical creature with a modern gaming term, or translating a cool-sounding word into another language. Unique names help you build a distinct personal brand. If you ever plan on joining an esports organization or starting a clan, having a unique foundational name makes it much easier to append a clan tag later without the name feeling disjointed.",
      why: "Why do Fortnite players need stylish names? Because Fortnite is as much a social platform as it is a battle royale. Your name is your digital identity across millions of players. It appears above your character in the pre-game lobby, in the squad UI, and prominently in the elimination feed. A generic name with random numbers (like Player8472) suggests a lack of experience or investment in the game. Conversely, a carefully crafted, stylish tryhard name commands immediate respect, helps you network with other high-level players, and makes your gameplay clips look significantly more professional."
    },
    examples: {
      Aggressive: ["LethalStrike", "ToxicAim", "CrackedDemon", "SweatyReaper", "FatalEdit", "SavagePump", "RuthlessFN", "ViciousBuild", "GrimSlayer", "MercilessTTV", "BloodFrenzy", "DoomBringer", "Wrathful", "FierceFighter", "BrutalClutch", "MenaceFN", "TerrorTTV", "HavocCreator", "RageQuit", "Spiteful"],
      Aesthetic: ["v o i d", "c l o u d", "a u r a", "n e o n", "s h a d o w", "e c h o", "l u n a", "s o l a r", "a s t r a l", "n o v a", "z e n i t h", "c e l e s t e", "m i r a g e", "o a s i s", "e t h e r", "h a l o", "l u m e n", "v e l v e t", "s i l k", "g l a c i e r"],
      Short: ["Zex", "Voi", "Kry", "Nox", "Ryn", "Syk", "Taz", "Vex", "Wyn", "Xyr", "Yen", "Zor", "Aex", "Bly", "Cyn", "Dax", "Ery", "Fyn", "Gry", "Hax"],
      Mythical: ["ZeusFN", "HadesAim", "AresEdit", "ApolloPump", "AthenaClutch", "ThorStrike", "LokiSlayer", "OdinBuild", "FreyaTTV", "TyrDemon", "AnubisReaper", "HorusFatal", "RaSavage", "OsirisRuthless", "SetVicious", "IsisGrim", "BastetMerciless", "ThothBlood", "PtahDoom", "SobekWrath"],
      Symbols: ["★Lethal", "⚡Toxic", "☠Cracked", "⚔Sweaty", "♛Fatal", "◆Savage", "✦Ruthless", "✧Vicious", "❖Grim", "۞Merciless", "★Blood", "⚡Doom", "☠Wrath", "⚔Fierce", "♛Brutal", "◆Menace", "✦Terror", "✧Havoc", "❖Rage", "۞Spite"]
    }
  },
  valorant: {
    name: "Valorant",
    context: "In Riot's tactical shooter Valorant, precise gunplay, agent abilities, and a punishing ranked system demand respect.",
    sections: {
      best: "The best Valorant tryhard names reflect the precision and tactical depth of the game. Unlike battle royales, Valorant is a game of milliseconds and pixel-perfect crosshair placement. A top-tier name in this environment often sounds professional, clean, and focused on mechanics. Words related to aiming, tapping, and high ranks (like Immortal or Radiant) are extremely popular. Because Riot IDs allow for a tagline (the # part), players have much more freedom to choose the exact display name they want, making the competition for the 'cleanest' looking name fierce.",
      stylish: "Stylish Valorant names lean heavily into the minimalist aesthetic. The tactical shooter community has long favored lowercase, single-word names that look sleek on the scoreboard. A stylish name might be a simple noun or verb related to the game's mechanics, such as 'flick', 'peek', or 'dash'. Players also frequently use Japanese or Korean characters to add an exotic, highly stylized look to their profiles. The goal is to look effortless; a truly stylish Valorant name doesn't need to scream for attention, it simply looks undeniably cool when you're top-fragging.",
      short: "Short competitive gamer tags for Valorant are the standard for high-level play. When you're executing a site take or calling out enemy positions, communication must be instant. A 3 or 4-letter name ensures your teammates can address you quickly without stumbling over syllables. Names like 'TenZ', 'Yay', or 'Asuna' set the template. Because of the Riot ID system, you can easily secure a short name like 'Aim' or 'Tap' as long as your tagline is unique. These short tags are a hallmark of a confident, competitive player.",
      sweaty: "Sweaty Valorant names are for the players who lock in Reyna or Jett and refuse to drop below 30 kills. These names often incorporate the names of the agents themselves, combined with aggressive terms. 'JettDiff', 'ReynaDemon', or 'OmenGod' are classic examples. Sweaty names might also reference the player's hardware or setup, like '144hz' or 'ZeroPing', subtly flexing their competitive advantage. When you see a sweaty name on the enemy team, you know you're in for a grueling match against someone who takes their Elo very seriously.",
      unique: "Unique Valorant name ideas often stem from the game's rich lore and agent backgrounds. Instead of just using 'Sniper', a unique name might reference Sova's shadows, Cypher's networks, or Viper's toxins. Combining a sleek aesthetic with a subtle nod to your main agent creates a name that is both personal and intimidating. Another unique approach is to use obscure tactical terms from real-world military or other competitive games, bridging the gap between different competitive communities.",
      why: "Why do Valorant players need stylish names? In a game where mental fortitude is half the battle, your name contributes to your aura. A clean, stylish tryhard name can actually intimidate opponents, making them play more cautiously against you. It also helps in the social aspect of the game; players are more likely to add and queue up with someone who has a professional-looking tag rather than a default or messy one. Your name is your brand on the Radiant leaderboard."
    },
    examples: {
      Aggressive: ["AimBot", "HeadHunter", "FlickGod", "TapDemon", "ClutchKing", "AceMachine", "FragLord", "PeekAdvantage", "OneTap", "SprayTransfer", "RecoilMaster", "CrosshairPlacement", "EntryFragger", "SiteAnchor", "LurkDemon", "FlankGod", "RetakeKing", "DefuseMachine", "PlantLord", "SpikeAdvantage"],
      Aesthetic: ["f l i c k", "t a p", "p e e k", "d a s h", "s m o k e", "f l a s h", "s t u n", "b l i n d", "w a l l", "h e a l", "r e v i v e", "u l t", "o r b", "s o u n d", "s t e p", "w a l k", "r u n", "j u m p", "c r o u c h", "s t a n d"],
      Short: ["Aim", "Tap", "Fli", "Pek", "Dsh", "Smk", "Fla", "Stn", "Bld", "Wal", "Hel", "Rev", "Ult", "Orb", "Snd", "Stp", "Wlk", "Run", "Jmp", "Crc"],
      Mythical: ["RadiantZeus", "ImmortalHades", "AscendantAres", "DiamondApollo", "PlatinumAthena", "GoldThor", "SilverLoki", "BronzeOdin", "IronFreya", "RadiantTyr", "ImmortalAnubis", "AscendantHorus", "DiamondRa", "PlatinumOsiris", "GoldSet", "SilverIsis", "BronzeBastet", "IronThoth", "RadiantPtah", "ImmortalSobek"],
      Symbols: ["★Aim", "⚡Tap", "☠Flick", "⚔Peek", "♛Dash", "◆Smoke", "✦Flash", "✧Stun", "❖Blind", "۞Wall", "★Heal", "⚡Revive", "☠Ult", "⚔Orb", "♛Sound", "◆Step", "✦Walk", "✧Run", "❖Jump", "۞Crouch"]
    }
  },
  roblox: {
    name: "Roblox",
    context: "Roblox is a massive game creation platform where social identity, trading, and competitive mini-games like Da Hood and Arsenal thrive.",
    sections: {
      best: "The best Roblox tryhard names are highly sought after because usernames on the platform must be entirely unique across millions of active players. A top-tier Roblox name often features a blend of edgy vocabulary and clever formatting. Since you can't use special symbols, players rely on underscores, alternating capitalization, or replacing letters with 'X' or 'Z' to achieve a tryhard look. The best names are memorable, look great in the chat box, and command respect in competitive games like Arsenal, Phantom Forces, or BedWars.",
      stylish: "Stylish Roblox names are deeply tied to the platform's 'aesthetic' and 'slender' communities. These names often evoke a specific vibe—usually dark, moody, or minimalist. Words like 'Void', 'Abyss', 'Sorrow', or 'Gloom' are incredibly popular. A stylish name avoids numbers whenever possible, as numbers are often associated with newer or less experienced players (noobs). Instead, stylish players will use repeating letters (e.g., 'Voiid') to secure a name that sounds clean while remaining unique.",
      short: "Short competitive gamer tags for Roblox are a strong status signal. 3-letter and 4-letter usernames were all registered years ago, making them incredibly rare and valuable. If you have a short name, other players immediately know you are an OG or a highly dedicated player. While you might not be able to register a new 3-letter username today, you can use the Display Name feature to give yourself a short, punchy tag that appears above your avatar in-game, allowing you to flex a clean 3-letter tag in any experience.",
      sweaty: "Sweaty Roblox names are designed for the platform's PvP and competitive scenes. In games like Da Hood, players use names that look intimidating or are intentionally difficult to read (like barcode names using capital I and lowercase l) to make it harder for enemies to target or report them. Sweaty names often include terms like 'Toxic', 'Demon', or 'Slayer'. Adding 'YT' or 'Playz' is also a common sweaty tactic, signaling that the player is recording and trying their absolute hardest to get clips.",
      unique: "Unique Roblox name ideas require thinking outside the box to bypass the 'username already taken' error. Instead of standard English words, try using Latin prefixes, obscure mythological references, or combining two contrasting concepts (e.g., 'NeonGrave' or 'CyberWraith'). Using the Display Name feature gives you the freedom to be truly unique without worrying about availability, allowing you to change your identity to match your current avatar's outfit or the specific game you are playing that week.",
      why: "Why do Roblox players need stylish names? In Roblox, your avatar and your name are your entire identity. Whether you are trading rare limited items, roleplaying, or competing in a shooter, your name dictates how others perceive you. A stylish, tryhard name makes you look experienced, wealthy, and skilled. It helps you get accepted into exclusive clans, makes trading easier as people trust 'clean' names more, and ensures you stand out in servers that hold dozens or even hundreds of players."
    },
    examples: {
      Aggressive: ["ToxicSlayer", "DemonBlade", "ShadowNinja", "DarkAssassin", "BloodReaper", "GrimFighter", "FatalStrike", "ViciousWarrior", "RuthlessKiller", "SavageBrawler", "MenaceRoblox", "TerrorGamer", "HavocPlayz", "RageQuitYT", "SpitefulBoy", "WrathfulGirl", "FierceLord", "BrutalMaster", "DoomBringer", "MercilessPro"],
      Aesthetic: ["V o i d", "A b y s s", "S o r r o w", "G l o o m", "N e o n", "C y b e r", "A s t r a l", "L u n a r", "S o l a r", "E c h o", "M i r a g e", "O a s i s", "E t h e r", "H a l o", "L u m e n", "V e l v e t", "S i l k", "G l a c i e r", "C e l e s t e", "Z e n i t h"],
      Short: ["Zex", "Voi", "Kry", "Nox", "Ryn", "Syk", "Taz", "Vex", "Wyn", "Xyr", "Yen", "Zor", "Aex", "Bly", "Cyn", "Dax", "Ery", "Fyn", "Gry", "Hax"],
      Mythical: ["ZeusBlox", "HadesGamer", "AresPlayz", "ApolloYT", "AthenaPro", "ThorMaster", "LokiLord", "OdinBoy", "FreyaGirl", "TyrNinja", "AnubisAssassin", "HorusReaper", "RaFighter", "OsirisStrike", "SetWarrior", "IsisKiller", "BastetBrawler", "ThothRoblox", "PtahGamer", "SobekPlayz"],
      Symbols: ["xX_Toxic_Xx", "l_Demon_l", "o_Shadow_o", "v_Dark_v", "z_Blood_z", "x_Grim_x", "y_Fatal_y", "w_Vicious_w", "u_Ruthless_u", "t_Savage_t", "s_Menace_s", "r_Terror_r", "q_Havoc_q", "p_Rage_p", "n_Spiteful_n", "m_Wrathful_m", "k_Fierce_k", "j_Brutal_j", "h_Doom_h", "g_Merciless_g"]
    }
  },
  "free-fire": {
    name: "Free Fire",
    context: "Garena Free Fire is a fast-paced mobile battle royale where stylish names, guild tags, and aggressive gameplay dominate.",
    sections: {
      best: "The best Free Fire tryhard names are legendary within the mobile gaming community. Free Fire players take their in-game names incredibly seriously, often spending diamonds just to change their name to something more intimidating. The best names usually combine a powerful English word (like 'Boss', 'King', or 'Legend') with highly stylized fonts and unique Unicode symbols. A top-tier name in Free Fire isn't just read; it's experienced visually. It shows that you are a veteran player who understands the culture and aesthetics of the game.",
      stylish: "Stylish Free Fire names are an art form. The game client supports a massive variety of Unicode characters, allowing players to create names that look like they belong to esports royalty. The umbrella symbol (☂), the crown (♛), and various cross or star symbols are staples of a stylish FF name. Players also use invisible space characters to create gaps in their names, a trick that makes the name look incredibly clean and unique. A stylish name is practically a requirement if you want to be recruited into a Grandmaster-level guild.",
      short: "Short competitive gamer tags for Free Fire are highly effective. In a fast-paced mobile game, a short name is easy to read in the kill feed and looks punchy on the MVP screen. 3 or 4-letter names combined with a single, powerful symbol (e.g., 'God ♛' or 'Pro ★') are classic competitive tags. These short names are often used by esports players and top-ranked grinders who want their gameplay to speak louder than a long, complicated username.",
      sweaty: "Sweaty Free Fire names are all about showing dominance. Suffixes like '999' (a nod to high ping or just a stylish number), 'FF', or 'YT' are incredibly common among sweaty players. These names often feature aggressive words like 'Killer', 'Toxic', or 'Sniper'. When you see a name like 'Toxic★999' in your lobby, you know you're dealing with a player who likely has elite pass bundles, maxed-out character skills, and a highly aggressive playstyle.",
      unique: "Unique Free Fire name ideas involve mixing different languages, obscure symbols, and clan tags. Instead of using the standard umbrella symbol, a unique name might use rare geometric shapes or stylized brackets. Creating a unique name also involves finding the perfect balance between readability and aesthetics. You want a name that stands out but can still be pronounced by your squadmates during a heated clash squad match.",
      why: "Why do Free Fire players need stylish names? In Free Fire, your profile is a showcase of your achievements, your rank, and your style. A default or plain name makes you look like a bot or a casual player. A stylish, tryhard name commands respect in the lobby, makes your Booyah screens look epic, and is essential for building a reputation in the game's massive social and competitive ecosystems. It's the first step to becoming a recognized player in your region."
    },
    examples: {
      Aggressive: ["BossKiller", "KingSniper", "ToxicShooter", "ProGamer", "DarkLegend", "DemonMaster", "ShadowGod", "BloodDevil", "GrimGhost", "FatalHunter", "ViciousBoy", "RuthlessGirl", "SavagePro", "MenaceMax", "Terror999", "Havoc007", "RageX", "SpitefulZ", "WrathfulVIP", "FierceBoss"],
      Aesthetic: ["B o s s", "K i n g", "T o x i c", "P r o", "D a r k", "D e m o n", "S h a d o w", "B l o o d", "G r i m", "F a t a l", "V i c i o u s", "R u t h l e s s", "S a v a g e", "M e n a c e", "T e r r o r", "H a v o c", "R a g e", "S p i t e f u l", "W r a t h f u l", "F i e r c e"],
      Short: ["Bos", "Kng", "Tox", "Pro", "Drk", "Dem", "Sha", "Bld", "Grm", "Fat", "Vic", "Rut", "Sav", "Men", "Ter", "Hav", "Rag", "Spi", "Wra", "Fie"],
      Mythical: ["ZeusBoss", "HadesKing", "AresToxic", "ApolloPro", "AthenaDark", "ThorDemon", "LokiShadow", "OdinBlood", "FreyaGrim", "TyrFatal", "AnubisVicious", "HorusRuthless", "RaSavage", "OsirisMenace", "SetTerror", "IsisHavoc", "BastetRage", "ThothSpiteful", "PtahWrathful", "SobekFierce"],
      Symbols: ["☂Boss", "♛King", "★Toxic", "☠Pro", "⚔Dark", "◆Demon", "✦Shadow", "✧Blood", "❖Grim", "۞Fatal", "☂Vicious", "♛Ruthless", "★Savage", "☠Menace", "⚔Terror", "◆Havoc", "✦Rage", "✧Spiteful", "❖Wrathful", "۞Fierce"]
    }
  },
  cod: {
    name: "Call of Duty",
    context: "Call of Duty multiplayer and Warzone demand fast reflexes, tactical movement, and a sweaty, military-inspired identity.",
    sections: {
      best: "The best Call of Duty tryhard names draw heavily from military terminology, tactical gear, and the gritty aesthetic of the franchise. Whether you're grinding camos in multiplayer or dropping into Warzone, a top-tier COD name sounds like a genuine operator callsign. Words like 'Ghost', 'Actual', 'Bravo', and 'Zero' are staples. The best names are punchy, aggressive, and look incredibly clean when they pop up in the center of the screen after you secure a killstreak.",
      stylish: "Stylish COD names often lean towards the 'clean' and 'minimalist' aesthetic, particularly within the sniping and movement communities. A stylish name might be a single, evocative word like 'Void', 'Fade', or 'Myth'. These players often avoid numbers entirely, relying on the Activision ID system (which hides the numbers behind a hash) to display a pure, unadulterated word. This aesthetic is highly favored by players who create montages or stream, as it looks professional and sleek.",
      short: "Short competitive gamer tags for COD are highly respected. In the fast-paced environment of Search and Destroy or Warzone endgames, short names are essential for quick comms. 3 or 4-letter names like 'Six', 'Zex', or 'Aim' are perfect. Because your Activision ID allows you to choose any display name regardless of whether it's taken (thanks to the #12345 suffix), you have the freedom to rock a highly coveted 3-letter tag that would be impossible to get in other games.",
      sweaty: "Sweaty COD names are designed to let the lobby know you haven't touched grass in weeks. These names often reference advanced movement mechanics (like 'Slide', 'Cancel', or 'Movement') or raw skill ('Demon', 'Sweat', 'Cracked'). Adding clan tags like [FaZe], [TTV], or [Sweat] completes the look. When you see a player with a sweaty name using a meta weapon with an obsidian or mastery camo, you know you're in for a difficult gunfight.",
      unique: "Unique COD name ideas can be generated by combining tactical terms with abstract concepts. Instead of just 'Sniper', try 'QuantumOptic' or 'EchoActual'. You can also draw inspiration from the specific weapons or maps you excel at. A unique name helps you stand out in a massive player base and makes your killcams more memorable. It's about finding a balance between the gritty military theme of the game and your own personal gaming brand.",
      why: "Why do COD players need stylish names? In Call of Duty, trash talk and lobby presence are part of the experience. Your name is the first thing enemies see on the scoreboard and the last thing they see on the killcam. A stylish, tryhard name establishes dominance. It signals that you understand the meta, that you have the mechanical skill to back up the aggressive tag, and that you are not a casual player. It's a crucial part of your psychological warfare toolkit."
    },
    examples: {
      Aggressive: ["GhostActual", "ReaperSix", "SniperZero", "TacticalHunter", "BravoKiller", "EchoOperator", "DeltaVanguard", "ShadowStriker", "RoguePhantom", "EliteWraith", "DemonMovement", "SweatySlide", "CrackedAim", "ToxicFlick", "LethalDrop", "FatalPush", "SavageRush", "ViciousFlank", "GrimHold", "MercilessClutch"],
      Aesthetic: ["V o i d", "F a d e", "M y t h", "E c h o", "S h a d o w", "A u r a", "N e o n", "C l o u d", "L u n a", "S o l a r", "A s t r a l", "N o v a", "Z e n i t h", "C e l e s t e", "M i r a g e", "O a s i s", "E t h e r", "H a l o", "L u m e n", "V e l v e t"],
      Short: ["Six", "Zex", "Aim", "Voi", "Fad", "Myt", "Ech", "Sha", "Aur", "Neo", "Clo", "Lun", "Sol", "Ast", "Nov", "Zen", "Cel", "Mir", "Oas", "Eth"],
      Mythical: ["ZeusActual", "HadesSix", "AresZero", "ApolloHunter", "AthenaKiller", "ThorOperator", "LokiVanguard", "OdinStriker", "FreyaPhantom", "TyrWraith", "AnubisMovement", "HorusSlide", "RaAim", "OsirisFlick", "SetDrop", "IsisPush", "BastetRush", "ThothFlank", "PtahHold", "SobekClutch"],
      Symbols: ["★Ghost", "⚡Reaper", "☠Sniper", "⚔Tactical", "♛Bravo", "◆Echo", "✦Delta", "✧Shadow", "❖Rogue", "۞Elite", "★Demon", "⚡Sweaty", "☠Cracked", "⚔Toxic", "♛Lethal", "◆Fatal", "✦Savage", "✧Vicious", "❖Grim", "۞Merciless"]
    }
  }
};

const GamePageSEOContent = ({ game }) => {
  const data = gameData[game];
  if (!data) return null;

  return (
    <section className="max-w-4xl mx-auto py-12 space-y-12 md:space-y-16">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-foreground/90 leading-relaxed">{data.context}</p>
      </div>

      <article className="space-y-4 border-t border-border/15 pt-10">
        <h2 className="text-3xl font-bold text-primary">Best {data.name} Tryhard Names</h2>
        <p className="text-foreground/90 leading-relaxed">{data.sections.best}</p>
      </article>

      <article className="space-y-4 border-t border-border/15 pt-10">
        <h2 className="text-3xl font-bold text-secondary">Stylish {data.name} Names</h2>
        <p className="text-foreground/90 leading-relaxed">{data.sections.stylish}</p>
      </article>

      <article className="space-y-4 border-t border-border/15 pt-10">
        <h2 className="text-3xl font-bold text-accent">Short Competitive Gamer Tags for {data.name}</h2>
        <p className="text-foreground/90 leading-relaxed">{data.sections.short}</p>
      </article>

      <article className="space-y-4 border-t border-border/15 pt-10">
        <h2 className="text-3xl font-bold text-primary">Sweaty {data.name} Names</h2>
        <p className="text-foreground/90 leading-relaxed">{data.sections.sweaty}</p>
      </article>

      <article className="space-y-4 border-t border-border/15 pt-10">
        <h2 className="text-3xl font-bold text-secondary">Unique {data.name} Name Ideas</h2>
        <p className="text-foreground/90 leading-relaxed">{data.sections.unique}</p>
      </article>

      <article className="space-y-4 border-t border-border/15 pt-10">
        <h2 className="text-3xl font-bold text-accent">Why {data.name} Players Need Stylish Names</h2>
        <p className="text-foreground/90 leading-relaxed">{data.sections.why}</p>
      </article>

      <article className="space-y-8 border-t border-border/15 pt-10">
        <h2 className="text-3xl font-bold text-primary">100+ {data.name} Example Names</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(data.examples).map(([category, names]) => (
            <div key={category} className="bg-card border border-border/50 rounded-xl p-6 shadow-refined">
              <h3 className="text-xl font-bold text-foreground mb-4 border-b border-border/30 pb-2">{category}</h3>
              <ul className="grid grid-cols-2 gap-2">
                {names.map((name, idx) => (
                  <li key={idx} className="text-sm text-foreground/80 font-mono hover:text-primary transition-colors cursor-default">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
};

export default GamePageSEOContent;