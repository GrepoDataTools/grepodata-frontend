// One-off codemod: appends matching `dark:` Tailwind utility variants next to known
// light-mode utility classes inside class="..." attributes of the given HTML files.
// Usage: node scripts/apply-dark-mode.js <file1> <file2> ...
const fs = require('fs');

// base utility -> dark: companion utility to append (only if not already present)
const MAP = {
  'bg-white': 'dark:bg-slate-800',
  'bg-slate-50': 'dark:bg-slate-700/40',
  'bg-slate-100': 'dark:bg-slate-700',
  'bg-slate-200': 'dark:bg-slate-600',
  'bg-brand-50': 'dark:bg-brand-500/10',
  'bg-brand-50/60': 'dark:bg-brand-500/10',
  'bg-amber-50': 'dark:bg-amber-500/10',
  'bg-sky-50': 'dark:bg-sky-500/10',
  'bg-rose-50': 'dark:bg-rose-500/10',
  'bg-emerald-50': 'dark:bg-emerald-500/10',
  'text-amber-600': 'dark:text-amber-400',
  'text-amber-900': 'dark:text-amber-300',
  'text-amber-800': 'dark:text-amber-400',
  'text-sky-600': 'dark:text-sky-400',
  'text-sky-900': 'dark:text-sky-300',
  'text-sky-800': 'dark:text-sky-400',
  'text-rose-600': 'dark:text-rose-400',
  'text-rose-700': 'dark:text-rose-400',
  'text-emerald-700': 'dark:text-emerald-400',
  'ring-rose-600/20': 'dark:ring-rose-400/30',
  'ring-emerald-600/25': 'dark:ring-emerald-400/30',
  'ring-amber-600/20': 'dark:ring-amber-400/30',
  'ring-sky-600/20': 'dark:ring-sky-400/30',
  'hover:bg-rose-100': 'dark:hover:bg-rose-500/20',
  'hover:bg-emerald-100': 'dark:hover:bg-emerald-500/20',
  'hover:text-rose-700': 'dark:hover:text-rose-400',
  'hover:text-emerald-700': 'dark:hover:text-emerald-400',
  'focus:text-rose-700': 'dark:focus:text-rose-400',
  'focus:text-emerald-700': 'dark:focus:text-emerald-400',
  'text-slate-900': 'dark:text-white',
  'text-slate-800': 'dark:text-slate-100',
  'text-slate-700': 'dark:text-slate-300',
  'text-slate-600': 'dark:text-slate-400',
  'text-slate-500': 'dark:text-slate-400',
  'text-slate-400': 'dark:text-slate-500',
  'text-amber-700': 'dark:text-amber-400',
  'border-slate-200': 'dark:border-slate-700',
  'border-slate-100': 'dark:border-slate-700',
  'ring-slate-900/[.08]': 'dark:ring-white/10',
  'ring-slate-300': 'dark:ring-slate-600',
  'ring-slate-200': 'dark:ring-slate-700',
  'ring-amber-600/25': 'dark:ring-amber-400/30',
  'ring-brand-600/25': 'dark:ring-brand-400/30',
  'hover:bg-slate-50': 'dark:hover:bg-slate-700/60',
  'hover:bg-slate-100': 'dark:hover:bg-slate-700',
  'hover:text-slate-900': 'dark:hover:text-white',
  'hover:text-slate-600': 'dark:hover:text-slate-300',
};

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node apply-dark-mode.js <file1> [file2] ...');
  process.exit(1);
}

for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  let changedCount = 0;

  src = src.replace(/class="([^"]*)"/g, (full, classList) => {
    const tokens = classList.split(/\s+/).filter(Boolean);
    const tokenSet = new Set(tokens);
    const toAdd = [];
    for (const base of tokens) {
      const companion = MAP[base];
      if (companion && !tokenSet.has(companion)) {
        toAdd.push(companion);
        tokenSet.add(companion);
      }
    }
    if (toAdd.length === 0) return full;
    changedCount++;
    return `class="${[...tokens, ...toAdd].join(' ')}"`;
  });

  fs.writeFileSync(file, src, 'utf8');
  console.log(`${file}: updated ${changedCount} class attributes`);
}
