import React from 'react';
import { Switch } from '@/components/ui/switch.jsx';
import { Label } from '@/components/ui/label.jsx';

const ToggleSwitch = ({ id, label, checked, onCheckedChange, icon: Icon }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/95 bg-slate-50/90 hover:border-slate-300 dark:border-dark-600/80 dark:bg-dark-900/90 dark:hover:border-cyan-400/25 transition-colors duration-300">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
        <Label 
          htmlFor={id} 
          className="text-slate-800 dark:text-dark-100 font-medium cursor-pointer text-base"
        >
          {label}
        </Label>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
};

export default ToggleSwitch;