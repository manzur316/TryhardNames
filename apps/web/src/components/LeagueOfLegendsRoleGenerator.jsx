import React, { useState } from 'react';
import { Sparkles, Copy, Check, Hash, AtSign, Type } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';
import RoleSelector from './RoleSelector.jsx';
import { useToast } from '@/hooks/use-toast.js';

const LeagueOfLegendsRoleGenerator = () => {
  const [selectedRole, setSelectedRole] = useState('Mid');
  const [generatedName, setGeneratedName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [addNumbers, setAddNumbers] = useState(false);
  const [addSymbols, setAddSymbols] = useState(false);
  const [shortTagMode, setShortTagMode] = useState(false);
  
  const { toast } = useToast();

  const roleNames = {
    Top: ['IronWall', 'SteelDefender', 'TankMaster', 'FortressKing', 'BoulderBreaker', 'StoneSentinel', 'IronClad', 'SteelHeart', 'MountainKing', 'RockSolid'],
    Jungle: ['ShadowHunter', 'JungleKing', 'GankMaster', 'PathFinder', 'SilentAssassin', 'VenomStrike', 'NightStalker', 'PredatorForce', 'HuntersMark', 'JungleLord'],
    Mid: ['MageLord', 'SpellMaster', 'MidKing', 'ArcaneForce', 'SpellWeaver', 'MysticSage', 'ArcaneWizard', 'SpellSlinger', 'MageSupreme', 'ArcaneKing'],
    ADC: ['ArrowMaster', 'DamageDealer', 'ADCKing', 'CriticalStrike', 'PrecisionShot', 'BulletStorm', 'MarksMaster', 'DealerForce', 'CriticalHit', 'ADCSupreme'],
    Support: ['GuardianAngel', 'SupportKing', 'HealerMaster', 'ProtectorForce', 'ShieldBearer', 'HealingLight', 'ProtectionForce', 'GuardianForce', 'SupportMaster', 'HealerSupreme']
  };

  const symbols = ['★', '✦', '◆', '⚡', '✨', '⚔️', '☠️'];

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedName('');

    setTimeout(() => {
      let baseName = '';
      if (shortTagMode) {
        baseName = selectedRole.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 99);
      } else {
        const names = roleNames[selectedRole];
        baseName = names[Math.floor(Math.random() * names.length)];
      }

      if (addNumbers) baseName += Math.floor(Math.random() * 999);
      if (addSymbols) {
        const sym = symbols[Math.floor(Math.random() * symbols.length)];
        baseName = Math.random() > 0.5 ? `${sym}${baseName}` : `${baseName}${sym}`;
      }

      setGeneratedName(baseName);
      setIsGenerating(false);
    }, 400);
  };

  const handleCopy = () => {
    if (!generatedName) return;
    navigator.clipboard.writeText(generatedName);
    setCopied(true);
    
    toast({
      title: `${selectedRole} Name Copied!`,
      description: "Ready to dominate your lane.",
      className: "bg-card border-primary text-foreground"
    });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-refined">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 text-center">Select Your Main Role</h3>
        <RoleSelector 
          selectedRole={selectedRole} 
          onSelectRole={(role) => {
            setSelectedRole(role);
          }} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 border-y border-border/30 py-6">
        <ToggleSwitch id="role-numbers" label="Add Numbers" checked={addNumbers} onCheckedChange={setAddNumbers} icon={Hash} />
        <ToggleSwitch id="role-symbols" label="Add Symbols" checked={addSymbols} onCheckedChange={setAddSymbols} icon={AtSign} />
        <ToggleSwitch id="role-short" label="Short Tag Mode" checked={shortTagMode} onCheckedChange={setShortTagMode} icon={Type} />
      </div>

      <div className="flex flex-col items-center space-y-6">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-primary text-black hover:bg-primary/90 text-lg py-6 px-12 font-bold transition-all duration-300 hover:scale-105 w-full md:w-auto"
        >
          {isGenerating ? <Sparkles className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
          Generate {selectedRole} Name
        </Button>

        <AnimatePresence mode="wait">
          {generatedName && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md bg-background border-2 border-primary/50 rounded-xl p-6 flex flex-col items-center gap-4"
            >
              <span className="text-3xl md:text-4xl font-black text-primary break-all text-center">
                {generatedName}
              </span>
              <Button 
                onClick={handleCopy} 
                variant="outline" 
                className={`w-full ${copied ? 'bg-green-500/20 text-green-500 border-green-500/50' : 'hover:bg-primary/20 hover:text-primary border-primary/30'}`}
              >
                {copied ? <><Check className="w-4 h-4 mr-2" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy Name</>}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeagueOfLegendsRoleGenerator;