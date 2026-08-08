var Z=Object.defineProperty;var V=(r,t,e)=>t in r?Z(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var D=(r,t,e)=>V(r,typeof t!="symbol"?t+"":t,e);const Y="te-whare-tapa-wha-assessment",Q=[{id:"tinana",name:"Physical wellbeing",maoriName:"Taha tinana",description:"How your body feels and how you care for it — movement, rest, nourishment, and physical strength.",descriptionMi:"He aha tō kiko e noho nei, me tūpato koe i a ia — neke, moemoeā, kaiponu, me kaha tinana.",prompt:"What does looking after your tinana mean for you right now?",promptMi:"He aha te tikanga o tūpato i tō tinana mō koe kei ināianei?"},{id:"hinengaro",name:"Mental and emotional wellbeing",maoriName:"Taha hinengaro",description:"Your thoughts, feelings, and how you make sense of the world. Clear thinking and expressing what is going on inside.",descriptionMi:"Ōu whakaaro, ōu rongo, me tūpato koe i te ao. Whakaaro clear me āwhina i te mea e noho nei ki roto.",prompt:"How are your thoughts and feelings sitting with you at the moment?",promptMi:"He aha ōu whakaaro me rongo e noho nei mā koe pēlā?"},{id:"wairua",name:"Spiritual wellbeing",maoriName:"Taha wairua",description:"Your sense of meaning, connection to something greater, values, identity, and what gives your life purpose.",descriptionMi:"Tō whakapono o tētahi, hononga ki tētahi mea nui, āhua, whakapono, me te mea e homai nei he-āhua ki tō ao.",prompt:"What gives your life meaning or a sense of connection right now?",promptMi:"He aha e homai nei he-āhua ki tō ao rānei hononga kei ināianei?"},{id:"whanau",name:"Family and social wellbeing",maoriName:"Taha whānau",description:"The people you belong with — family, friends, community, and the relationships that support and shape you.",descriptionMi:"Ngā tāngata e tūpato ana koe — whānau, hoa, hapai, me ngā whakapā e tautoko ana me āhua koe.",prompt:"Who helps you feel you belong, and how are those connections for you?",promptMi:"Ko wai e āwhina ana kia tūpato koe, me he aha āu hononga?"}],R=()=>Q.map(r=>({...r,score:3,reflection:""})),H=r=>r.map(t=>({...t})),tt=()=>{try{const r=localStorage.getItem(Y);if(r){const t=JSON.parse(r);if(t.domains&&Array.isArray(t.domains))return{domains:t.domains}}}catch{}return null},B=r=>{try{localStorage.setItem(Y,JSON.stringify({domains:[...r]}))}catch{}},et=()=>{try{const r=localStorage.getItem(Y);if(r){const t=JSON.parse(r);if(t.domains&&Array.isArray(t.domains))return{domains:t.domains}}}catch{}return null},at=r=>{if(!Array.isArray(r))throw new Error("Invalid import data: domains must be an array");const t=["id","name","maoriName","description","prompt","score"];for(const e of r){for(const s of t)if(!Object.prototype.hasOwnProperty.call(e,s))throw new Error(`Invalid domain: missing required field "${s}"`);const a=e.score;if(typeof a!="number"||a<1||a>5)throw new Error("Invalid domain: score must be between 1 and 5")}try{localStorage.setItem(Y,JSON.stringify({domains:[...r]}))}catch{}},st=()=>{try{localStorage.removeItem(Y)}catch{}},q="te-whare-tapa-wha-language",nt=()=>{try{const r=localStorage.getItem(q);if(r==="en"||r==="mi")return r}catch{}return null},ot=r=>{try{localStorage.setItem(q,r)}catch{}},it=r=>{const t=r/2;return`
    <circle cx="${t}" cy="${t}" r="120" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.15"/>
    <circle cx="${t}" cy="${t}" r="90" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.12"/>
    <circle cx="${t}" cy="${t}" r="60" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.1"/>
    <path d="M${t},50 L${t+70},100 L${t+70},170 L${t},220 L${t-70},170 L${t-70},100 Z" fill="none" stroke="var(--chart-bg-custom)" stroke-width="1.2" opacity="0.1"/>
    <path d="M${t},80 L${t+40},110 L${t+40},160 L${t},190 L${t-40},160 L${t-40},110 Z" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.8" opacity="0.08"/>`},rt=(r,t)=>{const e=r/2,a=110,s=5,i=t.length,c=Math.PI*2/i,m=-Math.PI/2,p="var(--chart-value-level-stroke)",y=[];for(let g=1;g<=s;g++){const S=g/s*a,$=[];for(let x=0;x<i;x++){const f=m+x*c,b=e+S*Math.cos(f),L=e+S*Math.sin(f);$.push(`${b.toFixed(2)},${L.toFixed(2)}`)}y.push(`<polygon points="${$.join(" ")}" fill="none" stroke="${p}" stroke-width="1" opacity="0.35" data-chart-level="${g}" style="pointer-events: auto;" />`)}return y.join("")},F=(r,t)=>{const e=document.getElementById(r);if(!e)return;const a=280,s=a/2,i=110,c=5,m=t.length,p=Math.PI*2/m,y=-Math.PI/2,g=t.map((h,u)=>{const d=y+u*p,l=h.score/5*i;return{x:s+l*Math.cos(d),y:s+l*Math.sin(d),labelX:s+(i+28)*Math.cos(d),labelY:s+(i+28)*Math.sin(d),domain:h}}),S=Array.from({length:c},(h,u)=>{const d=c-u,l=d/c*i;return`<polygon points="${Array.from({length:m},(v,T)=>{const N=y+T*p;return`${s+l*Math.cos(N)},${s+l*Math.sin(N)}`}).join(" ")}" class="chart-level level-${d}" />`}).join(""),$=Array.from({length:m},(h,u)=>{const d=y+u*p,l=s+i*Math.cos(d),k=s+i*Math.sin(d);return`<line x1="${s}" y1="${s}" x2="${l}" y2="${k}" class="chart-axis" />`}).join(""),f=`<polygon points="${g.map(h=>`${h.x},${h.y}`).join(" ")}" class="chart-data" />`,b=g.map(h=>`<circle cx="${h.x}" cy="${h.y}" r="8" class="chart-dot" data-domain="${h.domain.id}" />`).join(""),L=g.map(h=>{const u=h.domain.maoriName.replace("Taha ","");return`<text x="${h.labelX}" y="${h.labelY}" class="chart-label" text-anchor="middle" dominant-baseline="middle">${u}</text>`}).join(""),A=Array.from({length:c},(h,u)=>{const d=u+1,l=d/c*i,k=y,v=s+l*Math.cos(k)+10,T=s+l*Math.sin(k);return`<text x="${v}" y="${T}" class="chart-level-label">${d}</text>`}).join(""),E=it(a),M=rt(a,t);e.innerHTML=`
    <svg viewBox="0 0 ${a} ${a}" width="100%" height="100%" class="radar-svg" aria-hidden="true">
      <g class="chart-bg-custom" aria-hidden="true">
        ${E}
      </g>
      <g class="chart-value-level-polygons" aria-hidden="true">
        ${M}
      </g>
      <g class="chart-bg">
        ${S}
        ${$}
      </g>
      ${f}
      ${b}
      ${L}
      ${A}
    </svg>`},J="en",ct=(r,t)=>t?r.replace(/\{(\w+)\}/g,(e,a)=>Object.prototype.hasOwnProperty.call(t,a)?String(t[a]):e):r,K={en:{"common.and":" and ","lang.selectTitle":"Choose your language","lang.selectSubtitle":"Select a language to begin","lang.option.en":"English","lang.option.mi":"Māori","lang.selectButton":"Start","welcome.subtitle":"A wellbeing reflection","welcome.intro1":"Te Whare Tapa Whā is a model of hauora developed by Sir Mason Durie. It describes four walls of a house, each representing a dimension of wellbeing. When the walls are strong and balanced, the house stands well.","welcome.intro2":"This tool is for personal reflection and conversation. It is not a diagnosis or clinical assessment. The meaning of each score belongs to you.","welcome.note":"This is a digital interpretation of the framework, offered with respect.","welcome.startButton":"Begin reflection","assessment.progressLabel":"Progress","assessment.stepOf":"Step {step} of {total}","assessment.startOver":"Start over","assessment.scoreLabel":"Where do you sit right now?","assessment.scoreFormat":" / 5","assessment.reflectionPlaceholder":"Your thoughts (optional)","assessment.chartTitle":"Your current shape","assessment.chartNote":"The shape updates as you move the slider. Stronger areas sit further out.","assessment.chartScoreAria":"Score for {name}","chart.liveAriaLabel":"Radar chart showing current wellbeing scores","chart.summaryAriaLabel":"Radar chart of your wellbeing scores","chart.fullscreenTitle":"Assessment chart","nav.back":"Back","nav.next":"Next","nav.seeSummary":"See summary","summary.title":"Your reflection","summary.subtitle":"A snapshot of where you sit right now","summary.scoreEven":"Your scores sit evenly across all four dimensions.","summary.scoreBalanced":"Your shape is fairly balanced, with only small differences between dimensions.","summary.scoreSpread":"Stronger areas include {strongest}. Areas sitting lower include {softest}.","summary.noNotes":"No notes added.","summary.edit":"Edit","summary.disclaimer":"This is a personal reflection tool based on Te Whare Tapa Whā. The scores and shape are yours to interpret. They do not replace professional support or conversation with people you trust.","summary.backToEdit":"Back to edit","summary.print":"Print or save as PDF","summary.startNew":"Start a new reflection","summary.avgNote":"Average across dimensions: {avg}","export.download":"Export assessment data","export.button":"Export","export.title":"Export your reflection","export.description":"Review your assessment data below, then download it as a JSON file.","export.downloadButton":"Download JSON file","export.back":"Back to summary","import.button":"Import","import.error":"Import failed. Please check the file format.","dialog.resetConfirm":"Start a new reflection? Your current scores and notes will be cleared."},mi:{"common.and":" me ","lang.selectTitle":"Whiriwhi i tō reo","lang.selectSubtitle":"Whiriwhi tētahi reo kia tīmata","lang.option.en":"English","lang.option.mi":"Māori","lang.selectButton":"Tīmata","welcome.subtitle":"He whakamātautautā hauora","welcome.intro1":"He taua hauora a Te Whare Tapa Whā, āwhakapapaia e Sir Mason Durie. E whakamārama ana i ngā pakaranga e whā o te whare, ko tētahi e tohutupu ana i tētahi ara hauora. Ki te kaha me tūturu ngā pakaranga, ka tūpato te whare.","welcome.intro2":"Ko tēnei taputapu he whakamātautautā motu-motu me kōrero. Kāore i tētahi whakapa rānei aromātakitanga kiriti. Ko te tikanga o tētahi tūtohi ke tōu.","welcome.note":"He whakamārama tuihāpai tōnei, āwhinatia ki te whakapono.","welcome.startButton":"Tīmata i te whakamātautautā","assessment.progressLabel":"Hāpai","assessment.stepOf":"Tūtohi {step} o {total}","assessment.startOver":"Tīmata anō","assessment.scoreLabel":"He aha tō āhua o ināianei?","assessment.scoreFormat":" / 5","assessment.reflectionPlaceholder":"Āu whakaaro (kōwhiri)","assessment.chartTitle":"Ko tō āhua o ināianei","assessment.chartNote":"Ka whakahoua tēnei āhua he rite i te tīmata o te koro. Ko ngā wāhi kaha kei tua.","assessment.chartScoreAria":"Tūtohi {name}","chart.liveAriaLabel":"Kahikātea radar e whaguanitia ana i ngā tūtohi hauora o ināianei","chart.summaryAriaLabel":"Kahikātea radar o āu tūtohi hauora","chart.fullscreenTitle":"Tūtohi aromātakitanga","nav.back":"Hoki","nav.next":"Panoni","nav.seeSummary":"Tirohanga mātautautā","summary.title":"Tō whakamātautautā","summary.subtitle":"He tirohanga o te wāhi e noho ana koe","summary.scoreEven":"Ke tūpato ō tūtohi i runga i ngā ara e whā.","summary.scoreBalanced":"He āhua tūturu rawa tō āhua, me pāmamahi iti noa i waenganui i ngā ara.","summary.scoreSpread":"Ko ngā wāhi kaha e whāngai ana i {strongest}. Ko ngā wāhi ponaku kei raro e whāngai ana i {softest}.","summary.noNotes":"Kāore he kōrero anō.","summary.edit":"Whakatika","summary.disclaimer":"He taputapu whakamātautautā motu-motu tōnei, āhono i te Whare Tapa Whā. Ko ngā tūtohi me te āhua ke tōu mā te whakapono. Kāore e korekorehu i te tautoko pūkenga rānei kōrero me ngā tāngata e whakapono ana koe.","summary.backToEdit":"Hoki ki te whakatika","summary.print":"Tāpata i te mātaitai","summary.startNew":"Tīmata whakamātautautā hou","summary.avgNote":"Neutoti i waenganui i ngā ara: {avg}","export.download":"Kawea i ngā raraunga aromātakitanga","export.button":"Kawea","export.title":"Kawea tō whakamātautautā","export.description":"Tirohia ō raraunga aromātakitanga ki raro, kātahi ka kukuhia hei kōnae JSON.","export.downloadButton":"Kukuhia te kōnae JSON","export.back":"Hoki ki te whakarāpopotanga","import.button":"Kuhu","import.error":"I rahua te kuhu. Tēnā whakamātau anō i te hōtuku.","dialog.resetConfirm":"Tīmata whakamātautautā hou? Ka konta o tūtohi me kōrero o ināianei."}},o=(r,t=J,e)=>{const s=(K[t]??K.en)[r]??K.en[r]??r;return ct(s,e)},n=r=>{const t=document.createElement("div");return t.textContent=r,t.innerHTML},X=()=>{var r;return typeof navigator<"u"&&((r=navigator.language)!=null&&r.startsWith("mi"))?"mi":J};class lt{constructor(){D(this,"state");D(this,"language");D(this,"showLanguageSelector");D(this,"showExportScreen",!1);D(this,"showFullscreenChart",!1);D(this,"domainName",t=>this.language==="mi"?t.maoriName:t.name);D(this,"domainDescription",t=>this.language==="mi"?t.descriptionMi??t.description:t.description);D(this,"domainPrompt",t=>this.language==="mi"?t.promptMi??t.prompt:t.prompt);const t=nt();this.language=t??X(),this.showLanguageSelector=t===null;const e=tt();this.state={domains:(e==null?void 0:e.domains)??R(),currentStep:0,showSummary:!1},this.init()}init(){this.updateHtmlLang(),this.render(),this.bindEvents()}updateHtmlLang(){document.documentElement.setAttribute("lang",this.language)}bindEvents(){document.addEventListener("click",t=>{const e=t.target;if(e.matches('[data-action="select-lang"]')){const a=e.getAttribute("data-lang");this.setLanguage(a);return}if(e.matches('[data-action="start"]')&&(this.state={domains:H(this.state.domains),currentStep:1,showSummary:!1},this.render()),e.matches('[data-action="next"]')&&(this.state.currentStep<this.state.domains.length?this.state={domains:H(this.state.domains),currentStep:this.state.currentStep+1,showSummary:!1}:this.state={domains:H(this.state.domains),currentStep:this.state.domains.length,showSummary:!0},this.render()),e.matches('[data-action="prev"]')&&(this.state.showSummary?this.state={domains:H(this.state.domains),currentStep:this.state.domains.length,showSummary:!1}:this.state.currentStep>1&&(this.state={domains:H(this.state.domains),currentStep:this.state.currentStep-1,showSummary:!1}),this.render()),e.matches('[data-action="reset"]')&&confirm(o("dialog.resetConfirm",this.language))&&(st(),this.state={domains:R(),currentStep:0,showSummary:!1},this.render()),e.matches('[data-action="print"]')&&window.print(),e.matches('[data-action="export"]')){this.showExportScreen=!0,this.render();return}if(e.matches('[data-action="export-download"]')){const a=et();if(a){const s=new Blob([JSON.stringify(a)],{type:"application/json"}),i=URL.createObjectURL(s),c=document.createElement("a");c.href=i,c.download="te-whare-tapa-wha-assessment.json",c.click(),URL.revokeObjectURL(i)}return}if(e.matches('[data-action="export-back"]')){this.showExportScreen=!1,this.render();return}if(e.matches('[data-action="chart-expand"]')){this.showFullscreenChart=!0,this.render();return}if(e.matches('[data-action="chart-close"]')){this.showFullscreenChart=!1,this.render();return}if(e.matches(".chart-value-level-polygons polygon")){const a=parseInt(e.getAttribute("data-chart-level")||"0",10);if(a>=1&&a<=5&&this.state.currentStep>0&&!this.state.showSummary){const s=this.state.domains[this.state.currentStep-1];s&&(s.score=a,B(this.state.domains),this.render())}return}if(e.matches('[data-action="import"]')){const a=document.querySelector("[data-import-input]");a==null||a.click()}if(e.matches('[data-action="edit"]')){const a=e.getAttribute("data-domain");if(a){const s=this.state.domains.findIndex(i=>i.id===a);s>=0&&(this.state={domains:H(this.state.domains),currentStep:s+1,showSummary:!1},this.render())}}}),document.addEventListener("mousedown",t=>{const e=t.target;if(e.matches(".chart-dot")){const a=e.getAttribute("data-domain");if(a&&this.state.currentStep>0&&!this.state.showSummary){const s=this.state.domains[this.state.currentStep-1];s&&s.id===a&&this.startDotDrag(t,a)}return}if(e.matches(".chart-data")){this.state.currentStep>0&&!this.state.showSummary&&this.startChartDrag(t);return}}),document.addEventListener("touchstart",t=>{const e=t.target;if(e.matches(".chart-dot")){const a=e.getAttribute("data-domain");if(a&&this.state.currentStep>0&&!this.state.showSummary){const s=this.state.domains[this.state.currentStep-1];s&&s.id===a&&this.startDotDrag(t,a)}return}if(e.matches(".chart-data")){this.state.currentStep>0&&!this.state.showSummary&&this.startChartDrag(t);return}},{passive:!1}),document.addEventListener("input",t=>{const e=t.target;if(e.matches("[data-score]")){const a=e.getAttribute("data-score"),s=this.state.domains.find(i=>i.id===a);if(s){const i=Math.max(1,Math.min(5,parseInt(e.value,10)||1));s.score=i,B(this.state.domains),this.updateChart(),this.updateScoreDisplay(a,i)}}if(e.matches("[data-reflection]")){const a=e.getAttribute("data-reflection"),s=this.state.domains.find(i=>i.id===a);s&&(s.reflection=e.value,B(this.state.domains))}}),document.addEventListener("change",t=>{var a;const e=t.target;if(e.matches("[data-import-input]")){const s=(a=e.files)==null?void 0:a[0];if(s){const i=new FileReader;i.onload=()=>{try{const c=JSON.parse(i.result);at(c.domains),this.state={domains:H(c.domains),currentStep:0,showSummary:!1},this.render()}catch{alert(o("import.error",this.language))}},i.readAsText(s)}}})}setLanguage(t){this.language=t,this.showLanguageSelector=!1,ot(t),this.updateHtmlLang(),this.render()}updateScoreDisplay(t,e){const a=document.querySelector('[data-score-value="'+t+'"]');a&&(a.textContent=String(e))}updateSlider(t,e){const a=document.querySelector(`input[type="range"][data-score="${t}"]`);a&&(a.value=String(e),a.setAttribute("aria-valuenow",String(e)))}addDragClass(){const t=document.querySelector(".radar-svg");t&&t.classList.add("chart-dragging")}removeDragClass(){const t=document.querySelector(".radar-svg");t&&t.classList.remove("chart-dragging")}startDotDrag(t,e){const a=document.querySelector(".radar-svg");if(!a)return;const s=a.getBoundingClientRect(),i=280,c=i/2,m=110,p=this.state.domains[this.state.currentStep-1];if(!p||this.state.domains.findIndex(u=>u.id===e)<0)return;const g="touches"in t?t.touches[0].clientX:t.clientX,S="touches"in t?t.touches[0].clientY:t.clientY,$=(g-s.left)/(s.width??i)*i,x=(S-s.top)/(s.height??i)*i,f=$-c,b=x-c,L=Math.sqrt(f*f+b*b),A=Math.max(0,Math.min(L,m)),E=Math.max(1,Math.min(5,Math.round(A/m*5)));E!==p.score&&(p.score=E,B(this.state.domains),this.updateChart(),this.updateScoreDisplay(e,E),this.updateSlider(e,E)),this.addDragClass();const M=u=>{u.preventDefault();const d="touches"in u?u.touches[0].clientX:u.clientX,l="touches"in u?u.touches[0].clientY:u.clientY,k=(d-s.left)/(s.width??i)*i,v=(l-s.top)/(s.height??i)*i,T=k-c,N=v-c,O=Math.sqrt(T*T+N*N),w=Math.max(0,Math.min(O,m)),C=Math.max(1,Math.min(5,Math.round(w/m*5)));C!==p.score&&(p.score=C,B(this.state.domains),this.updateChart(),this.updateScoreDisplay(e,C),this.updateSlider(e,C))},h=()=>{this.removeDragClass(),document.removeEventListener("mousemove",M),document.removeEventListener("mouseup",h),document.removeEventListener("touchmove",M),document.removeEventListener("touchend",h)};document.addEventListener("mousemove",M),document.addEventListener("mouseup",h),document.addEventListener("touchmove",M,{passive:!1}),document.addEventListener("touchend",h)}startChartDrag(t){const e=document.querySelector(".radar-svg");if(!e)return;const a=e.getBoundingClientRect(),s=280,i=s/2,c=110,m=this.state.domains,p=this.state.currentStep;if(p<=0||this.state.showSummary||!m[p-1])return;const g="touches"in t?t.touches[0].clientX:t.clientX,S="touches"in t?t.touches[0].clientY:t.clientY;console.log("startChartDrag",g,S,"rect:",a.left,a.top,a.width,a.height);const $=(g-a.left)/(a.width??s)*s,x=(S-a.top)/(a.height??s)*s,f=$-i,b=x-i,L=Math.atan2(b,f),A=m.length,E=Math.PI*2/A,M=-Math.PI/2;let h=0,u=1/0;for(let w=0;w<A;w++){const C=M+w*E;let I=Math.abs(L-C);I>Math.PI&&(I=2*Math.PI-I),I<u&&(u=I,h=w)}const d=m[h],l=d.id,k=Math.sqrt(f*f+b*b),v=Math.max(0,Math.min(k,c)),T=Math.max(1,Math.min(5,Math.round(v/c*5)));T!==d.score&&(d.score=T,B(this.state.domains),this.updateChart(),this.updateScoreDisplay(l,T),this.updateSlider(l,T)),this.addDragClass();const N=w=>{w.preventDefault();const C="touches"in w?w.touches[0].clientX:w.clientX,I="touches"in w?w.touches[0].clientY:w.clientY,_=(C-a.left)/(a.width??s)*s,U=(I-a.top)/(a.height??s)*s,W=_-i,j=U-i,G=Math.sqrt(W*W+j*j),z=Math.max(0,Math.min(G,c)),P=Math.max(1,Math.min(5,Math.round(z/c*5)));P!==d.score&&(d.score=P,B(this.state.domains),this.updateChart(),this.updateScoreDisplay(l,P),this.updateSlider(l,P))},O=()=>{this.removeDragClass(),document.removeEventListener("mousemove",N),document.removeEventListener("mouseup",O),document.removeEventListener("touchmove",N),document.removeEventListener("touchend",O)};document.addEventListener("mousemove",N),document.addEventListener("mouseup",O),document.addEventListener("touchmove",N,{passive:!1}),document.addEventListener("touchend",O)}updateChart(){document.getElementById("live-chart")&&F("live-chart",this.state.domains),document.getElementById("summary-chart")&&F("summary-chart",this.state.domains)}render(){const t=document.getElementById("app");t&&(this.showLanguageSelector?t.innerHTML=this.renderLanguageSelector():this.showExportScreen?t.innerHTML=this.renderExportScreen():this.state.currentStep===0?t.innerHTML=this.renderWelcome():this.showFullscreenChart?(t.innerHTML=this.renderFullscreenChart(),this.updateFullscreenChart()):this.state.showSummary?(t.innerHTML=this.renderSummary(),this.updateChart()):(t.innerHTML=this.renderAssessment(),this.updateChart()))}renderLanguageSelector(){const t=X(),e=m=>m===t?" selected":"",a=n(o("lang.selectTitle","en")),s=n(o("lang.selectTitle","mi")),i=n(o("lang.selectSubtitle","en")),c=n(o("lang.selectSubtitle","mi"));return`
      <section class="lang-selector" aria-labelledby="lang-select-title">
        <div class="lang-selector-content">
          <h1 id="lang-select-title">
            <span class="lang-mi">${s}</span>
            <span class="lang-en">${a}</span>
          </h1>
          <p class="lang-subtitle">
            <span class="lang-mi">${c}</span>
            <span class="lang-en">${i}</span>
          </p>
          <div class="lang-options" role="radiogroup" aria-label="${n(o("lang.selectTitle",this.language))}">
            <button type="button" class="lang-option${e("en")}" data-action="select-lang" data-lang="en" aria-checked="${t==="en"?"true":"false"}">
              ${n(o("lang.option.en","en"))}
            </button>
            <button type="button" class="lang-option${e("mi")}" data-action="select-lang" data-lang="mi" aria-checked="${t==="mi"?"true":"false"}">
              ${n(o("lang.option.mi","mi"))}
            </button>
          </div>
        </div>
      </section>`}renderWelcome(){return`
      <section class="welcome" aria-labelledby="welcome-title">
        <div class="welcome-content">
          <h1 id="welcome-title">Te Whare Tapa Whā</h1>
          <p class="subtitle">${n(o("welcome.subtitle",this.language))}</p>
          <p class="intro">${n(o("welcome.intro1",this.language))}</p>
          <p class="intro">${n(o("welcome.intro2",this.language))}</p>
          <p class="note">${n(o("welcome.note",this.language))}</p>
          <button type="button" class="btn primary" data-action="start">
            ${n(o("welcome.startButton",this.language))}
          </button>
        </div>
      </section>`}renderAssessment(){const t=this.state.domains[this.state.currentStep-1];if(!t)return"";const e=this.state.currentStep,a=this.state.domains.length,s=n(this.domainDescription(t)),i=n(this.domainPrompt(t)),c=n(o("assessment.scoreLabel",this.language)),m=n(o("assessment.progressLabel",this.language)),p=n(o("assessment.stepOf",this.language,{step:String(e),total:String(a)})),y=n(o("assessment.startOver",this.language)),g=n(o("assessment.reflectionPlaceholder",this.language)),S=n(o("assessment.chartTitle",this.language)),$=n(o("assessment.chartNote",this.language)),x=n(o("assessment.scoreFormat",this.language)),f=n(o("assessment.chartScoreAria",this.language,{name:t.maoriName})),b=n(o("chart.liveAriaLabel",this.language)),L=n(o("nav.back",this.language)),A=n(e===a?o("nav.seeSummary",this.language):o("nav.next",this.language));return`
      <section class="assessment" aria-labelledby="domain-title">
        <header class="assessment-header">
          <div class="progress" role="progressbar" aria-valuenow="${e}" aria-valuemin="1" aria-valuemax="${a}" aria-label="${m}">
            <span class="progress-text">${p}</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${e/a*100}%"></div>
            </div>
          </div>
          <button type="button" class="btn text" data-action="reset">${y}</button>
        </header>

        <div class="assessment-body">
          <div class="domain-panel">
            <h2 id="domain-title">
              <span class="maori">${n(t.maoriName)}</span>
              <span class="english">${n(t.name)}</span>
            </h2>
            <p class="domain-desc">${s}</p>

            <div class="score-control">
              <label for="score-${t.id}">
                ${c} <span class="score-value" data-score-value="${t.id}">${t.score}</span>${x}
              </label>
              <input
                type="range"
                id="score-${t.id}"
                min="1"
                max="5"
                step="1"
                value="${t.score}"
                data-score="${t.id}"
                aria-valuemin="1"
                aria-valuemax="5"
                aria-valuenow="${t.score}"
                aria-label="${f}"
              />
              <div class="score-labels" aria-hidden="true">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>

            <div class="reflection-control">
              <label for="reflection-${t.id}">${i}</label>
              <textarea
                id="reflection-${t.id}"
                data-reflection="${t.id}"
                rows="4"
                placeholder="${g}"
              >${n(t.reflection)}</textarea>
            </div>
          </div>

          <div class="chart-panel">
            <h3 class="chart-title">${S}</h3>
            <button type="button" class="chart-expand-btn" data-action="chart-expand" aria-label="Expand chart">⛶</button>
            <div class="chart-container" id="live-chart" role="img" aria-label="${b}"></div>
            <p class="chart-note">${$}</p>
          </div>
        </div>

        <nav class="assessment-nav">
          <button type="button" class="btn secondary" data-action="prev" ${e===1?"disabled":""}>${L}</button>
          <button type="button" class="btn primary" data-action="next">
            ${A}
          </button>
        </nav>
      </section>`}renderSummary(){const t=this.state.domains,e=t.map(l=>l.score),a=e.reduce((l,k)=>l+k,0)/e.length,s=Math.min(...e),i=Math.max(...e),c=i-s,m=o("common.and",this.language),p=n(o("assessment.scoreFormat",this.language));let y="";if(c===0)y=n(o("summary.scoreEven",this.language));else if(c<=1)y=n(o("summary.scoreBalanced",this.language));else{const l=t.filter(v=>v.score===i).map(v=>this.domainName(v)),k=t.filter(v=>v.score===s).map(v=>this.domainName(v));y=n(o("summary.scoreSpread",this.language,{strongest:l.join(m),softest:k.join(m)}))}const g=n(o("summary.title",this.language)),S=n(o("summary.subtitle",this.language)),$=n(o("summary.noNotes",this.language)),x=n(o("summary.edit",this.language)),f=n(o("summary.disclaimer",this.language)),b=n(o("summary.backToEdit",this.language)),L=n(o("summary.print",this.language)),A=n(o("summary.startNew",this.language)),E=n(o("export.button",this.language)),M=n(o("import.button",this.language)),h=n(o("summary.avgNote",this.language,{avg:a.toFixed(1)})),u=n(o("chart.summaryAriaLabel",this.language)),d=t.map(l=>`
      <article class="summary-card">
        <h3>
          <span class="domain-names">
            <span class="maori">${n(l.maoriName)}</span>
            <span class="english">${n(l.name)}</span>
          </span>
          <span class="score-badge">${l.score}${p}</span>
        </h3>
        ${l.reflection?`<p class="summary-note">"${n(l.reflection)}"</p>`:`<p class="summary-note muted">${$}</p>`}
        <button type="button" class="btn text small" data-action="edit" data-domain="${l.id}">${x}</button>
      </article>
    `).join("");return`
      <section class="summary" aria-labelledby="summary-title">
        <header class="summary-header">
          <h1 id="summary-title">${g}</h1>
          <p class="subtitle">${S}</p>
        </header>

        <div class="summary-body">
          <div class="chart-panel large">
            <button type="button" class="chart-expand-btn" data-action="chart-expand" aria-label="Expand chart">⛶</button>
            <div class="chart-container" id="summary-chart" role="img" aria-label="${u}"></div>
            <p class="shape-note">${y}</p>
            <p class="avg-note">${h}</p>
          </div>

          <div class="summary-cards">
            ${d}
          </div>
        </div>

        <div class="summary-footer">
          <p class="disclaimer">${f}</p>
          <div class="summary-actions">
            <button type="button" class="btn secondary" data-action="prev">${b}</button>
            <button type="button" class="btn primary" data-action="print">${L}</button>
            <button type="button" class="btn text" data-action="export">${E}</button>
            <button type="button" class="btn text" data-action="import">${M}</button>
            <input type="file" accept=".json" data-import-input style="display: none;" aria-label="${M}" />
            <button type="button" class="btn text" data-action="reset">${A}</button>
          </div>
        </div>
      </section>`}renderExportScreen(){const t=n(o("export.title",this.language)),e=n(o("export.description",this.language)),a=n(o("export.downloadButton",this.language)),s=n(o("export.back",this.language)),c=this.state.domains.map(m=>{const p=this.language==="mi"?m.maoriName:m.name;return`<li>${n(p)}: ${m.score} / 5</li>`}).join("");return`
      <section class="export-screen" aria-labelledby="export-title">
        <div class="export-content">
          <h1 id="export-title">${t}</h1>
          <p class="export-description">${e}</p>
          <ul class="export-domain-list">
            ${c}
          </ul>
          <div class="export-actions">
            <button type="button" class="btn secondary" data-action="export-back">${s}</button>
            <button type="button" class="btn primary" data-action="export-download">${a}</button>
          </div>
        </div>
      </section>`}renderFullscreenChart(){const t=n(o("chart.fullscreenTitle",this.language)),e=n(o("nav.back",this.language)),a=this.state.showSummary?'<div class="chart-container" id="fullscreen-chart" role="img" aria-label="'+n(o("chart.summaryAriaLabel",this.language))+'"></div>':'<div class="chart-container" id="fullscreen-chart" role="img" aria-label="'+n(o("chart.liveAriaLabel",this.language))+'"></div>';return`
      <section class="fullscreen-chart" aria-labelledby="fullscreen-chart-title">
        <div class="fullscreen-chart-content">
          <h1 id="fullscreen-chart-title">${t}</h1>
          ${a}
          <button type="button" class="btn secondary chart-close" data-action="chart-close">${e}</button>
        </div>
      </section>`}updateFullscreenChart(){setTimeout(()=>{(this.state.showSummary||this.state.currentStep>0)&&F("fullscreen-chart",this.state.domains)},0)}}const ht=()=>{new lt};document.addEventListener("DOMContentLoaded",()=>{ht()});
