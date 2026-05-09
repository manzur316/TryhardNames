# Gobernanza de atmósfera localizada (“localized atmosphere governance”)

**Principio oficial:** *Controlled emotional atmosphere.* — energía emocional **intencional**, en **focos**, no ruido global.

**Dirección visual consolidada:** **curated prestige gaming atmosphere**  
(no minimalismo editorial frío; no RGB gaming SaaS).

Fuente en código: `src/governance/localizedAtmosphere.js`  
Convive con: `src/governance/experienceTiers.js` y `EXPERIENCE_STRATIFICATION.md`.

---

## 1. Lectura estratégica (post-sprint atmosférico)

Lo que funcionó del sprint:

- Recuperó magnetismo, profundidad, foco lumínico y sensación **premium / gaming-aware**.
- **No** rompió governance, jerarquía, typography-first ni framing cultural.

La lección del sistema viejo:

- El fallo **no** fue “tener glow”.
- El fallo fue tener glow **en toda la UI a la vez**.

Por tanto: **la energía debe estar localizada**.

---

## 2. Bandas de atmósfera (emotional energy budget)

| Banda | Rol | Sensación objetivo |
|--------|-----|---------------------|
| **Aspirational gateway** | Puerta emocional (home hero, CTAs principales) | Más aspiración, lighting y fantasy prestige — **un foco primario** |
| **Programmatic depth** | Shells SEO, grids, trending como descubrimiento | Profundidad y lectura; **sin** competir con el hero |
| **Premium calm** | KR lane, Identity Kit, capas editoriales “identity” | Calma, restraint, prestige silencioso |
| **Utility clear** | Herramientas densas (símbolos, stylish text, toggles) | Claridad; feedback micro, sin capas decorativas |

**Tier de experiencia** (TOOL / HYBRID / IDENTITY) y **banda atmosférica** no son lo mismo: el tier gobierna gramática y producto; la banda gobierna **cuánta** luz/motion puede tener la superficie.

---

## 3. Glow — qué sí / qué no

### Puede existir glow (con moderación)

- **Hero / gateway:** un stack focal (blooms + viñeta), más luminancia en **CTAs aspiracionales**.
- **Shell programático:** profundidad de página (radiales suaves + viñeta), **no** animación en cada bloque.
- **Tarjetas puntuales:** un borde/luz de acento **por cluster**, no en todas las cards a la vez.

### No debe existir

- Glow animado en **todo el viewport**.
- Varios focos de igual intensidad **en el mismo viewport** (hero + grid + nav + footer “encendidos”).
- Bordes gradiente RGB en masa.

Detalle por banda: ver `GLOW_GOVERNANCE` en `localizedAtmosphere.js`.

---

## 4. Motion — dónde sí / dónde silencio

| Zona | Permitido |
|------|-----------|
| **Gateway** | Deriva lenta de **opacidad** en una sola capa decorativa; transiciones CSS en hover |
| **Programático** | Transiciones en controles; evitar coreografías largas en scroll |
| **Premium calm** | Casi estático; sin loops ambientales |
| **Utility** | Micro-feedback (copiar, toggle) |

Siempre respetar **`prefers-reduced-motion`**.

Detalle: `MOTION_GOVERNANCE` en código.

---

## 5. CTAs — aspiracional vs funcional

- **Aspiracional:** entrada emocional del ecosistema (ej. explorar samples, hubs) — puede llevar el **máximo** de luminancia permitida para esa página, **sin** duplicar el mismo tratamiento en cinco botones seguidos.
- **Supporting:** secundarios — un punto menos de sombra/borde.
- **Functional:** utilidad pura — sin prestige glow.

---

## 6. Matriz surfaces (resumen)

| Superficie | Banda típica | Nota |
|------------|----------------|------|
| **Home** (hero + puerta) | Aspirational gateway | Aquí vive la mayor emoción permitida |
| **Home** (trending, bloques inferiores) | Programmatic depth | Profundidad secundaria; no competir con el hero |
| **SeoTemplate** / URLs `/:cat/:kw` | Programmatic depth | Shell con profundidad; cards con mesura |
| **KR lane** | Premium calm | Restraint; sin carnaval |
| **Identity Kit** | Premium calm | Tipografía y artefacto primero |
| **Topic hubs / LoL hub** | Programmatic depth | Editorial + enlaces; sin RGB |
| **Generators utility** (stylish, symbols, bio) | Utility clear | Ligero y gobernable |

---

## 7. Qué tecnología sigue prohibida (sin cambios)

- Three.js, shaders fullscreen, sistemas de partículas, librerías de animación masivas.
- La atmósfera viene de **color, profundidad, contraste, lighting, ritmo, layering** — implementación **CSS-first**.

---

## 8. Test final de coherencia

El usuario debe percibir:

> “Premium, gaming-aware, emocionalmente atractivo”

sin percibir:

> “Otro sitio gaming RGB genérico”.

---

## 9. Rollback de dirección (no técnico)

Si una iteración futura **sube** energía en superficies **premium calm** o **globaliza** glow: **revertir** esa PR — la regla es **localización intencional**, no más capas por defecto.
