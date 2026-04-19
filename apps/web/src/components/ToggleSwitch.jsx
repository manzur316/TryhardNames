import React from 'react';
import { Switch } from '@/components/ui/switch.jsx';
import { Label } from '@/components/ui/label.jsx';

const ToggleSwitch = ({ id, label, checked, onCheckedChange, icon: Icon }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors duration-300">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <Label 
          htmlFor={id} 
          className="text-foreground font-medium cursor-pointer text-base"
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