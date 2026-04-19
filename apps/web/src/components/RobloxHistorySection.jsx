import React, { useState } from 'react';
import { ChevronDown, ChevronUp, History, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RobloxHistorySection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const timeline = [
    {
      period: "Fundación (2004-2005)",
      title: "Los Inicios: DynaBlocks",
      content: "Roblox fue creado por David Baszucki y Erik Cassel en 2004 bajo el nombre inicial de DynaBlocks. En 2005, la compañía cambió su nombre a Roblox, un acrónimo de 'robots' y 'blocks'. Los primeros nombres de usuario eran muy simples, a menudo solo el nombre real del jugador o apodos básicos sin números ni símbolos.",
      icon: History
    },
    {
      period: "Crecimiento (2006-2010)",
      title: "Lanzamiento Oficial y Primeros Juegos",
      content: "Roblox se lanzó oficialmente al público en 2006. Durante esta época, se introdujeron los Roblox Badges y el sistema de chat. Los nombres de usuario comenzaron a incluir números (ej. Player123) a medida que la base de jugadores crecía y los nombres simples se agotaban. Surgieron los primeros clanes y grupos.",
      icon: Users
    },
    {
      period: "Expansión (2011-2015)",
      title: "La Era de los Desarrolladores",
      content: "Con la introducción de Developer Exchange (DevEx) en 2013, los creadores pudieron empezar a ganar dinero real. Los juegos se volvieron más complejos. La tendencia en nombres cambió hacia identidades más 'gamer' y 'edgy', con el uso frecuente de 'xX_Name_Xx' y referencias a la cultura pop.",
      icon: Sparkles
    },
    {
      period: "Boom (2016-2020)",
      title: "Explosión Global y Avatares Rthro",
      content: "Roblox experimentó un crecimiento masivo, especialmente durante 2020. Se introdujeron los avatares Rthro. La cultura de los nombres se diversificó enormemente: surgieron los nombres 'Aesthetic' (minúsculas, palabras suaves), nombres 'Tryhard' para juegos competitivos como Arsenal, y nombres de Roleplay para juegos como Adopt Me!.",
      icon: Users
    },
    {
      period: "Actualidad (2021-2026)",
      title: "El Metaverso y Nombres de Visualización",
      content: "Roblox salió a bolsa en 2021. Una de las actualizaciones más importantes para la identidad fue la introducción de los 'Display Names' (Nombres de Visualización), permitiendo a los jugadores cambiar cómo se ven en el juego sin cambiar su nombre de usuario original (@username). Esto llevó a una explosión de nombres creativos, uso de símbolos y nombres cortos que antes eran imposibles de conseguir.",
      icon: Sparkles
    }
  ];

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-refined">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <History className="w-6 h-6 text-primary" /> Historia y Evolución de Nombres en Roblox
        </h2>
        <p className="text-foreground/60 mt-2">Cómo ha cambiado la identidad de los jugadores a lo largo de los años.</p>
      </div>

      <div className="space-y-4">
        {timeline.map((item, index) => (
          <div key={index} className="border border-border/50 rounded-xl overflow-hidden bg-background">
            <button
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${openIndex === index ? 'bg-primary text-black' : 'bg-card text-primary border border-border/50'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.period}</span>
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                </div>
              </div>
              {openIndex === index ? <ChevronUp className="w-5 h-5 text-foreground/50" /> : <ChevronDown className="w-5 h-5 text-foreground/50" />}
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-0 text-foreground/80 leading-relaxed border-t border-border/30 mt-2">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RobloxHistorySection;