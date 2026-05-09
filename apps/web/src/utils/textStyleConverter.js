/**
 * Comprehensive Text Style Converter Utility
 * Contains 70+ Unicode text transformations and utility functions.
 */

// --- Helper Functions for Character Mapping ---

const createMap = (lower, upper, nums = '0123456789') => {
  const map = {};
  const ALPHABET_LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const ALPHABET_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const NUMBERS = '0123456789';
  
  // Use Array.from to correctly handle surrogate pairs in Unicode strings
  const lowerArr = Array.from(lower);
  const upperArr = Array.from(upper);
  const numsArr = Array.from(nums);
  
  for (let i = 0; i < 26; i++) {
    map[ALPHABET_LOWER[i]] = lowerArr[i] || ALPHABET_LOWER[i];
    map[ALPHABET_UPPER[i]] = upperArr[i] || ALPHABET_UPPER[i];
  }
  for (let i = 0; i < 10; i++) {
    map[NUMBERS[i]] = numsArr[i] || NUMBERS[i];
  }
  return map;
};

/**
 * Maps each character using the correct Unicode values.
 * Uses Array.from to prevent breaking surrogate pairs.
 */
export const transformWithMap = (text, map) => {
  return Array.from(text).map(char => map[char] || char).join('');
};

const applyCombiningMark = (text, mark) => Array.from(text).map(char => char !== ' ' ? char + mark : char).join('');

const applySeparator = (text, separator) => Array.from(text).join(separator);

const applyWrapper = (text, prefix, suffix = prefix) => Array.from(text).map(char => char !== ' ' ? `${prefix}${char}${suffix}` : char).join('');

// --- Base Maps ---

const maps = {
  // Math Alphanumeric Symbols (U+1D400 - U+1D6A3)
  mathBold: createMap(
    '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳',
    '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙',
    '𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'
  ),
  mathItalic: createMap(
    '𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧',
    '𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍'
  ),
  mathBoldItalic: createMap(
    '𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛',
    '𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁'
  ),
  mathScript: createMap(
    '𝒶𝒷𝒸𝒹ℯ𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏',
    '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵'
  ),
  mathScriptBold: createMap(
    '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃',
    '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩'
  ),
  mathFraktur: createMap(
    '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷',
    '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ'
  ),
  mathFrakturBold: createMap(
    '𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟',
    '𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅'
  ),
  mathDoubleStruck: createMap(
    '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫',
    '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ',
    '𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'
  ),
  mathSansSerifNew: createMap(
    '𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓',
    '𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹',
    '𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫'
  ),
  mathSansSerifBold: createMap(
    '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇',
    '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭',
    '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'
  ),
  mathSansSerifItalic: createMap(
    '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻',
    '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡'
  ),
  mathSansSerifBoldItalic: createMap(
    '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯',
    '𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕'
  ),
  mathMonospace: createMap(
    '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣',
    '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',
    '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'
  ),
  
  // Other Decorative Maps
  smallCaps: createMap(
    'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  ),
  superscript: createMap(
    'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ',
    'ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ',
    '⁰¹²³⁴⁵⁶⁷⁸⁹'
  ),
  subscript: createMap(
    'ₐbcdₑfgₕᵢⱼₖₗₘₙₒpqᵣₛₜᵤᵥwₓyz',
    'ₐBCDₑFGₕᵢⱼₖₗₘₙₒPQᵣₛₜᵤᵥWₓYZ',
    '₀₁₂³₄₅₆₇₈₉'
  ),
  bubble: createMap(
    'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ',
    'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ',
    '⓪①②③④⑤⑥⑦⑧⑨'
  ),
  bubbleDark: createMap(
    '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩',
    '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩',
    '⓿❶❷❸❹❺❻❼❽❾'
  ),
  squared: createMap(
    '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉',
    '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉'
  ),
  squaredDark: createMap(
    '🅰🅃🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉',
    '🅰🅃🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉'
  ),
  greek: createMap(
    'αβγδεζηθικλμνξοπρστυφχψω',
    'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
  ),
  fullWidth: createMap(
    'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ',
    'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ',
    '０１２３４５６７８９'
  )
};

const upsideDownMap = {
  'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ',
  'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ',
  'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
  'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': '◖', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁', 'H': 'H', 'I': 'I', 'J': 'ſ',
  'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Ό', 'R': 'ᴚ', 'S': 'S', 'T': '⊥',
  'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
  '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
  '.': '˙', ',': "'", "'": ',', '"': ',,', '!': '¡', '?': '¿', '<': '>', '>': '<', '(': ')', ')': '(',
  '[': ']', ']': '[', '{': '}', '}': '{', '_': '‾'
};

const mirrorMap = {
  'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ', 'f': 'Ꮈ', 'g': 'ǫ', 'h': 'ʜ', 'i': 'i', 'j': 'ꞁ',
  'k': 'ʞ', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'q', 'q': 'p', 'r': 'ɿ', 's': 'ꙅ', 't': 't',
  'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z',
  'A': 'A', 'B': 'ᙠ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ꟻ', 'G': '⅁', 'H': 'H', 'I': 'I', 'J': 'ᒐ',
  'K': '⋊', 'L': '⅃', 'M': 'M', 'N': 'И', 'O': 'O', 'P': 'ꟼ', 'Q': 'Ọ', 'R': 'Я', 'S': 'Ꙅ', 'T': 'T',
  'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z'
};

/** Deterministic “glitch” using combining marks — readable, no random Zalgo spam. */
const glitchDeterministic = (text) => {
  const stroke = '\u0336';
  return Array.from(text)
    .map((c, i) => (c === ' ' ? c : i % 3 === 0 ? c + stroke : c))
    .join('');
};

const leetLite = (text) => {
  const map = { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7', l: '1' };
  return Array.from(text.toLowerCase())
    .map((c) => map[c] || c)
    .join('');
};

// --- Validation & Fallback Functions ---

/**
 * Sanitizes text by removing characters that typically don't map well to math symbols.
 */
export const sanitizeForMath = (text) => {
  return text.replace(/[^\w\s.,!?()\-+='"]/g, '');
};

/**
 * Attempts a transformation and falls back to sanitized text if it fails or produces invalid characters.
 */
export const transformWithFallback = (text, transformFn) => {
  try {
    const result = transformFn(text);
    // Check for replacement character or unpaired surrogates
    if (!result || result.includes('\uFFFD') || /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|([^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/.test(result)) {
      return transformFn(sanitizeForMath(text));
    }
    return result;
  } catch (e) {
    return text;
  }
};

/**
 * Validates and safely executes a text transformation function.
 * @param {string} text - The input text to transform
 * @param {Function} transformFn - The transformation function to execute
 * @returns {Object} Result object containing success status, transformed text, warnings, and errors
 */
export const validateTransform = (text, transformFn) => {
  if (!text || text.trim() === '') {
    return { success: true, text: '', hasWarning: false, error: null, warnings: [] };
  }

  try {
    const result = transformFn(text);
    const warnings = [];
    
    if (!result || result.trim() === '') {
      return { success: false, text: '', hasWarning: true, error: 'Transformation resulted in empty text', warnings: ['Empty result'] };
    }

    if (result.includes('\uFFFD') || result.includes('?')) {
      warnings.push('Result contains unsupported characters (U+FFFD)');
    }

    // Check for invalid UTF-8 sequences (unpaired surrogates)
    if (/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|([^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/.test(result)) {
      warnings.push('Result contains invalid UTF-8 surrogate pairs');
    }

    return { 
      success: true, 
      text: result, 
      hasWarning: warnings.length > 0, 
      error: null,
      warnings 
    };
  } catch (err) {
    return { success: false, text: '', hasWarning: false, error: err.message || 'An error occurred during transformation', warnings: [] };
  }
};

// --- The 70+ Styles Library ---

export const textStyles = {
  // Math & Standard (Using correct Unicode Math Alphanumeric Symbols)
  mathBold: { name: 'Math Bold', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathBold)) },
  mathItalic: { name: 'Math Italic', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathItalic)) },
  mathBoldItalic: { name: 'Math Bold Italic', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathBoldItalic)) },
  mathScript: { name: 'Math Script', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathScript)) },
  mathScriptBold: { name: 'Math Script Bold', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathScriptBold)) },
  mathFraktur: { name: 'Math Fraktur', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathFraktur)) },
  mathFrakturBold: { name: 'Math Fraktur Bold', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathFrakturBold)) },
  mathDoubleStruck: { name: 'Math Double-Struck', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathDoubleStruck)) },
  mathMonospace: { name: 'Math Monospace', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathMonospace)) },
  mathSansSerifNew: { name: 'Math Sans-Serif', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathSansSerifNew)) },
  mathSansSerifBold: { name: 'Math Sans-Serif Bold', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathSansSerifBold)) },
  mathSansSerifItalic: { name: 'Math Sans-Serif Italic', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathSansSerifItalic)) },
  mathSansSerifBoldItalic: { name: 'Math Sans-Serif Bold Italic', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathSansSerifBoldItalic)) },
  
  // Legacy aliases to prevent breaking existing code
  bold: { name: 'Bold', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathBold)) },
  italic: { name: 'Italic', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathItalic)) },
  boldItalic: { name: 'Bold Italic', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathBoldItalic)) },
  script: { name: 'Script', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathScript)) },
  boldScript: { name: 'Bold Script', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathScriptBold)) },
  fraktur: { name: 'Fraktur', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathFraktur)) },
  boldFraktur: { name: 'Bold Fraktur', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathFrakturBold)) },
  doubleStruck: { name: 'Double-Struck', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathDoubleStruck)) },
  monospace: { name: 'Monospace', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathMonospace)) },
  sansSerif: { name: 'Sans-Serif', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.mathSansSerifNew)) },
  smallCaps: { name: 'Small Caps', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.smallCaps)) },
  
  // Sub/Super
  superscript: { name: 'Superscript', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.superscript)) },
  subscript: { name: 'Subscript', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.subscript)) },
  
  // Enclosed
  bubble: { name: 'Bubble', category: 'Decorative', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.bubble)) },
  bubbleDark: { name: 'Bubble Dark', category: 'Decorative', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.bubbleDark)) },
  squared: { name: 'Squared', category: 'Decorative', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.squared)) },
  squaredDark: { name: 'Squared Dark', category: 'Decorative', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.squaredDark)) },
  boxedText: { name: 'Boxed Text', category: 'Decorative', transform: t => applyWrapper(t, '[', ']') },
  parenthesized: { name: 'Parenthesized', category: 'Decorative', transform: t => applyWrapper(t, '(', ')') },
  braced: { name: 'Braced', category: 'Decorative', transform: t => applyWrapper(t, '{', '}') },
  angled: { name: 'Angled', category: 'Decorative', transform: t => applyWrapper(t, '<', '>') },
  
  // Flip & Mirror
  upsideDown: { name: 'Upside Down', category: 'Identity', transform: t => Array.from(t).reverse().map(c => upsideDownMap[c] || c).join('') },
  mirrorText: { name: 'Mirror Text', category: 'Identity', transform: t => Array.from(t).reverse().map(c => mirrorMap[c] || c).join('') },
  reverseText: { name: 'Reverse Text', category: 'Identity', transform: t => Array.from(t).reverse().join('') },
  
  // Combining Marks
  strikethrough: { name: 'Strikethrough', category: 'Decorative', transform: t => applyCombiningMark(t, '\u0336') },
  doubleStrikethrough: { name: 'Double Strikethrough', category: 'Decorative', transform: t => applyCombiningMark(t, '\u0333') },
  underline: { name: 'Underline', category: 'Decorative', transform: t => applyCombiningMark(t, '\u0332') },
  doubleUnderline: { name: 'Double Underline', category: 'Decorative', transform: t => applyCombiningMark(t, '\u0333') },
  overline: { name: 'Overline', category: 'Decorative', transform: t => applyCombiningMark(t, '\u0305') },
  wavy: { name: 'Wavy', category: 'Decorative', transform: t => applyCombiningMark(t, '\u0330') },
  slashThrough: { name: 'Slash Through', category: 'Decorative', transform: t => applyCombiningMark(t, '\u0338') },
  crossAbove: { name: 'Cross Above', category: 'Decorative', transform: t => applyCombiningMark(t, '\u033D') },
  dottedText: { name: 'Dotted Text', category: 'Decorative', transform: t => applyCombiningMark(t, '\u0324') },
  accentedText: { name: 'Accented Text', category: 'Decorative', transform: t => applyCombiningMark(t, '\u0301') },
  
  // Width & Spacing
  fullWidth: { name: 'Full Width', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.fullWidth)) },
  spacedText: { name: 'Spaced Text', category: 'Identity', transform: t => applySeparator(t, ' ') },
  wideSpaced: { name: 'Wide Spaced', category: 'Identity', transform: t => applySeparator(t, '   ') },
  
  // Separators
  dotSeparated: { name: 'Dot Separated', category: 'Identity', transform: t => applySeparator(t, '.') },
  dashSeparated: { name: 'Dash Separated', category: 'Identity', transform: t => applySeparator(t, '-') },
  slashSeparated: { name: 'Slash Separated', category: 'Identity', transform: t => applySeparator(t, '/') },
  backslashSeparated: { name: 'Backslash Separated', category: 'Identity', transform: t => applySeparator(t, '\\') },
  pipeSeparated: { name: 'Pipe Separated', category: 'Identity', transform: t => applySeparator(t, '|') },
  plusSeparated: { name: 'Plus Separated', category: 'Identity', transform: t => applySeparator(t, '+') },
  equalSeparated: { name: 'Equal Separated', category: 'Identity', transform: t => applySeparator(t, '=') },
  tildeSeparated: { name: 'Tilde Separated', category: 'Identity', transform: t => applySeparator(t, '~') },
  caretSeparated: { name: 'Caret Separated', category: 'Identity', transform: t => applySeparator(t, '^') },
  starSeparated: { name: 'Star Separated', category: 'Identity', transform: t => applySeparator(t, '★') },
  
  // Symbols & Prefixes
  greekLetters: { name: 'Greek Letters', category: 'Symbols', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.greek)) },
  dollarText: { name: 'Dollar Text', category: 'Symbols', transform: t => applyWrapper(t, '$') },
  hashText: { name: 'Hash Text', category: 'Symbols', transform: t => applyWrapper(t, '#') },
  atText: { name: 'At Text', category: 'Symbols', transform: t => applyWrapper(t, '@') },
  ampersandText: { name: 'Ampersand Text', category: 'Symbols', transform: t => applyWrapper(t, '&') },
  percentText: { name: 'Percent Text', category: 'Symbols', transform: t => applyWrapper(t, '%') },
  asteriskText: { name: 'Asterisk Text', category: 'Symbols', transform: t => applyWrapper(t, '*') },
  
  // Quotes
  quotedText: { name: 'Quoted Text', category: 'Symbols', transform: t => `"${t}"` },
  singleQuoted: { name: 'Single Quoted', category: 'Symbols', transform: t => `'${t}'` },
  backtickQuoted: { name: 'Backtick Quoted', category: 'Symbols', transform: t => `\`${t}\`` },
  
  // Decorative & Emoji
  zalgo: { name: 'Glitch Scan', category: 'Decorative', transform: t => glitchDeterministic(t) },
  sparkles: { name: 'Sparkles', category: 'Bio', transform: t => `✨ ${t} ✨` },
  starText: { name: 'Star Text', category: 'Bio', transform: t => `★ ${t} ★` },
  heartText: { name: 'Heart Text', category: 'Bio', transform: t => `💖 ${t} 💖` },
  fireText: { name: 'Fire Text', category: 'Competitive', transform: t => `🔥 ${t} 🔥` },
  crownText: { name: 'Crown Text', category: 'Competitive', transform: t => `👑 ${t} 👑` },
  skullText: { name: 'Skull Text', category: 'Competitive', transform: t => `💀 ${t} 💀` },
  diamondText: { name: 'Diamond Text', category: 'Decorative', transform: t => `♦ ${t} ♦` },
  ribbonText: { name: 'Ribbon Text', category: 'Bio', transform: t => `🎀 ${t} 🎀` },
  vaporwave: { name: 'Vaporwave', category: 'Decorative', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.fullWidth)).split('').join(' ') },
  aesthetic: { name: 'Aesthetic Banner', category: 'Bio', transform: t => `✧･ﾟ: *✧･ﾟ:* ${t} *:･ﾟ✧*:･ﾟ✧` },
  
  // Numbers Specific
  circledNumbers: { name: 'Circled Numbers', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.bubble)) },
  squaredNumbers: { name: 'Squared Numbers', category: 'Unicode', transform: t => transformWithFallback(t, text => transformWithMap(text, maps.squared)) },
  romanNumerals: { 
    name: 'Roman Numerals', 
    category: 'Unicode', 
    transform: t => {
      const romanMap = { '1': 'Ⅰ', '2': 'Ⅱ', '3': 'Ⅲ', '4': 'Ⅳ', '5': 'Ⅴ', '6': 'Ⅵ', '7': 'Ⅶ', '8': 'Ⅷ', '9': 'Ⅸ', '0': '〇' };
      return Array.from(t).map(c => romanMap[c] || c).join('');
    }
  },
  numberedText: { name: 'Numbered Text', category: 'Unicode', transform: t => Array.from(t).map((c, i) => `${i + 1}. ${c}`).join(' ') },

  // --- Competitive: clan-ready, tryhard-readable tags ---
  comp_xClassic: { name: 'xX Classic', category: 'Competitive', transform: t => `xX_${t}_Xx` },
  comp_clanBox: { name: 'Clan Box', category: 'Competitive', transform: t => `【${t}】` },
  comp_pipeRun: { name: 'Pipe Run', category: 'Competitive', transform: t => Array.from(t).join('|') },
  comp_dotRun: { name: 'Dot Run', category: 'Competitive', transform: t => Array.from(t).join('·') },
  comp_altCase: { name: 'Alt Case', category: 'Competitive', transform: t => Array.from(t).map((c, i) => (c === ' ' ? ' ' : i % 2 ? c.toUpperCase() : c.toLowerCase())).join('') },
  comp_cornerJP: { name: 'Corner Brackets', category: 'Competitive', transform: t => `「${t}」` },
  comp_lenticular: { name: 'Lenticular', category: 'Competitive', transform: t => `〖${t}〗` },
  comp_doubleAngle: { name: 'Double Angle', category: 'Competitive', transform: t => `《${t}》` },
  comp_wingRune: { name: 'Wing Rune', category: 'Competitive', transform: t => `༺ ${t} ༻` },
  comp_ornateArc: { name: 'Ornate Arc', category: 'Competitive', transform: t => `꧁ ${t} ꧂` },
  comp_streamBracket: { name: 'Stream Bracket', category: 'Competitive', transform: t => `⟨${t}⟩` },
  comp_starkMono: { name: 'Stark Mono', category: 'Competitive', transform: t => transformWithFallback(t, (x) => transformWithMap(x, maps.mathMonospace)) },
  comp_hardSans: { name: 'Hard Sans', category: 'Competitive', transform: t => transformWithFallback(t, (x) => transformWithMap(x, maps.mathSansSerifBold)) },
  comp_wideTag: { name: 'Wide Tag', category: 'Competitive', transform: t => transformWithFallback(t, (x) => transformWithMap(x, maps.fullWidth)) },
  comp_underSnake: { name: 'Underscore Tag', category: 'Competitive', transform: t => t.trim().replace(/\s+/g, '_') },
  comp_bulletCore: { name: 'Bullet Core', category: 'Competitive', transform: t => `• ${t} •` },
  comp_doubleStruckPro: { name: 'Double-Struck Pro', category: 'Competitive', transform: t => transformWithFallback(t, (x) => transformWithMap(x, maps.mathDoubleStruck)) },

  // --- Bio & social rhythm ---
  bio_tiktokDots: { name: 'TikTok Dot Rhythm', category: 'Bio', transform: t => Array.from(t).join('・') },
  bio_softLower: { name: 'Soft Lowercase', category: 'Bio', transform: t => t.toLowerCase() },
  bio_bannerUpper: { name: 'Banner Upper', category: 'Bio', transform: t => t.toUpperCase() },
  bio_emDash: { name: 'Em Dash Line', category: 'Bio', transform: t => `— ${t} —` },
  bio_sparkleSoft: { name: 'Sparkle Soft', category: 'Bio', transform: t => `✧ ${t} ✧` },
  bio_moonFrame: { name: 'Moon Frame', category: 'Bio', transform: t => `☾ ${t} ☽` },
  bio_starDivider: { name: 'Star Divider', category: 'Bio', transform: t => `⋆ ${t} ⋆` },
  bio_sakuraWrap: { name: 'Sakura Wrap', category: 'Bio', transform: t => `❀ ${t} ❀` },
  bio_statusLine: { name: 'Status Line', category: 'Bio', transform: t => `▸ ${t} ◂` },
  bio_softQuote: { name: 'Soft Quote', category: 'Bio', transform: t => `“${t}”` },

  // --- Identity shaping (casing & rhythm) ---
  id_compact: { name: 'Compact Tag', category: 'Identity', transform: t => t.replace(/\s+/g, '') },
  id_snake: { name: 'Snake Case', category: 'Identity', transform: t => t.trim().replace(/\s+/g, '_').toLowerCase() },
  id_kebab: { name: 'Kebab Case', category: 'Identity', transform: t => t.trim().toLowerCase().replace(/\s+/g, '-') },
  id_leet: { name: 'Leet Lite', category: 'Identity', transform: t => leetLite(t) },
  id_titleCase: { name: 'Title Case', category: 'Identity', transform: t => t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  id_reverseWords: { name: 'Word Reverse', category: 'Identity', transform: t => t.split(/\s+/).reverse().join(' ') },

  // --- Symbol framing (extra) ---
  sym_angleQuote: { name: 'Guillemets', category: 'Symbols', transform: t => `«${t}»` },
  sym_fullParen: { name: 'Fullwidth Paren', category: 'Symbols', transform: t => `（${t}）` },
  sym_cornerHex: { name: 'Corner Quotes', category: 'Symbols', transform: t => `⌜${t}⌝` },
  sym_blossomFrame: { name: 'Fleur Frame', category: 'Symbols', transform: t => `⚜ ${t} ⚜` },
  sym_infinityGate: { name: 'Infinity Gate', category: 'Symbols', transform: t => `∞ ${t} ∞` },

  // --- Decorative depth (deterministic) ---
  deco_vaporRhythm: { name: 'Vapor Rhythm', category: 'Decorative', transform: t => transformWithFallback(t, (x) => Array.from(transformWithMap(x, maps.fullWidth)).join('‧')) },
  deco_scanTunnel: { name: 'Scan Tunnel', category: 'Decorative', transform: t => Array.from(t).join('┊') },
  deco_neonFence: { name: 'Neon Fence', category: 'Decorative', transform: t => `│ ${t} │` },
  deco_shadowStrike: { name: 'Short Strike', category: 'Decorative', transform: t => applyCombiningMark(t, '\u0335') },
  deco_medievalBar: { name: 'Medieval Bar', category: 'Decorative', transform: t => `⚔ ${t} ⚔` },
  deco_runeDots: { name: 'Rune Dots', category: 'Decorative', transform: t => Array.from(t).join(' ∘ ') }
};

// --- Nickname Symbols Library ---

export const nicknameSymbols = [
  { id: 'sym1', name: 'Classic Star', pattern: '★ {name} ★' },
  { id: 'sym2', name: 'Shooting Star', pattern: '☄ {name} ☄' },
  { id: 'sym3', name: 'Sparkle', pattern: '✨ {name} ✨' },
  { id: 'sym4', name: 'Sakura', pattern: '❀ {name} ❀' },
  { id: 'sym5', name: 'Lotus', pattern: '✿ {name} ✿' },
  { id: 'sym6', name: 'Black Heart', pattern: '♥ {name} ♥' },
  { id: 'sym7', name: 'White Heart', pattern: '♡ {name} ♡' },
  { id: 'sym8', name: 'Sparkle Heart', pattern: '💖 {name} 💖' },
  { id: 'sym9', name: 'Eighth Note', pattern: '♪ {name} ♪' },
  { id: 'sym10', name: 'Beamed Notes', pattern: '♫ {name} ♫' },
  { id: 'sym11', name: 'Japanese Bracket', pattern: '【 {name} 】' },
  { id: 'sym12', name: 'Lenticular Bracket', pattern: '〖 {name} 〗' },
  { id: 'sym13', name: 'Infinity', pattern: '∞ {name} ∞' },
  { id: 'sym14', name: 'Cross', pattern: '✝ {name} ✝' },
  { id: 'sym15', name: 'Fleur-de-lis', pattern: '⚜ {name} ⚜' },
  { id: 'sym16', name: 'Anchor', pattern: '⚓ {name} ⚓' },
  { id: 'sym17', name: 'Swords', pattern: '⚔ {name} ⚔' },
  { id: 'sym18', name: 'Scales', pattern: '⚖ {name} ⚖' },
  { id: 'sym19', name: 'Gear', pattern: '⚙ {name} ⚙' },
  { id: 'sym20', name: 'Atom', pattern: '⚛ {name} ⚛' },
  { id: 'sym21', name: 'Warning', pattern: '⚠ {name} ⚠' },
  { id: 'sym22', name: 'Radioactive', pattern: '☢ {name} ☢' },
  { id: 'sym23', name: 'Biohazard', pattern: '☣ {name} ☣' },
  { id: 'sym24', name: 'Yin Yang', pattern: '☯ {name} ☯' },
  { id: 'sym25', name: 'Peace', pattern: '☮ {name} ☮' },
  { id: 'sym26', name: 'Crown', pattern: '♔ {name} ♔' },
  { id: 'sym27', name: 'Spade', pattern: '♤ {name} ♤' },
  { id: 'sym28', name: 'Diamond', pattern: '♢ {name} ♢' },
  { id: 'sym29', name: 'Club', pattern: '♧ {name} ♧' },
  { id: 'sym30', name: 'Target', pattern: '🎯 {name} 🎯' },
  { id: 'sym31', name: 'Trophy', pattern: '🏆 {name} 🏆' },
  { id: 'sym32', name: 'Fire', pattern: '🔥 {name} 🔥' },
  { id: 'sym33', name: 'Skull', pattern: '💀 {name} 💀' },
  { id: 'sym34', name: 'Ghost', pattern: '👻 {name} 👻' },
  { id: 'sym35', name: 'Alien', pattern: '👽 {name} 👽' },
  { id: 'sym36', name: 'Demon', pattern: '👿 {name} 👿' },
  { id: 'sym37', name: 'Dragon', pattern: '🐉 {name} 🐉' },
  { id: 'sym38', name: 'Crescent Moon', pattern: '🌙 {name} 🌙' },
  { id: 'sym39', name: 'Sun', pattern: '☀ {name} ☀' },
  { id: 'sym40', name: 'Cloud', pattern: '☁ {name} ☁' },
  { id: 'sym41', name: 'Umbrella', pattern: '☂ {name} ☂' },
  { id: 'sym42', name: 'Snowman', pattern: '☃ {name} ☃' },
  { id: 'sym43', name: 'Comet', pattern: '☄ {name} ☄' },
  { id: 'sym44', name: 'Checkmark', pattern: '✔ {name} ✔' },
  { id: 'sym45', name: 'Cross Mark', pattern: '✘ {name} ✘' },
  { id: 'sym46', name: 'Scissors', pattern: '✂ {name} ✂' },
  { id: 'sym47', name: 'Airplane', pattern: '✈ {name} ✈' },
  { id: 'sym48', name: 'Envelope', pattern: '✉ {name} ✉' },
  { id: 'sym49', name: 'Pencil', pattern: '✎ {name} ✎' },
  { id: 'sym50', name: 'Telephone', pattern: '☎ {name} ☎' },
  { id: 'sym51', name: 'Ornate Left/Right', pattern: '꧁ {name} ꧂' },
  { id: 'sym52', name: 'Wings', pattern: '༺ {name} ༻' },
  { id: 'sym53', name: 'Thick Brackets', pattern: '【 {name} 】' },
  { id: 'sym54', name: 'Double Angles', pattern: '《 {name} 》' },
  { id: 'sym55', name: 'Corner Brackets', pattern: '「 {name} 」' },
  { id: 'sym56', name: 'White Brackets', pattern: '『 {name} 』' },
  { id: 'sym57', name: 'Black Lenticular', pattern: '【 {name} 】' },
  { id: 'sym58', name: 'White Lenticular', pattern: '〖 {name} 〗' },
  { id: 'sym59', name: 'Tortoise Shell', pattern: '〔 {name} 〕' },
  { id: 'sym60', name: 'White Tortoise', pattern: '〘 {name} 〙' },
];

// --- Expanded Nickname Symbol Categories (150+ Symbols) ---

export const nicknameSymbolCategories = {
  stars: ['★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '⁂', '⁎', '⁑', '✢', '✣', '✤', '✥', '✱'],
  flowers: ['❀', '✿', '❁', '✾', '✽', '❃', '❋', '❊', '🌺', '🌻', '🌹', '🌷', '🌼', '🌸', '💐', '💮', '🪷', '🏵️'],
  hearts: ['♥', '♡', '❤', '❥', '❣', '❦', '❧', '🤎', '🤍', '🖤', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  gaming: ['🎮', '🕹️', '👾', '🎲', '♠', '♣', '♥', '♦', '🎯', '🏆', '🏅', '🥇', '🥈', '🥉', '⚔️', '🛡️', '🔫', '💣'],
  royalty: ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟', '👑', '💎', '💍', '⚜', '☥'],
  elements: ['🔥', '💧', '🌊', '💨', '🌪️', '🌬️', '❄️', '⛄', '⚡', '🌩️', '☀️', '🌞', '🌙', '🌛', '🌜', '🌟', '☄️', '💥'],
  animals: ['🦋', '🦅', '🦇', '🐺', '🦊', '🦁', '🐯', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦏', '🦛', '🐪', '🐫', '🦒', '🐉', '🐲'],
  math: ['∞', '∑', '∏', '∐', '∫', '∬', '∭', '∮', '∯', '∰', '∱', '∲', '∳', '∀', '∁', '∂', '∃', '∄', '∅', '∆'],
  asian: ['㊊', '㊋', '㊌', '㊍', '㊎', '㊏', '㊐', '㊑', '㊒', '㊓', '㊔', '㊕', '㊖', '㊗', '㊘', '㊙', '㊚', '㊛', '㊜', '㊝'],
  music: ['♪', '♫', '♬', '♭', '♮', '♯', '🎵', '🎶', '🎼', '🎤', '🎧', '🎷', '🎸', '🎹', '🎺', '🎻', '📻', '🎙️'],
  arrows: ['←', '↑', '→', '↓', '↔', '↕', '↖', '↗', '↘', '↙', '↚', '↛', '↜', '↝', '↞', '↟', '↠', '↡', '↢', '↣'],
  lines: ['─', '━', '│', '┃', '┄', '┅', '┆', '┇', '┈', '┉', '┊', '┋', '┌', '┍', '┎', '┏', '┐', '┑', '┒', '┓'],
  food: ['🍎', '🍏', '🍊', '🍋', '🍒', '🍇', '🍉', '🍓', '🍑', '🍈', '🍌', '🍐', '🍍', '🍠', '🍆', '🍅', '🌽', '🌶️'],
  nature: ['🌲', '🌳', '🌴', '🌵', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍄', '🌰', '🦀', '🐌', '🐛', '🐜', '🐝', '🐞'],
  sports: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🥏', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳'],
  travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🚨'],
  objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸'],
  abstract: ['🌀', '🌁', '🌂', '🌃', '🌄', '🌅', '🌆', '🌇', '🌈', '🌉', '🌌', '🌠', '🎇', '🎆', '🎑', '🎐', '🎏', '🎌'],
  complex: ['꧁', '꧂', '༺', '༻', '【', '】', '〖', '〗', '『', '』', '「', '」', '《', '》', '≪', '≫', '︽', '≫', '︵', '︶']
};

/**
 * Returns an array of all available styles with their keys.
 */
export const getAllStyles = () => {
  return Object.entries(textStyles).map(([key, style]) => ({
    id: key,
    ...style
  }));
};

/**
 * Returns styles filtered by a specific category.
 */
export const getStylesByCategory = (category) => {
  return getAllStyles().filter(style => style.category === category);
};

/**
 * Returns an array of all unique categories.
 */
export const getAllCategories = () => {
  const categories = new Set(Object.values(textStyles).map(style => style.category));
  return ['All', ...Array.from(categories)];
};

/**
 * Converts text using a specific style key.
 */
export const convertText = (text, styleKey) => {
  const style = textStyles[styleKey];
  if (!style) return text;
  return style.transform(text);
};

/**
 * Converts text into all available styles, returning an array of results.
 */
export const convertToAllStyles = (text) => {
  return getAllStyles().map(style => {
    const validation = validateTransform(text, style.transform);
    return {
      ...style,
      ...validation
    };
  });
};

/**
 * Searches styles by name or category.
 */
export const searchStyles = (query) => {
  if (!query) return getAllStyles();
  const lowerQuery = query.toLowerCase();
  return getAllStyles().filter(style => 
    style.name.toLowerCase().includes(lowerQuery) || 
    style.category.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Exports transformed texts as a plain text string.
 */
export const exportAsText = (transformedTexts) => {
  return transformedTexts
    .filter(s => s.success)
    .map(s => `${s.name}:\n${s.text}\n`)
    .join('\n');
};

/**
 * Exports transformed texts as a JSON string.
 */
export const exportAsJSON = (inputText, transformedTexts) => {
  const data = {
    input: inputText,
    timestamp: new Date().toISOString(),
    styles: transformedTexts
      .filter(s => s.success)
      .map(s => ({ name: s.name, category: s.category, text: s.text }))
  };
  return JSON.stringify(data, null, 2);
};

/**
 * Exports transformed texts as a CSV string.
 */
export const exportAsCSV = (transformedTexts) => {
  const header = 'Style Name,Category,Text\n';
  const rows = transformedTexts
    .filter(s => s.success)
    .map(s => `"${s.name}","${s.category}","${s.text.replace(/"/g, '""')}"`)
    .join('\n');
  return header + rows;
};

/**
 * Generates an array of nickname symbols based on the provided nickname.
 */
export const generateNicknameSymbols = (nickname) => {
  if (!nickname) return [];
  return nicknameSymbols.map(sym => ({
    ...sym,
    result: sym.pattern.replace('{name}', nickname)
  }));
};

/**
 * Generates a random selection of nickname symbols.
 */
export const generateRandomSymbols = (nickname, count = 15) => {
  if (!nickname) return [];
  const all = generateNicknameSymbols(nickname);
  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, count);
};

/**
 * Returns an array of all nickname symbol categories with their counts.
 */
export const getNicknameSymbolCategories = () => {
  return Object.entries(nicknameSymbolCategories).map(([id, symbols]) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    count: symbols.length
  }));
};

/**
 * Returns an array of symbols for a specific category.
 */
export const getSymbolsByCategory = (categoryId) => {
  return nicknameSymbolCategories[categoryId] || [];
};

/**
 * Generates highly customizable nickname symbols based on user options.
 * @param {string} nickname - The base nickname
 * @param {Object} options - Customization options
 * @returns {Array} Array of generated variations
 */
export const generateCustomNicknameSymbols = (nickname, options = {}) => {
  if (!nickname) return [];
  
  const {
    position = 'both', // 'before', 'after', 'both'
    symbolCount = 1,   // 1 to 5
    spacing = 1,       // 0 to 5
    categories = [],   // Array of category IDs
    customSymbols = [] // Array of custom symbols
  } = options;

  // Gather allowed symbols
  let allowedSymbols = [...customSymbols];
  
  if (categories.length > 0) {
    categories.forEach(cat => {
      if (nicknameSymbolCategories[cat]) {
        allowedSymbols = [...allowedSymbols, ...nicknameSymbolCategories[cat]];
      }
    });
  } else if (customSymbols.length === 0) {
    // If no categories and no custom symbols, use all categories
    Object.values(nicknameSymbolCategories).forEach(syms => {
      allowedSymbols = [...allowedSymbols, ...syms];
    });
  }

  // Fallback if somehow empty
  if (allowedSymbols.length === 0) {
    allowedSymbols = ['★', '✨', '🔥', '💀', '👑'];
  }

  const variations = [];
  const spaceStr = ' '.repeat(spacing);

  for (let i = 0; i < 20; i++) {
    // Pick random symbols
    const pickedSymbols = [];
    for (let j = 0; j < symbolCount; j++) {
      const randomSym = allowedSymbols[Math.floor(Math.random() * allowedSymbols.length)];
      pickedSymbols.push(randomSym);
    }
    
    const symbolStr = pickedSymbols.join('');
    let result = nickname;

    if (position === 'before') {
      result = `${symbolStr}${spaceStr}${nickname}`;
    } else if (position === 'after') {
      result = `${nickname}${spaceStr}${symbolStr}`;
    } else {
      // both
      // For 'both', we can either mirror the same symbols or pick new ones for the end.
      // Let's mirror them for a cleaner look, or reverse them if they are brackets.
      const isBracket = ['【', '〖', '『', '「', '《', '≪', '︽', '︵', '꧁', '༺'].includes(pickedSymbols[0]);
      let endSymbolStr = symbolStr;
      
      if (isBracket) {
        // Simple mapping for common brackets
        const bracketMap = {
          '【': '】', '〖': '〗', '『': '』', '「': '」', '《': '》', 
          '≪': '≫', '︽': '︾', '︵': '︶', '꧁': '꧂', '༺': '༻'
        };
        endSymbolStr = pickedSymbols.map(s => bracketMap[s] || s).reverse().join('');
      } else {
        // Just reverse the string for symmetry
        endSymbolStr = pickedSymbols.slice().reverse().join('');
      }

      result = `${symbolStr}${spaceStr}${nickname}${spaceStr}${endSymbolStr}`;
    }

    variations.push({
      id: `custom_${Date.now()}_${i}`,
      result,
      symbols: pickedSymbols
    });
  }

  return variations;
};