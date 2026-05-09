/**
 * Local-first symbol library for /nickname-symbols — no server dependency.
 * Glyphs are curated for gaming/social use (readable, copy-safe BMP-heavy).
 */
import { nicknameSymbols } from '@/utils/textStyleConverter.js';

export const SYMBOL_CATEGORIES = ['All', 'Competitive', 'Decorative', 'Discord', 'Combos'];

const CP = 'Competitive';
const DC = 'Decorative';
const DS = 'Discord';

/** Single-character copy targets with stable ids for list keys / analytics. */
export const CURATED_GLYPHS = [
  // Competitive — brackets, rank cues, sweat-adjacent marks
  { id: 'cg-c01', category: CP, char: '★', label: 'Star' },
  { id: 'cg-c02', category: CP, char: '☆', label: 'Outline star' },
  { id: 'cg-c03', category: CP, char: '✦', label: 'Spark diamond' },
  { id: 'cg-c04', category: CP, char: '✧', label: 'Spark outline' },
  { id: 'cg-c05', category: CP, char: '✪', label: 'Circled star' },
  { id: 'cg-c06', category: CP, char: '⌖', label: 'Target' },
  { id: 'cg-c07', category: CP, char: '⚔', label: 'Crossed swords' },
  { id: 'cg-c08', category: CP, char: '⚡', label: 'Bolt' },
  { id: 'cg-c09', category: CP, char: '⚙', label: 'Gear' },
  { id: 'cg-c10', category: CP, char: '⚜', label: 'Fleur' },
  { id: 'cg-c11', category: CP, char: '♔', label: 'White king' },
  { id: 'cg-c12', category: CP, char: '♕', label: 'White queen' },
  { id: 'cg-c13', category: CP, char: '♚', label: 'Black king' },
  { id: 'cg-c14', category: CP, char: '♛', label: 'Black queen' },
  { id: 'cg-c15', category: CP, char: '「', label: 'Corner open' },
  { id: 'cg-c16', category: CP, char: '」', label: 'Corner close' },
  { id: 'cg-c17', category: CP, char: '『', label: 'White corner o' },
  { id: 'cg-c18', category: CP, char: '』', label: 'White corner c' },
  { id: 'cg-c19', category: CP, char: '【', label: 'Black lenticular o' },
  { id: 'cg-c20', category: CP, char: '】', label: 'Black lenticular c' },
  { id: 'cg-c21', category: CP, char: '〖', label: 'White lenticular o' },
  { id: 'cg-c22', category: CP, char: '〗', label: 'White lenticular c' },
  { id: 'cg-c23', category: CP, char: '《', label: 'Double angle o' },
  { id: 'cg-c24', category: CP, char: '》', label: 'Double angle c' },
  { id: 'cg-c25', category: CP, char: '〔', label: 'Tortoise o' },
  { id: 'cg-c26', category: CP, char: '〕', label: 'Tortoise c' },
  { id: 'cg-c27', category: CP, char: '〘', label: 'White tortoise o' },
  { id: 'cg-c28', category: CP, char: '〙', label: 'White tortoise c' },
  { id: 'cg-c29', category: CP, char: '༺', label: 'Wing o' },
  { id: 'cg-c30', category: CP, char: '༻', label: 'Wing c' },
  { id: 'cg-c31', category: CP, char: '꧁', label: 'Ornate o' },
  { id: 'cg-c32', category: CP, char: '꧂', label: 'Ornate c' },
  { id: 'cg-c33', category: CP, char: '⟨', label: 'Math angle o' },
  { id: 'cg-c34', category: CP, char: '⟩', label: 'Math angle c' },
  { id: 'cg-c35', category: CP, char: '►', label: 'Pointer R' },
  { id: 'cg-c36', category: CP, char: '◄', label: 'Pointer L' },
  { id: 'cg-c37', category: CP, char: '▸', label: 'Triangle R' },
  { id: 'cg-c38', category: CP, char: '◂', label: 'Triangle L' },

  // Decorative — dividers, flourishes, density without emoji spam
  { id: 'cg-d01', category: DC, char: '❀', label: 'Flower outline' },
  { id: 'cg-d02', category: DC, char: '✿', label: 'Flower filled' },
  { id: 'cg-d03', category: DC, char: '❁', label: 'Flower alt' },
  { id: 'cg-d04', category: DC, char: '✾', label: 'Flower dot' },
  { id: 'cg-d05', category: DC, char: '❃', label: 'Flower snow' },
  { id: 'cg-d06', category: DC, char: '✽', label: 'Spark flower' },
  { id: 'cg-d07', category: DC, char: '✻', label: 'Teardrop flower' },
  { id: 'cg-d08', category: DC, char: '❋', label: 'Cross flower' },
  { id: 'cg-d09', category: DC, char: '✤', label: 'Spark cross' },
  { id: 'cg-d10', category: DC, char: '✥', label: 'Spark plus' },
  { id: 'cg-d11', category: DC, char: '⌘', label: 'Cmd / knot' },
  { id: 'cg-d12', category: DC, char: '∞', label: 'Infinity' },
  { id: 'cg-d13', category: DC, char: '♪', label: 'Note' },
  { id: 'cg-d14', category: DC, char: '♫', label: 'Notes' },
  { id: 'cg-d15', category: DC, char: '✎', label: 'Pencil' },
  { id: 'cg-d16', category: DC, char: '☄', label: 'Comet' },
  { id: 'cg-d17', category: DC, char: '❅', label: 'Snowflake' },
  { id: 'cg-d18', category: DC, char: '‧', label: 'Dot sep' },
  { id: 'cg-d19', category: DC, char: '～', label: 'Wave full' },
  { id: 'cg-d20', category: DC, char: '〜', label: 'Wave JP' },
  { id: 'cg-d21', category: DC, char: '─', label: 'Light rule' },
  { id: 'cg-d22', category: DC, char: '━', label: 'Heavy rule' },
  { id: 'cg-d23', category: DC, char: '│', label: 'Vert light' },
  { id: 'cg-d24', category: DC, char: '┆', label: 'Vert broken' },
  { id: 'cg-d25', category: DC, char: '╭', label: 'Arc NW' },
  { id: 'cg-d26', category: DC, char: '╮', label: 'Arc NE' },
  { id: 'cg-d27', category: DC, char: '╰', label: 'Arc SW' },
  { id: 'cg-d28', category: DC, char: '╯', label: 'Arc SE' },
  { id: 'cg-d29', category: DC, char: '═', label: 'Double horiz' },
  { id: 'cg-d30', category: DC, char: '║', label: 'Double vert' },
  { id: 'cg-d31', category: DC, char: '░', label: 'Shade light' },
  { id: 'cg-d32', category: DC, char: '▒', label: 'Shade mid' },
  { id: 'cg-d33', category: DC, char: '▓', label: 'Shade dark' },
  { id: 'cg-d34', category: DC, char: '◇', label: 'Diamond hollow' },
  { id: 'cg-d35', category: DC, char: '◆', label: 'Diamond filled' },
  { id: 'cg-d36', category: DC, char: '○', label: 'Circle hollow' },
  { id: 'cg-d37', category: DC, char: '●', label: 'Circle filled' },
  { id: 'cg-d38', category: DC, char: '◎', label: 'Circle double' },

  // Discord / social bios — soft + readable
  { id: 'cg-s01', category: DS, char: '♡', label: 'Heart outline' },
  { id: 'cg-s02', category: DS, char: '♥', label: 'Heart suit' },
  { id: 'cg-s03', category: DS, char: '❤', label: 'Heart red' },
  { id: 'cg-s04', category: DS, char: '☾', label: 'Moon L' },
  { id: 'cg-s05', category: DS, char: '☽', label: 'Moon R' },
  { id: 'cg-s06', category: DS, char: '✶', label: 'Spark alt' },
  { id: 'cg-s07', category: DS, char: '⋆', label: 'Star dot' },
  { id: 'cg-s08', category: DS, char: '˖', label: 'Dot accent' },
  { id: 'cg-s09', category: DS, char: '◦', label: 'Bullet hollow' },
  { id: 'cg-s10', category: DS, char: '‧', label: 'Sep dot' },
  { id: 'cg-s11', category: DS, char: '・', label: 'Mid dot JP' },
  { id: 'cg-s12', category: DS, char: '•', label: 'Bullet' },
  { id: 'cg-s13', category: DS, char: '◐', label: 'Half L' },
  { id: 'cg-s14', category: DS, char: '◑', label: 'Half R' },
  { id: 'cg-s15', category: DS, char: '☁', label: 'Cloud' },
  { id: 'cg-s16', category: DS, char: '☀', label: 'Sun' },
  { id: 'cg-s17', category: DS, char: '☂', label: 'Umbrella' },
  { id: 'cg-s18', category: DS, char: '☃', label: 'Snowman' },
  { id: 'cg-s19', category: DS, char: '✔', label: 'Check' },
  { id: 'cg-s20', category: DS, char: '✘', label: 'Cross' },
  { id: 'cg-s21', category: DS, char: '✝', label: 'Cross latin' },
  { id: 'cg-s22', category: DS, char: '☯', label: 'Yin yang' },
  { id: 'cg-s23', category: DS, char: '☮', label: 'Peace' },
  { id: 'cg-s24', category: DS, char: '✵', label: 'Spark pent' },
  { id: 'cg-s25', category: DS, char: '（', label: 'Paren FW o' },
  { id: 'cg-s26', category: DS, char: '）', label: 'Paren FW c' },
  { id: 'cg-s27', category: DS, char: '〝', label: 'Quote low o' },
  { id: 'cg-s28', category: DS, char: '〞', label: 'Quote low c' },
  { id: 'cg-s29', category: DS, char: '⋯', label: 'Ellipsis mid' },
  { id: 'cg-s30', category: DS, char: '～', label: 'Tilde wave' },
  { id: 'cg-s31', category: DS, char: '✨', label: 'Sparkles' },
  { id: 'cg-s32', category: DS, char: '🌙', label: 'Crescent' },
  { id: 'cg-s33', category: DS, char: '₊', label: 'Plus sub' },
  { id: 'cg-s34', category: DS, char: '˚', label: 'Ring accent' },
  { id: 'cg-s35', category: DS, char: '｡', label: 'Dot JP' },
  { id: 'cg-s36', category: DS, char: '⸻', label: 'Long dash' },
  { id: 'cg-s37', category: DS, char: '﹏', label: 'Wavy underline' },
  { id: 'cg-s38', category: DS, char: '╳', label: 'Cross mark' }
];

/**
 * Wrapper patterns from shared `nicknameSymbols` — preview updates with tag.
 */
export function buildComboRows(previewTag) {
  const tag = previewTag?.trim?.() || 'tag';
  return nicknameSymbols.map((s) => ({
    id: s.id,
    name: s.name,
    pattern: s.pattern,
    copyText: s.pattern.replace(/\{name\}/g, tag),
    preview: s.pattern.replace(/\{name\}/g, tag)
  }));
}

export function filterGlyphs(category) {
  if (category === 'Combos') return [];

  let list = CURATED_GLYPHS;
  if (category && category !== 'All') {
    list = CURATED_GLYPHS.filter((g) => g.category === category);
  }
  if (category !== 'All') return list;

  const seen = new Set();
  return list.filter((g) => {
    if (seen.has(g.char)) return false;
    seen.add(g.char);
    return true;
  });
}
