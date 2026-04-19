import React, { useState } from 'react';
import RobloxGameModal from './RobloxGameModal.jsx';
import { Users, Gamepad2 } from 'lucide-react';

const gamesData = [
  {
    id: '1',
    title: 'Murder Mystery 2',
    category: 'Horror / Survival',
    description: 'Solve the mystery and survive the round. Are you the innocent, the sheriff, or the murderer?',
    players: 125430,
    image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000&auto=format&fit=crop',
    topNames: ['SilentBlade', 'ShadowSleuth', 'LethalSuspect', 'DarkDetective', 'CrimsonGuilt', 'GhostlySheriff', 'VenomousAlibi', 'MidnightKiller']
  },
  {
    id: '2',
    title: 'Brookhaven RP',
    category: 'Roleplay / City',
    description: 'Hang out with like-minded people and roleplay. Own and live in amazing houses, drive cool vehicles and explore the city.',
    players: 450200,
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop',
    topNames: ['CitySlicker', 'UrbanLegend', 'MetroMayor', 'DowntownVibe', 'SuburbanStar', 'CivicDreamer', 'AvenueWalker', 'TownSquarePro']
  },
  {
    id: '3',
    title: 'Royale High',
    category: 'Fashion / Fantasy',
    description: 'Welcome to Royale High, your ever-growing dream world! Dress up, play games, and chat with friends.',
    players: 85600,
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=2000&auto=format&fit=crop',
    topNames: ['CrystalPrincess', 'DiamondDiva', 'FairyQueen', 'GlamourAngel', 'RoyalSparkle', 'EnchantedRose', 'MajesticTiara', 'StarLightFairy']
  },
  {
    id: '4',
    title: 'Bloxburg',
    category: 'City / Building',
    description: 'Build and design your own amazing house, own cool vehicles, hang out with friends, work, roleplay or explore the city.',
    players: 92100,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop',
    topNames: ['MasterArchitect', 'CozyBuilder', 'EstateMogul', 'VillaCreator', 'UrbanDesigner', 'HomeCrafter', 'MansionMaker', 'PlotPioneer']
  },
  {
    id: '5',
    title: 'Lumber Tycoon 2',
    category: 'Simulation / Building',
    description: 'Chop trees, build your dream base, and explore the vast world. Discover rare woods and become the ultimate lumberjack.',
    players: 34500,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop',
    topNames: ['TimberBaron', 'WoodChopper', 'ForestTycoon', 'AxeMaster', 'LogHauler', 'SawmillPro', 'PineHarvester', 'OakTrader']
  },
  {
    id: '6',
    title: 'Piggy',
    category: 'Horror / Survival',
    description: 'Do you have what it takes to escape Piggy and uncover the mysteries surrounding the beast?',
    players: 67800,
    image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2000&auto=format&fit=crop',
    topNames: ['BaconSurvivor', 'InfectedRunner', 'EscapeArtist', 'KeyFinder', 'TrappedSoul', 'PiggyDodger', 'MazeRunner', 'SurvivalInstinct']
  },
  {
    id: '7',
    title: 'MeepCity',
    category: 'Roleplay / Social',
    description: 'The city that is all about YOU! Chat, play games, earn coins, and customize your very own estate.',
    players: 54200,
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2000&auto=format&fit=crop',
    topNames: ['PartyStarter', 'SocialButterfly', 'MeepMaster', 'NeighborhoodPal', 'FriendlyFace', 'ChattyGamer', 'PlazaHangout', 'CafeChiller']
  },
  {
    id: '8',
    title: 'Adopt Me!',
    category: 'Pets / Roleplay',
    description: 'Raise and dress cute pets, decorate your house, and play with friends in the magical, family-friendly world of Adopt Me!',
    players: 310500,
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=2000&auto=format&fit=crop',
    topNames: ['PetCollector', 'NeonTrader', 'LegendaryHatcher', 'EggOpener', 'FurryFriend', 'MegaNeonPro', 'TradeMaster', 'PetWhisperer']
  },
  {
    id: '9',
    title: 'Arsenal',
    category: 'FPS / Shooter',
    description: 'Race to the top through a massive arsenal of weapons! Conquer fast-paced arcade gameplay across diverse maps.',
    players: 42300,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop',
    topNames: ['HeadshotKing', 'AimBotZ', 'TriggerHappy', 'GoldenGunner', 'SniperElite', 'RunAndGun', 'TacticalShooter', 'WeaponMaster']
  },
  {
    id: '10',
    title: 'Epic PvP 23',
    category: 'Action / Fighting',
    description: 'Battle against other players in intense arena combat. Master your combos and rise to the top of the leaderboards.',
    players: 18900,
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2000&auto=format&fit=crop',
    topNames: ['BladeDancer', 'ComboMaster', 'ArenaChampion', 'StrikeForce', 'BattleBorn', 'WarriorSoul', 'GladiatorX', 'CombatLegend']
  },
  {
    id: '11',
    title: 'Phantom Forces',
    category: 'FPS / Tactical',
    description: 'Engage in tactical team-based firefights. Customize your loadout and dominate the battlefield with precision.',
    players: 25600,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2000&auto=format&fit=crop',
    topNames: ['GhostOperative', 'ReconSniper', 'TacticalAssault', 'ShadowReaper', 'EliteMarksman', 'CovertOps', 'StealthRanger', 'ForceCommander']
  },
  {
    id: '12',
    title: 'Epic Obby 56',
    category: 'Obby / Platformer',
    description: 'Test your parkour skills in this massive obstacle course. Can you reach the end without falling?',
    players: 15400,
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop',
    topNames: ['JumpMaster', 'ParkourPro', 'ObstacleDodger', 'SpeedRunner', 'LeapLegend', 'PlatformKing', 'GravityDefier', 'ObbyChampion']
  }
];

const RobloxPopularGamesGallery = ({ onGenerateName }) => {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gamesData.map(game => (
          <div 
            key={game.id}
            onClick={() => handleGameClick(game)}
            className="group relative bg-card border border-border/50 rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl flex flex-col"
          >
            <div className="aspect-video overflow-hidden relative">
              <img 
                src={game.image} 
                alt={game.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-white text-sm font-medium line-clamp-2 mb-2">{game.category}</span>
                <div className="flex items-center text-xs font-bold text-green-400">
                  <Users className="w-3 h-3 mr-1" /> {game.players.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">{game.title}</h3>
                <p className="text-xs text-foreground/60 mt-2 line-clamp-2">{game.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-border/30">
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider mb-2">Top Names</p>
                <div className="flex flex-wrap gap-1">
                  {game.topNames.slice(0, 2).map(name => (
                    <span key={name} className="text-xs bg-background px-2 py-1 rounded border border-border/50 text-foreground/80 hover:text-primary hover:border-primary/50 transition-colors">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <RobloxGameModal 
        game={selectedGame ? {
          ...selectedGame,
          name: selectedGame.title,
          gameType: selectedGame.category,
          activePlayers: selectedGame.players,
          popularNames: selectedGame.topNames
        } : null} 
        isOpen={!!selectedGame} 
        onClose={() => setSelectedGame(null)} 
        onGenerateName={onGenerateName}
      />
    </div>
  );
};

export default RobloxPopularGamesGallery;