// node tests.cjs — 測 index.html 內 ENGINE 與 TEACH 區塊
const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const grab=n=>html.split(`/*${n}-START*/`)[1].split(`/*${n}-END*/`)[0];
const ctx={};vm.createContext(ctx);
vm.runInContext(grab('ENGINE')+grab('TEACH')+';this.PADIS=PADIS;this.TEACH=TEACH;',ctx);
const {PADIS:E,TEACH:T}=ctx;
let pass=0,fail=0;
const eq=(a,b,m)=>{const x=JSON.stringify(a),y=JSON.stringify(b);if(x===y)pass++;else{fail++;console.log('FAIL',m,'got',x,'want',y);}};
const rec=p=>E.caseRec(p);

// 疼痛
eq(E.painRes(rec({pain:{tool:'cpot',cpot:{face:1,body:1,vent:0,musc:0}}})).pos,false,'CPOT 2 neg');
eq(E.painRes(rec({pain:{tool:'cpot',cpot:{face:1,body:1,vent:1,musc:0}}})).pos,true,'CPOT 3 pos');
eq(E.painRes(rec({pain:{tool:'cpot',cpot:{face:2,body:2,vent:2,musc:2}}})).score,8,'CPOT max');
eq(E.painRes(rec({pain:{tool:'cpot',cpot:{face:1}}})),null,'CPOT incomplete');
eq(E.painRes(rec({pain:{tool:'bps',bps:{face:0,limb:0,vent:0}}})).score,3,'BPS min');
eq(E.painRes(rec({pain:{tool:'bps',bps:{face:3,limb:3,vent:3}}})).score,12,'BPS max');
eq(E.painRes(rec({pain:{tool:'bps',bps:{face:1,limb:1,vent:0}}})).pos,false,'BPS 5 neg');
eq(E.painRes(rec({pain:{tool:'bps',bps:{face:1,limb:1,vent:1}}})).pos,true,'BPS 6 pos');
eq(E.painRes(rec({vent:false,pain:{tool:'bps',bps:{face:0,limb:0,vent:0}}})).label,'BPS-NI','BPS-NI label');
eq(E.painRes(rec({pain:{tool:'nrs',nrs:3}})).pos,false,'NRS 3');eq(E.painRes(rec({pain:{tool:'nrs',nrs:4}})).pos,true,'NRS 4');
eq(E.painRes(rec({pain:{tool:'nrs',nrs:0}})).score,0,'NRS 0 is scored');
// 插管切換清掉不同項目的舊分數
{const r=rec({pain:{tool:'cpot',cpot:{face:0,body:0,vent:2,musc:0}}});E.setVent(r,false);eq(r.vent,false,'vent off');eq(E.painRes(r),null,'vent item cleared');
 r.pain.cpot.vent=1;E.setVent(r,false);eq(r.pain.cpot.vent,1,'same state keeps score');}
// RASS
for(const [v,t,want] of [['-2','light','in'],['+1','light','in'],['-3','light','deep'],['+2','light','agit'],['0','calm','in'],['-2','calm','deep'],['-4','deep','in'],['-5','deep','in'],['-3','deep','agit']])
 eq(!!E.rassRes(rec({rass:{v,target:t}}))[want],true,`RASS ${v} ${t}`);
// CAM-ICU
const cam=(v,c)=>E.camRes(rec({rass:{v},cam:c}));
eq(E.camRes(rec({})).s,'needRass','no RASS');
eq(cam('-4',{}).s,'utc','-4 utc');eq(cam('-5',{}).s,'utc','-5 utc');eq(cam('-3',{}).s,'inc','-3 assessable');
eq(cam('0',{f1:'n'}).s,'neg','F1 neg');
eq(cam('0',{f1:'y',squeeze:[1,4,6,7]}).s,'neg','perfect');
eq(cam('0',{f1:'y',squeeze:[1,4,6,7]}).errs,0,'0 errs');
eq(cam('+1',{f1:'y',squeeze:[1,4]}).s,'neg','2 errs neg');
eq(cam('+1',{f1:'y',squeeze:[1]}).s,'pos','3 errs & RASS≠0');
eq(cam('0',{f1:'y',squeeze:[1]}).s,'inc','RASS 0 → F4');
eq(cam('0',{f1:'y',squeeze:[1]}).at,4,'at F4');
const good=['n','y','n','y'];
eq(cam('0',{f1:'y',squeeze:[1],q:good,cmd:'ok'}).s,'neg','F4 0 err');
eq(cam('0',{f1:'y',squeeze:[1],q:good,cmd:'err'}).s,'neg','F4 1 err');
eq(cam('0',{f1:'y',squeeze:[1],q:['y','y','n','y'],cmd:'err'}).s,'pos','F4 2 err');
eq(cam('0',{f1:'y',squeeze:[1],q:['y','n','y','n'],cmd:'ok'}).e4,4,'F4 all wrong');
// CAM-ICU 訓練手冊
eq(E.SEQS.num.map(x=>x==='1'),E.SEQS.let.map(x=>x==='A'),'數字與字母目標位置相同');
eq(E.SEQS.num.join(''),'8175141136','繁中序列');
eq(/每 3 秒/.test(html),true,'每 3 秒唸一個');eq(/每秒一個/.test(html),false,'舊速度已移除');
eq(cam('0',{f1:'y',squeeze:[]}).errs,4,'完全沒握 4 錯');eq(cam('+1',{f1:'y',squeeze:[]}).s,'pos','完全沒握陽性');
eq(cam('0',{f1:'y',pic:'neg'}).s,'neg','圖片陰性');eq(cam('+1',{f1:'y',pic:'pos'}).s,'pos','圖片陽性');
eq(cam('+1',{f1:'y',squeeze:[],pic:'neg'}).s,'neg','兩者都做以圖片為準');
eq(cam('0',{f1:'y',squeeze:[1],q:good,cmd:'na'}).s,'neg','無法做指令 問題全對');
eq(cam('0',{f1:'y',squeeze:[1],q:['y','y','n','y'],cmd:'na'}).s,'neg','無法做指令 1 錯');
eq(cam('0',{f1:'y',squeeze:[1],q:['y','n','n','y'],cmd:'na'}).s,'pos','無法做指令 2 錯');
eq(cam('0',{f1:'y',squeeze:[1],qset:'B',q:['y','n','y','n'],cmd:'ok'}).e4,0,'B 組全對');
eq(cam('0',{f1:'y',squeeze:[1],qset:'B',q:['n','y','y','n'],cmd:'ok'}).s,'pos','B 組 2 錯');
eq(cam('-3',{f1:'y',squeeze:[]}).s,'pos','RASS −3 可評估');
eq(E.newRec().cam.seq,'num','預設數字');eq(E.caseRec({cam:{f1:'y'}}).cam.seq,'let','病例用字母');
eq(E.normRec({cam:{cmd:'na',qset:'B',pic:'pos',seq:'let'}}).cam.cmd,'na','norm na');
// ICDSC
const ic=(n,extra)=>{const o={};E.ICDSC.forEach(([k],i)=>o[k]=i<n?1:0);return E.icdscRes(rec({icdsc:o,...extra}));};
eq(ic(0).s,'neg','ICDSC 0');eq(ic(1).s,'sub','ICDSC 1');eq(ic(3).s,'sub','ICDSC 3');eq(ic(4).s,'pos','ICDSC 4');eq(ic(8).score,8,'ICDSC 8');
eq(ic(4,{rass:{v:'-4'}}).s,'utc','ICDSC utc');eq(E.icdscRes(rec({icdsc:{loc:1}})).s,'inc','ICDSC inc');
// 班別時序：大夜 → 白班 → 小夜
eq([0,7,8,15,16,23].map(E.curShift),['N','N','D','D','E','E'],'curShift');
const rk=E.shiftRank;
eq(rk('2026-11-05','N')<rk('2026-11-05','D'),true,'N before D');
eq(rk('2026-11-05','D')<rk('2026-11-05','E'),true,'D before E');
eq(rk('2026-11-04','E')<rk('2026-11-05','N'),true,'E before next N');
eq(rk('2026-11-05','N')-rk('2026-11-04','E'),1,'adjacent');
eq(rk('2026-03-01','N')-rk('2026-02-28','E'),1,'month rollover');
const mk=(t)=>{const r=E.newRec();r.rass.target=t;return r;};
const store={'2026-11-04|N|1':mk('a'),'2026-11-04|E|1':mk('b'),'2026-11-05|N|1':mk('c'),'2026-11-05|N|11':mk('x')};
eq(E.findPrev(store,'1','2026-11-05','D').rec.rass.target,'c','白班沿用今天大夜');
eq(E.findPrev(store,'1','2026-11-05','N').rec.rass.target,'b','大夜沿用昨天小夜');
eq(E.findPrev(store,'1','2026-11-04','N'),null,'no earlier');
eq(E.findPrev(store,'11','2026-11-05','D').rec.rass.target,'x','bed 11 separate');
eq(E.findPrev(store,'1','2026-11-08','D'),null,'older than 48 h not carried');
eq(E.bedHistory(store,'1').map(o=>o.k),['2026-11-05|N|1','2026-11-04|E|1','2026-11-04|N|1'],'history order');
// 容錯
eq(E.normRec(null).rass.target,'light','norm null');
eq(E.normRec({pain:5,rass:{v:'bad',target:'zz'},cam:{let:[1]}}).rass.v,null,'norm bad');
eq(E.normRec({cam:{let:[1]}}).cam.let.length,10,'norm let');
{const s=E.normStore({tab:'X',beds:[1,2],bed:9,rec:{bad:{}, '2026-11-05|D|1':{}}});eq(s.tab,'P','bad tab');eq(s.beds,['1','2'],'bed strings');eq(s.bed,'1','bad bed');eq(Object.keys(s.rec),['2026-11-05|D|1'],'bad key dropped');}
eq(E.normStore(null).beds.length,12,'empty store');
eq(E.hasData(E.newRec()),false,'blank');
{const r=E.newRec();r.pain.tool='bps';r.agents.prop=true;eq(E.hasData(r),false,'tool/agent only');r.rass.v='0';eq(E.hasData(r),true,'has RASS');}
{const r=E.newRec();r.pain.nrs=0;eq(E.hasData(r),true,'NRS 0 counts');}
// 用藥建議
const adv=p=>E.sedAdvice(rec(p)).join(' ');
eq(/優於 propofol/.test(adv({agents:{prop:true}})),true,'dex>prop on vent');
eq(/以外的鎮靜藥/.test(adv({rass:{target:'deep'}})),true,'deep other');
eq(/優於 propofol/.test(adv({rass:{target:'deep'}})),false,'deep no dex');
eq(/機械通氣病人；未插管/.test(adv({vent:false,agents:{prop:true}})),true,'non-vent caveat');
eq(/優於 propofol/.test(adv({vent:false})),false,'non-vent no dex claim');
eq(/沒有持續鎮靜/.test(adv({agents:{none:true}})),true,'none');
eq(/驟停/.test(adv({agents:{bzd:true}})),true,'bzd');
eq(/analgosedation/.test(adv({agents:{opioid:true}})),true,'opioid');
// 活動
eq(E.mobNeuro(null),null,'mob null');
eq(['+3','+2','+1','0','-1','-2','-3','-5'].map(v=>E.mobNeuro(v).lv),['red','caution','ok','ok','ok','caution','oob','oob'],'mob levels');
eq(/≥90%/.test(E.MOB_SAFE[1][2]),true,'SpO2 per Hodgson');eq(/88/.test(E.MOB_SAFE[1][2]),false,'no 88');

// 示範病例
eq(T.CASES.length,6,'6 cases');eq(new Set(T.CASES.map(c=>c.id)).size,6,'case ids');
T.CASES.forEach(c=>{const r=E.caseRec(c.patch),n=c.id;
 eq(E.normRec(JSON.parse(JSON.stringify(r))),JSON.parse(JSON.stringify(r)),n+' round-trip');
 if(c.expect.pain){const p=E.painRes(r);eq(p&&p.score,c.expect.pain.score,n+' pain');eq(p&&p.pos,c.expect.pain.pos,n+' pain pos');}
 Object.keys(c.expect.rass).forEach(k=>eq(E.rassRes(r)[k],c.expect.rass[k],n+' rass '+k));
 eq(E.delRes(r).s,c.expect.del,n+' delirium');
 ['stem','reads','plan','points'].forEach(k=>eq(c[k].length>0,true,n+' '+k));
 eq(/[?？]$/.test(c.title)||c.title.length>0,true,n+' title');
});
eq(E.DEEP_WHY.includes(T.CASES[4].patch.rass.why),true,'c5 why in list');
Object.keys(T.CASES[5].patch.sleep).forEach(k=>eq(E.SLEEP.some(a=>a[0]===k),true,'c6 sleep key '+k));
Object.keys(T.CASES[5].patch.icdsc).forEach(k=>eq(E.ICDSC.some(a=>a[0]===k),true,'c6 icdsc key '+k));

// 考題
const Q=T.QUIZ;
eq(Q.length,20,'20 Q');eq(Q.filter(q=>q.lv==='基礎').length,10,'10 basic');eq(Q.filter(q=>q.lv==='高階').length,10,'10 adv');
eq(Q.slice(0,10).every(q=>q.lv==='基礎'),true,'basic first');
const cnt=[0,0,0,0];Q.forEach(q=>cnt[q.a]++);eq(cnt,[5,5,5,5],'A–D 5 each');
Q.forEach((q,i)=>{eq(q.o.length,4,`Q${i+1} opts`);eq(new Set(q.o).size,4,`Q${i+1} unique`);eq(!!(q.why&&q.src),true,`Q${i+1} why`);});
const longest=Q.filter(q=>q.o.every((o,j)=>j===q.a||o.length<q.o[q.a].length)).length;
console.log('正解是最長選項：',longest,'/ 20');eq(longest>=2&&longest<=6,true,'correct length gives no cue');
// 考題與引擎交叉驗證
eq(Q[1].o[Q[1].a],'0–8，≥3','Q2');eq(E.painRes(rec({pain:{tool:'cpot',cpot:{face:2,body:2,vent:2,musc:2}}})).max,8,'Q2 engine');
eq(E.RASS.find(a=>a[0]==='-2')[2].includes('<10'),true,'Q5 engine');eq(Q[4].o[Q[4].a],'−2','Q5');
eq(Q[5].o[Q[5].a],'−4 或 −5','Q6');
eq(ic(2).s,'sub','Q8 engine');eq(Q[7].o[Q[7].a],'亞症候群譫妄','Q8');
eq(cam('0',{f1:'y',squeeze:[1],q:['y','y','n','y'],cmd:'ok'}).s,'neg','Q15 engine');eq(/陰性/.test(Q[14].o[Q[14].a]),true,'Q15');
eq(E.letErrors(rec({cam:{squeeze:[0,1,4,9]}}).cam),4,'Q16 engine');eq(Q[15].o[Q[15].a],'4 個','Q16');
// 心智圖
eq(T.MAP.map(b=>b.k),['P','A','S','D','I','Z'],'map branches');
T.MAP.forEach(b=>eq(['P','S','D','M','Z'].includes(b.go),true,b.k+' go'));
// 頁面
eq(/ICU-sedation\//.test(html),false,'no wrong url in html');
console.log(`${pass} passed, ${fail} failed`);process.exit(fail?1:0);
