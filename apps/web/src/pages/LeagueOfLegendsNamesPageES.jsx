import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Crosshair, Zap, Target, Heart, Trophy, Flame, Hash, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CopyButton from '@/components/CopyButton.jsx';
import AdPlaceholderZone from '@/components/AdPlaceholderZone.jsx';

const LeagueOfLegendsNamesPageES = () => {
  const roles = [
    {
      title: 'Top Lane (Tanque/Bruiser)',
      icon: Shield,
      color: 'text-[#0A8CC9]',
      bg: 'bg-[#0A8CC9]/10',
      border: 'border-[#0A8CC9]/30',
      names: ['MaestroTop', 'TitánFuerza', 'BruiserRey', 'MaestroTanque', 'VanguardiaElite', 'MuroAcero', 'DefensaElite', 'BarreraLord', 'PortadorEscudo', 'ArmorRey', 'TipoRudo', 'PielAcero', 'CorazónAcero', 'SólidoRoca', 'MuroInquebrantable', 'TanqueDios', 'DefensaDios', 'ProtectorPro', 'FuerzaGuardián', 'ReyVigía']
    },
    {
      title: 'Jungle (Enfoque Gank)',
      icon: Target,
      color: 'text-[#5B2C6F]',
      bg: 'bg-[#5B2C6F]/10',
      border: 'border-[#5B2C6F]/30',
      names: ['MaestroGank', 'DepredarJungle', 'CazadorSombra', 'Explorador Pro', 'ReyLimpieza', 'LordGank', 'FuerzaDepredador', 'EliteHunter', 'AsesinoSombra', 'AcechadorNocturno', 'DioJungle', 'DiosGank', 'DiosLimpieza', 'DiosExplorador', 'ReySombra', 'ProAsesino', 'ReyHunter', 'ReyDepredador', 'ProAcechador', 'CazadorNocturno']
    },
    {
      title: 'Mid Lane (Mago/Asesino)',
      icon: Zap,
      color: 'text-[#C89B3C]',
      bg: 'bg-[#C89B3C]/10',
      border: 'border-[#C89B3C]/30',
      names: ['MaestroMago', 'ReyAsesino', 'MaestroHechizo', 'FuerzaMística', 'EliteArcana', 'LanzadorHechizo', 'DiosMago', 'DiosAsesino', 'DiosHechizo', 'DiosMístico', 'DiosArcano', 'MaestroMagia', 'LanzadorHechizo', 'MaestroMístico', 'MaestroArcano', 'ReyMago', 'MaestroAsesino', 'ReyHechizo', 'ReyMístico', 'ReyArcano']
    },
    {
      title: 'ADC (Carry)',
      icon: Crosshair,
      color: 'text-[#0A8CC9]',
      bg: 'bg-[#0A8CC9]/10',
      border: 'border-[#0A8CC9]/30',
      names: ['ReyCarga', 'TiradorDaño', 'MaestroADC', 'MaestroTirador', 'GolpeCrítico', 'DiosDaño', 'DiosCarga', 'DiosADC', 'DiosTirador', 'DiosCrítico', 'MaestroCarga', 'MaestroDaño', 'MaestroTirador', 'MaestroCrítico', 'ProCarga', 'ProDaño', 'ProTirador', 'ProCrítico', 'EliteCarga', 'EliteDaño']
    },
    {
      title: 'Soporte (Utilidad)',
      icon: Heart,
      color: 'text-[#5B2C6F]',
      bg: 'bg-[#5B2C6F]/10',
      border: 'border-[#5B2C6F]/30',
      names: ['ReySoporte', 'ProtectorPro', 'MaestroUtilidad', 'ReyHealador', 'MaestroEscudo', 'DiosSoporte', 'DiosProtector', 'DiosUtilidad', 'DiosHealador', 'DiosEscudo', 'MaestroSoporte', 'MaestroProtector', 'ProUtilidad', 'ProHealador', 'ProEscudo', 'ProSoporte', 'EliteProtector', 'EliteUtilidad', 'EliteHealador', 'EliteEscudo']
    }
  ];

  const tiers = [
    {
      title: 'Nivel Challenger',
      icon: Trophy,
      color: 'text-[#C89B3C]',
      names: ['MaestroChallenger', 'ReyChallenger', 'DiosChallenger', 'EliteChallenger', 'FuerzaChallenger', 'MaestroChallenger', 'LordChallenger', 'TitánChallenger', 'FénixChallenger', 'DragónChallenger', 'VenenoChallenger', 'NemesisChallenger', 'VórticeChallenger', 'InfernoChallenger', 'NovaChallengerr']
    },
    {
      title: 'Nivel Diamond',
      icon: Trophy,
      color: 'text-[#0A8CC9]',
      names: ['MaestroDiamond', 'ReyDiamond', 'DiosDiamond', 'EliteDiamond', 'FuerzaDiamond', 'MaestroDiamond', 'LordDiamond', 'TitánDiamond', 'FénixDiamond', 'DragónDiamond', 'VenenoDiamond', 'NemesisDiamond', 'VórtriceDiamond', 'InfernoDiamond', 'NovaDiamond']
    },
    {
      title: 'Cuentas Smurf',
      icon: Shield,
      color: 'text-[#5B2C6F]',
      names: ['ReySmurf', 'PoderOculto', 'AsesinoSilencioso', 'EncubiertoPro', 'ProDisfrazado', 'FuerzaSecreta', 'FuerzaOculta', 'FuerzaSilenciosa', 'ProEncubierto', 'ReyDisfrazado', 'ReySecreto', 'ReyOculto', 'ReySilencioso', 'ReyEncubierto', 'FuerzaDisfrazada']
    }
  ];

  const toxicNames = ['MaestroTóxico', 'ReyRabia', 'MaestroTilt', 'GuerrerLlama', 'LordSal', 'FuerzaTóxica', 'FuerzaRabia', 'FuerzaTilt', 'FuerzaLlama', 'FuerzaSal', 'DiosTóxico', 'DiosRabia', 'DiosTilt', 'DiosLlama', 'DiosSal', 'ProTóxico', 'ProRabia', 'ProTilt', 'ProLlama', 'ProSal'];
  
  const shortTags = ['LOL', 'LGD', 'FNC', 'G2', 'T1', 'DWG', 'EDG', 'JDG', 'HLE', 'DRX', 'GEN', 'KT', 'AF', 'NS', 'BRO', 'LSB', 'KDF', 'DK', 'SB', 'HM', 'FOX', 'GRF', 'JAG', 'KZ', 'MVP', 'ROX', 'SKT', 'SSW', 'SSB', 'CJ', 'IM', 'NJ', 'OMG', 'IG', 'RNG', 'WE'];

  const faqs = [
    { q: '¿Qué hace que un nombre tryhard sea bueno en League of Legends?', a: 'Un buen nombre tryhard en LoL suele ser corto, memorable e intimidante. A menudo refleja tu rol principal, tu pool de campeones o tu estilo de juego, utilizando un formato limpio sin números ni símbolos excesivos.' },
    { q: '¿Puedo cambiar mi nombre en League of Legends?', a: 'Sí, puedes cambiar tu Riot ID (que sirve como tu nombre en League of Legends) de forma gratuita cada 90 días a través de la página de gestión de tu cuenta de Riot.' },
    { q: '¿Hay restricciones de nombres en League of Legends?', a: 'Sí, los nombres deben tener entre 3 y 16 caracteres. No pueden contener lenguaje ofensivo, discursos de odio ni suplantar a empleados de Riot o profesionales de los esports.' },
    { q: '¿Cuáles son los mejores nombres para cada rol?', a: 'Los Top laners suelen usar nombres imponentes y de tanques (Titán, Acero). Los Junglers prefieren nombres sigilosos o depredadores (Sombra, Cazador). Los Mid laners se inclinan por temas mágicos o de asesinos (Arcano, Místico). Los ADCs usan nombres enfocados en el daño (Carry, Crítico), y los Soportes usan nombres protectores (Escudo, Guardián).' },
    { q: '¿Cómo obtengo un nombre de nivel Challenger?', a: 'Los nombres de nivel Challenger suelen ser muy limpios, a menudo de una sola palabra, sin números ni caracteres especiales. Transmiten confianza y simplicidad.' },
    { q: '¿Qué son los nombres de cuentas smurf?', a: 'Los nombres smurf son utilizados por jugadores de alto rango en cuentas alternativas de menor rango. A menudo presentan nombres irónicos, ocultos o estilo código de barras para ocultar su verdadera identidad.' },
    { q: '¿Puedo usar caracteres especiales en mi nombre de LoL?', a: 'Los Riot IDs admiten una amplia gama de caracteres Unicode, dependiendo de tu región. Sin embargo, se recomienda mantener caracteres alfanuméricos estándar para un aspecto "tryhard" más limpio.' },
    { q: '¿Con qué frecuencia puedo cambiar mi nombre en League?', a: 'Puedes cambiar tu Riot ID gratis una vez cada 90 días.' },
    { q: '¿Cuáles son los nombres de LoL más populares?', a: 'Los nombres populares a menudo imitan a jugadores profesionales, usan referencias de anime o combinan un adjetivo genial con un rol o nombre de campeón.' },
    { q: '¿Cómo hago que mi nombre destaque?', a: 'Para destacar, evita los clichés comunes como agregar "xX" o años de nacimiento. Opta por un apodo único de una sola palabra o una combinación inteligente de dos palabras que refleje tu personalidad gamer.' }
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
      <Helmet htmlAttributes={{ lang: 'es' }}>
        <title>Nombres Tryhard para League of Legends – Nombres Pro y Competitivos 2026</title>
        <meta name="description" content="Genera los mejores nombres tryhard para League of Legends por rol (Top, Jungle, Mid, ADC, Soporte). Nombres Challenger, Diamond y smurf incluidos." />
        <link rel="canonical" href="https://tryhardnames.com/es/nombres-lol-tryhard" />
        <link rel="alternate" hrefLang="es" href="https://tryhardnames.com/es/nombres-lol-tryhard" />
        <link rel="alternate" hrefLang="en" href="https://tryhardnames.com/league-of-legends-tryhard-names" />
        <link rel="alternate" hrefLang="x-default" href="https://tryhardnames.com/" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground selection:bg-[#C89B3C]/30">
        <Header />

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
                Nombres Tryhard <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A8CC9] via-[#C89B3C] to-[#5B2C6F]">
                  League of Legends
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto font-medium leading-relaxed">
                Domina la Grieta con los nombres más intimidantes, competitivos y profesionales de League of Legends para cada rol y rango.
              </p>
            </motion.div>
          </div>
        </section>

        <AdPlaceholderZone position="top" />

        {/* Role-Based Names */}
        <section className="py-20 bg-card/30 border-y border-border/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Mejores Nombres por <span className="text-[#C89B3C]">Rol</span></h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">Encuentra el apodo perfecto que coincida con tu estilo de juego y dominio en la línea.</p>
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
              <h2 className="text-3xl md:text-5xl font-black mb-4">Nombres Tryhard por <span className="text-[#0A8CC9]">Tier de Rango</span></h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">Nombres que infunden miedo en los corazones de tus oponentes en solo queue.</p>
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
                  <h2 className="text-3xl font-black">Nombres Tóxicos y Edgy</h2>
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
                  <h2 className="text-3xl font-black">Etiquetas Cortas de LoL</h2>
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
            <h2 className="text-3xl font-black text-[#C89B3C] mb-6">Por qué los nombres tryhard de League of Legends importan</h2>
            <p>En el entorno altamente competitivo de League of Legends, tu nombre de invocador (ahora Riot ID) es tu primera impresión. Un nombre tryhard señala a tus compañeros de equipo y oponentes que te tomas el juego en serio, entiendes el meta y estás aquí para ganar. Establece un tono psicológico antes de que los súbditos siquiera aparezcan. Ya sea que estés subiendo desde Plata o empujando hacia Challenger, un nombre limpio e intimidante puede darte una sutil ventaja mental.</p>

            <h2 className="text-3xl font-black text-[#0A8CC9] mt-12 mb-6">Mejores nombres tryhard de League of Legends por rol</h2>
            <p>Cada rol en League of Legends tiene su propia identidad y estilo de juego distintos, y tu nombre debe reflejar eso. Los <strong>Top laners</strong> a menudo eligen nombres que transmiten fuerza y resistencia inquebrantables, actuando como el objeto inamovible para su equipo. Los <strong>Junglers</strong> se benefician de nombres que implican sigilo, depredación y control del mapa, infundiendo miedo en los enemigos sobreextendidos. Los <strong>Mid laners</strong>, a menudo los carries estrella, se inclinan por nombres que destacan la destreza mágica o las habilidades letales de asesinato. Los <strong>ADCs</strong> necesitan nombres que griten alto daño y perfección mecánica, mientras que los <strong>Soportes</strong> utilizan nombres que enfatizan la utilidad, la protección y el control de visión.</p>

            <h2 className="text-3xl font-black text-[#5B2C6F] mt-12 mb-6">Nombres tryhard por tier de rango</h2>
            <p>A medida que subes en la escalera clasificatoria, las convenciones de nombres cambian. En elos más bajos, es posible que veas nombres más largos y complejos. Sin embargo, a medida que te acercas a Diamante, Maestro y Challenger, los nombres se vuelven más cortos, limpios y abstractos. Un verdadero nombre tryhard de Challenger es a menudo una sola palabra, escrita correctamente, sin números ni caracteres especiales. Las cuentas smurf, por otro lado, a menudo usan nombres de código de barras (como lIllIlII) o nombres irónicos y discretos para ocultar su verdadero nivel de habilidad hasta que cargan en la Grieta.</p>

            <h2 className="text-3xl font-black text-red-500 mt-12 mb-6">Nombres tóxicos y edgy de League</h2>
            <p>Si bien siempre fomentamos un juego positivo, la realidad de los juegos competitivos es que algunos jugadores prefieren una estética atrevida o "tóxica". Estos nombres están diseñados para tiltear a los oponentes y establecer dominio a través de la pura intimidación. Las palabras asociadas con la rabia, la sal y la oscuridad son comunes aquí. ¡Úsalos bajo tu propio riesgo, ya que podrían convertirte en un objetivo para los ganks del jungla enemigo!</p>

            <h2 className="text-3xl font-black text-[#C89B3C] mt-12 mb-6">Etiquetas cortas de LoL para clanes y equipos</h2>
            <p>Si juegas Clash o formas un equipo competitivo, tener una etiqueta reconocible de 3-4 letras es esencial. Inspirándose en organizaciones profesionales de esports (como T1, G2 o FNC), una etiqueta fuerte unifica a tu equipo y se ve increíblemente profesional en la pantalla de carga. Combina estas etiquetas con tu nombre tryhard para la estética competitiva definitiva.</p>

            <h2 className="text-3xl font-black text-foreground mt-12 mb-6">Cómo elegir el nombre tryhard perfecto para League of Legends</h2>
            <p>Elegir el nombre perfecto requiere equilibrar la singularidad con la simplicidad. Comienza identificando tu campeón o rol principal. Extrae temas centrales (por ejemplo, sombras para Zed, hielo para Ashe). Evita usar tu nombre real o año de nacimiento. Mantenlo por debajo de 10 caracteres si es posible. Los mejores nombres tryhard son fáciles de pronunciar, lo que los hace perfectos para las comunicaciones de voz y posibles narraciones de esports.</p>

            <h2 className="text-3xl font-black text-foreground mt-12 mb-6">Consejos y trucos para nombres de League of Legends</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Mantenlo limpio:</strong> Evita números excesivos (por ejemplo, Shadow99) o el formato Xx_.</li>
              <li><strong>Usa las mayúsculas sabiamente:</strong> CamelCase (por ejemplo, ShadowHunter) es aceptable, pero todo en minúsculas (por ejemplo, shadowhunter) a menudo se ve más "tryhard" en elo alto.</li>
              <li><strong>Verifica la disponibilidad:</strong> Con la transición a Riot IDs, puedes tener el mismo nombre que otra persona, diferenciado por el hashtag (por ejemplo, Nombre#LAS1). ¡Esto hace que conseguir el nombre de tus sueños sea mucho más fácil!</li>
            </ul>

            <h2 className="text-3xl font-black text-foreground mt-12 mb-6">Nombres de League tendencia 2026</h2>
            <p>En 2026, la tendencia se mueve fuertemente hacia conceptos minimalistas de una sola palabra. Los sustantivos abstractos, las referencias mitológicas y los guiños sutiles a la mecánica del juego son muy buscados. Los jugadores se están alejando de los nombres específicos de campeones (como "YasuoGod") a favor de apodos más amplios y versátiles que siguen siendo relevantes incluso si el meta cambia.</p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-card/30 border-t border-border/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Preguntas <span className="text-[#0A8CC9]">Frecuentes</span></h2>
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
            <h3 className="text-xl font-bold mb-6 text-foreground/60 uppercase tracking-wider">Explora Más Herramientas</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/es/generador-texto-estilizado" className="px-6 py-3 bg-card border border-border/50 rounded-full hover:border-primary hover:text-primary transition-colors">Texto Estilizado</Link>
              <Link to="/es/generador-nombres-clan" className="px-6 py-3 bg-card border border-border/50 rounded-full hover:border-primary hover:text-primary transition-colors">Nombres de Clan</Link>
              <Link to="/es/generador-biografia-gamer" className="px-6 py-3 bg-card border border-border/50 rounded-full hover:border-primary hover:text-primary transition-colors">Biografías Gamer</Link>
              <Link to="/es/valorant" className="px-6 py-3 bg-card border border-border/50 rounded-full hover:border-primary hover:text-primary transition-colors">Nombres Valorant</Link>
              <Link to="/es/free-fire" className="px-6 py-3 bg-card border border-border/50 rounded-full hover:border-primary hover:text-primary transition-colors">Nombres Free Fire</Link>
            </div>
          </div>
        </section>

        <AdPlaceholderZone position="bottom" />
        <Footer />
      </div>
    </>
  );
};

export default LeagueOfLegendsNamesPageES;