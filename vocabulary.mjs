import {STARTER_WORDS} from './words.mjs';
import {SYLLABUS_WORDS,OFFICIAL_HEADWORDS} from './syllabus-data.mjs';
export {OFFICIAL_HEADWORDS,SYLLABUS_WORDS};
export const termKey=term=>term==='IT'?'IT':term.toLowerCase();
const syllabus=new Map(SYLLABUS_WORDS.map(w=>[termKey(w.term),w]));
// Keep all original IDs, examples, notes and order so an unfinished session still works.
export const BUNDLED_WORDS=[...STARTER_WORDS.map(w=>{
 const official=syllabus.get(termKey(w.term));
 return official?{...official,...w,group:official.group,headwords:official.headwords,level:official.level,sourcePage:official.sourcePage,meaningSource:'拾词原起步词'}:{...w,group:'起步补充 · 阅读写作'};
}),...SYLLABUS_WORDS.filter(w=>!STARTER_WORDS.some(s=>termKey(s.term)===termKey(w.term))).sort((a,b)=>a.level-b.level)];
// A user's own word replaces the matching bundled card, retaining its custom ID and progress.
// This view-only merge never migrates, deletes or rewrites browser storage.
export function mergeVocabulary(customWords=[]){
 const custom=new Map(customWords.map(w=>[termKey(w.term),w]));
 const result=BUNDLED_WORDS.map(w=>custom.has(termKey(w.term))?{...w,...custom.get(termKey(w.term)),group:w.group,meaningSource:'我的笔记'}:w);
 const baseKeys=new Set(BUNDLED_WORDS.map(w=>termKey(w.term)));
 return [...result,...customWords.filter(w=>!baseKeys.has(termKey(w.term)))];
}
