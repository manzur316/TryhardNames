import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readSource = (path) => readFileSync(new URL(`../../src/${path}`, import.meta.url), 'utf8');

const accountPage = readSource('pages/AccountPage.jsx');
const privatePassportEditor = readSource('gaming-passport/components/PrivatePassportEditor.jsx');
const privatePassportPreview = readSource('gaming-passport/components/PrivatePassportPreview.jsx');
const passportCompletionChecklist = readSource('gaming-passport/components/PassportCompletionChecklist.jsx');
const savedNameHighlightsPicker = readSource('gaming-passport/components/SavedNameHighlightsPicker.jsx');
const accountSurface = [
  accountPage,
  privatePassportEditor,
  privatePassportPreview,
  passportCompletionChecklist,
  savedNameHighlightsPicker,
].join('\n');
const signInPage = readSource('pages/auth/SignInPage.jsx');
const signUpPage = readSource('pages/auth/SignUpPage.jsx');
const authCallbackPage = readSource('pages/auth/AuthCallbackPage.jsx');
const authUnavailable = readSource('pages/auth/AuthUnavailable.jsx');
const accountAndAuthPages = [accountPage, signInPage, signUpPage, authCallbackPage, authUnavailable].join('\n');

describe('Account/Auth theme copy contract', () => {
  it('keeps Account functional surfaces paired for light and dark modes', () => {
    assert.match(accountSurface, /border-slate-200\/80 bg-white\/80[\s\S]*dark:border-white\/10 dark:bg-white\/\[0\.04\]/);
    assert.match(accountSurface, /text-slate-950 dark:text-white/);
    assert.match(accountSurface, /text-slate-700 dark:text-slate-200/);
    assert.match(accountSurface, /border-slate-300 bg-white px-3 py-2 text-slate-900[\s\S]*dark:border-white\/10 dark:bg-black\/30 dark:text-white/);
    assert.match(accountSurface, /border-red-300 bg-red-50[\s\S]*text-red-700[\s\S]*dark:border-red-400\/30 dark:bg-red-500\/10 dark:text-red-100/);
    assert.match(accountSurface, /border-emerald-300 bg-emerald-50[\s\S]*text-emerald-700[\s\S]*dark:border-emerald-400\/30 dark:bg-emerald-500\/10 dark:text-emerald-100/);
  });

  it('keeps SignIn form surfaces paired for light and dark modes', () => {
    assert.match(signInPage, /border-slate-200\/80 bg-white\/80[\s\S]*dark:border-white\/10 dark:bg-white\/\[0\.04\]/);
    assert.match(signInPage, /text-slate-950 dark:text-white/);
    assert.match(signInPage, /text-slate-700 dark:text-slate-200/);
    assert.match(signInPage, /border-slate-300 bg-white px-3 py-2 text-slate-900[\s\S]*dark:border-white\/10 dark:bg-black\/30 dark:text-white/);
    assert.match(signInPage, /border-slate-300 px-4 py-2\.5 text-sm font-semibold text-slate-700[\s\S]*dark:border-white\/15 dark:text-white/);
  });

  it('keeps SignUp form surfaces paired for light and dark modes', () => {
    assert.match(signUpPage, /border-slate-200\/80 bg-white\/80[\s\S]*dark:border-white\/10 dark:bg-white\/\[0\.04\]/);
    assert.match(signUpPage, /text-slate-950 dark:text-white/);
    assert.match(signUpPage, /text-slate-700 dark:text-slate-200/);
    assert.match(signUpPage, /border-slate-300 bg-white px-3 py-2 text-slate-900[\s\S]*dark:border-white\/10 dark:bg-black\/30 dark:text-white/);
    assert.match(signUpPage, /border-emerald-300 bg-emerald-50[\s\S]*text-emerald-700[\s\S]*dark:border-emerald-400\/30 dark:bg-emerald-500\/10 dark:text-emerald-100/);
  });

  it('keeps callback and unavailable states readable in light and dark modes', () => {
    assert.match(authCallbackPage, /text-slate-950 dark:text-white/);
    assert.match(authCallbackPage, /text-slate-600 dark:text-slate-300/);
    assert.match(authCallbackPage, /text-red-700 dark:text-red-100/);
    assert.match(authUnavailable, /text-slate-950 dark:text-white/);
    assert.match(authUnavailable, /text-slate-600 dark:text-slate-300/);
  });

  it('does not keep the old dark-only input pattern or add gaming provider auth buttons', () => {
    assert.doesNotMatch(accountAndAuthPages, /bg-black\/30 px-3 py-2 text-white/);
    assert.doesNotMatch(accountAndAuthPages, /Continue with (Riot|Discord)/i);
    assert.doesNotMatch(accountAndAuthPages, /signInWith(Riot|Discord)|signUpWith(Riot|Discord)/);
  });
});
