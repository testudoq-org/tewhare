var D=Object.defineProperty;var F=(n,t,a)=>t in n?D(n,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):n[t]=a;var L=(n,t,a)=>F(n,typeof t!="symbol"?t+"":t,a);const A="te-whare-tapa-wha-assessment",R=[{id:"tinana",name:"Physical wellbeing",maoriName:"Taha tinana",description:"How your body feels and how you care for it — movement, rest, nourishment, and physical strength.",descriptionMi:"He aha tō kiko e noho nei, me tūpato koe i a ia — neke, moemoeā, kaiponu, me kaha tinana.",prompt:"What does looking after your tinana mean for you right now?",promptMi:"He aha te tikanga o tūpato i tō tinana mō koe kei ināianei?"},{id:"hinengaro",name:"Mental and emotional wellbeing",maoriName:"Taha hinengaro",description:"Your thoughts, feelings, and how you make sense of the world. Clear thinking and expressing what is going on inside.",descriptionMi:"Ōu whakaaro, ōu rongo, me tūpato koe i te ao. Whakaaro clear me āwhina i te mea e noho nei ki roto.",prompt:"How are your thoughts and feelings sitting with you at the moment?",promptMi:"He aha ōu whakaaro me rongo e noho nei mā koe pēlā?"},{id:"wairua",name:"Spiritual wellbeing",maoriName:"Taha wairua",description:"Your sense of meaning, connection to something greater, values, identity, and what gives your life purpose.",descriptionMi:"Tō whakapono o tētahi, hononga ki tētahi mea nui, āhua, whakapono, me te mea e homai nei he-āhua ki tō ao.",prompt:"What gives your life meaning or a sense of connection right now?",promptMi:"He aha e homai nei he-āhua ki tō ao rānei hononga kei ināianei?"},{id:"whanau",name:"Family and social wellbeing",maoriName:"Taha whānau",description:"The people you belong with — family, friends, community, and the relationships that support and shape you.",descriptionMi:"Ngā tāngata e tūpato ana koe — whānau, hoa, hapai, me ngā whakapā e tautoko ana me āhua koe.",prompt:"Who helps you feel you belong, and how are those connections for you?",promptMi:"Ko wai e āwhina ana kia tūpato koe, me he aha āu hononga?"}],W=()=>R.map(n=>({...n,score:3,reflection:""})),T=n=>n.map(t=>({...t})),Y=()=>{try{const n=localStorage.getItem(A);if(n){const t=JSON.parse(n);if(t.domains&&Array.isArray(t.domains))return{domains:t.domains}}}catch{}return null},K=n=>{try{localStorage.setItem(A,JSON.stringify({domains:[...n]}))}catch{}},_=()=>{try{const n=localStorage.getItem(A);if(n)return n}catch{}return null},U=n=>{try{localStorage.setItem(A,JSON.stringify({domains:[...n]}))}catch{}},G=()=>{try{localStorage.removeItem(A)}catch{}},j="te-whare-tapa-wha-language",J=()=>{try{const n=localStorage.getItem(j);if(n==="en"||n==="mi")return n}catch{}return null},q=n=>{try{localStorage.setItem(j,n)}catch{}},X=n=>{const t=n/2;return`
    <circle cx="${t}" cy="${t}" r="120" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.15"/>
    <circle cx="${t}" cy="${t}" r="90" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.12"/>
    <circle cx="${t}" cy="${t}" r="60" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.1"/>
    <path d="M${t},50 L${t+70},100 L${t+70},170 L${t},220 L${t-70},170 L${t-70},100 Z" fill="none" stroke="var(--chart-bg-custom)" stroke-width="1.2" opacity="0.1"/>
    <path d="M${t},80 L${t+40},110 L${t+40},160 L${t},190 L${t-40},160 L${t-40},110 Z" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.8" opacity="0.08"/>`},Z=(n,t)=>{const a=n/2,o=110,i=5,r=t.length,c=Math.PI*2/r,d=-Math.PI/2,b="var(--chart-value-level-stroke)",u=[];for(let g=1;g<=i;g++){const f=g/i*o,v=[];for(let k=0;k<r;k++){const $=d+k*c,S=a+f*Math.cos($),x=a+f*Math.sin($);v.push(`${S.toFixed(2)},${x.toFixed(2)}`)}u.push(`<polygon points="${v.join(" ")}" fill="none" stroke="${b}" stroke-width="1" opacity="0.35"/>`)}return u.join("")},O=(n,t)=>{const a=document.getElementById(n);if(!a)return;const o=280,i=o/2,r=110,c=5,d=t.length,b=Math.PI*2/d,u=-Math.PI/2,g=t.map((m,p)=>{const h=u+p*b,l=m.score/5*r;return{x:i+l*Math.cos(h),y:i+l*Math.sin(h),labelX:i+(r+28)*Math.cos(h),labelY:i+(r+28)*Math.sin(h),domain:m}}),f=Array.from({length:c},(m,p)=>{const h=c-p,l=h/c*r;return`<polygon points="${Array.from({length:d},(y,H)=>{const I=u+H*b;return`${i+l*Math.cos(I)},${i+l*Math.sin(I)}`}).join(" ")}" class="chart-level level-${h}" />`}).join(""),v=Array.from({length:d},(m,p)=>{const h=u+p*b,l=i+r*Math.cos(h),w=i+r*Math.sin(h);return`<line x1="${i}" y1="${i}" x2="${l}" y2="${w}" class="chart-axis" />`}).join(""),$=`<polygon points="${g.map(m=>`${m.x},${m.y}`).join(" ")}" class="chart-data" />`,S=g.map(m=>`<circle cx="${m.x}" cy="${m.y}" r="5" class="chart-dot" />`).join(""),x=g.map(m=>{const p=m.domain.maoriName.replace("Taha ","");return`<text x="${m.labelX}" y="${m.labelY}" class="chart-label" text-anchor="middle" dominant-baseline="middle">${p}</text>`}).join(""),M=Array.from({length:c},(m,p)=>{const h=p+1,l=h/c*r,w=u,y=i+l*Math.cos(w)+10,H=i+l*Math.sin(w);return`<text x="${y}" y="${H}" class="chart-level-label">${h}</text>`}).join(""),N=X(o),E=Z(o,t);a.innerHTML=`
    <svg viewBox="0 0 ${o} ${o}" width="100%" height="100%" class="radar-svg" aria-hidden="true">
      <g class="chart-bg-custom" aria-hidden="true">
        ${N}
      </g>
      <g class="chart-value-level-polygons" aria-hidden="true">
        ${E}
      </g>
      <g class="chart-bg">
        ${f}
        ${v}
      </g>
      ${$}
      ${S}
      ${x}
      ${M}
    </svg>`},C="en",z=(n,t)=>t?n.replace(/\{(\w+)\}/g,(a,o)=>Object.prototype.hasOwnProperty.call(t,o)?String(t[o]):a):n,B={en:{"common.and":" and ","lang.selectTitle":"Choose your language","lang.selectSubtitle":"Select a language to begin","lang.option.en":"English","lang.option.mi":"Māori","lang.selectButton":"Start","welcome.subtitle":"A wellbeing reflection","welcome.intro1":"Te Whare Tapa Whā is a model of hauora developed by Sir Mason Durie. It describes four walls of a house, each representing a dimension of wellbeing. When the walls are strong and balanced, the house stands well.","welcome.intro2":"This tool is for personal reflection and conversation. It is not a diagnosis or clinical assessment. The meaning of each score belongs to you.","welcome.note":"This is a digital interpretation of the framework, offered with respect.","welcome.startButton":"Begin reflection","assessment.progressLabel":"Progress","assessment.stepOf":"Step {step} of {total}","assessment.startOver":"Start over","assessment.scoreLabel":"Where do you sit right now?","assessment.scoreFormat":" / 5","assessment.reflectionPlaceholder":"Your thoughts (optional)","assessment.chartTitle":"Your current shape","assessment.chartNote":"The shape updates as you move the slider. Stronger areas sit further out.","assessment.chartScoreAria":"Score for {name}","chart.liveAriaLabel":"Radar chart showing current wellbeing scores","chart.summaryAriaLabel":"Radar chart of your wellbeing scores","nav.back":"Back","nav.next":"Next","nav.seeSummary":"See summary","summary.title":"Your reflection","summary.subtitle":"A snapshot of where you sit right now","summary.scoreEven":"Your scores sit evenly across all four dimensions.","summary.scoreBalanced":"Your shape is fairly balanced, with only small differences between dimensions.","summary.scoreSpread":"Stronger areas include {strongest}. Areas sitting lower include {softest}.","summary.noNotes":"No notes added.","summary.edit":"Edit","summary.disclaimer":"This is a personal reflection tool based on Te Whare Tapa Whā. The scores and shape are yours to interpret. They do not replace professional support or conversation with people you trust.","summary.backToEdit":"Back to edit","summary.print":"Print or save as PDF","summary.startNew":"Start a new reflection","summary.avgNote":"Average across dimensions: {avg}","export.download":"Export assessment data","export.button":"Export","import.button":"Import","import.error":"Import failed. Please check the file format.","dialog.resetConfirm":"Start a new reflection? Your current scores and notes will be cleared."},mi:{"common.and":" me ","lang.selectTitle":"Whiriwhi i tō reo","lang.selectSubtitle":"Whiriwhi tētahi reo kia tīmata","lang.option.en":"English","lang.option.mi":"Māori","lang.selectButton":"Tīmata","welcome.subtitle":"He whakamātautautā hauora","welcome.intro1":"He taua hauora a Te Whare Tapa Whā, āwhakapapaia e Sir Mason Durie. E whakamārama ana i ngā pakaranga e whā o te whare, ko tētahi e tohutupu ana i tētahi ara hauora. Ki te kaha me tūturu ngā pakaranga, ka tūpato te whare.","welcome.intro2":"Ko tēnei taputapu he whakamātautautā motu-motu me kōrero. Kāore i tētahi whakapa rānei aromātakitanga kiriti. Ko te tikanga o tētahi tūtohi ke tōu.","welcome.note":"He whakamārama tuihāpai tōnei, āwhinatia ki te whakapono.","welcome.startButton":"Tīmata i te whakamātautautā","assessment.progressLabel":"Hāpai","assessment.stepOf":"Tūtohi {step} o {total}","assessment.startOver":"Tīmata anō","assessment.scoreLabel":"He aha tō āhua o ināianei?","assessment.scoreFormat":" / 5","assessment.reflectionPlaceholder":"Āu whakaaro (kōwhiri)","assessment.chartTitle":"Ko tō āhua o ināianei","assessment.chartNote":"Ka whakahoua tēnei āhua he rite i te tīmata o te koro. Ko ngā wāhi kaha kei tua.","assessment.chartScoreAria":"Tūtohi {name}","chart.liveAriaLabel":"Kahikātea radar e whaguanitia ana i ngā tūtohi hauora o ināianei","chart.summaryAriaLabel":"Kahikātea radar o āu tūtohi hauora","nav.back":"Hoki","nav.next":"Panoni","nav.seeSummary":"Tirohanga mātautautā","summary.title":"Tō whakamātautautā","summary.subtitle":"He tirohanga o te wāhi e noho ana koe","summary.scoreEven":"Ke tūpato ō tūtohi i runga i ngā ara e whā.","summary.scoreBalanced":"He āhua tūturu rawa tō āhua, me pāmamahi iti noa i waenganui i ngā ara.","summary.scoreSpread":"Ko ngā wāhi kaha e whāngai ana i {strongest}. Ko ngā wāhi ponaku kei raro e whāngai ana i {softest}.","summary.noNotes":"Kāore he kōrero anō.","summary.edit":"Whakatika","summary.disclaimer":"He taputapu whakamātautautā motu-motu tōnei, āhono i te Whare Tapa Whā. Ko ngā tūtohi me te āhua ke tōu mā te whakapono. Kāore e korekorehu i te tautoko pūkenga rānei kōrero me ngā tāngata e whakapono ana koe.","summary.backToEdit":"Hoki ki te whakatika","summary.print":"Tāpata i te mātaitai","summary.startNew":"Tīmata whakamātautautā hou","summary.avgNote":"Neutoti i waenganui i ngā ara: {avg}","export.download":"Kawea i ngā raraunga aromātakitanga","export.button":"Kawea","import.button":"Kuhu","import.error":"I rahua te kuhu. Tēnā whakamātau anō i te hōtuku.","dialog.resetConfirm":"Tīmata whakamātautautā hou? Ka konta o tūtohi me kōrero o ināianei."}},s=(n,t=C,a)=>{const i=(B[t]??B.en)[n]??B.en[n]??n;return z(i,a)},e=n=>{const t=document.createElement("div");return t.textContent=n,t.innerHTML},P=()=>{var n;return typeof navigator<"u"&&((n=navigator.language)!=null&&n.startsWith("mi"))?"mi":C};class V{constructor(){L(this,"state");L(this,"language");L(this,"showLanguageSelector");L(this,"domainName",t=>this.language==="mi"?t.maoriName:t.name);L(this,"domainDescription",t=>this.language==="mi"?t.descriptionMi??t.description:t.description);L(this,"domainPrompt",t=>this.language==="mi"?t.promptMi??t.prompt:t.prompt);const t=J();this.language=t??P(),this.showLanguageSelector=t===null;const a=Y();this.state={domains:(a==null?void 0:a.domains)??W(),currentStep:0,showSummary:!1},this.init()}init(){this.updateHtmlLang(),this.render(),this.bindEvents()}updateHtmlLang(){document.documentElement.setAttribute("lang",this.language)}bindEvents(){document.addEventListener("click",t=>{const a=t.target;if(a.matches('[data-action="select-lang"]')){const o=a.getAttribute("data-lang");this.setLanguage(o);return}if(a.matches('[data-action="start"]')&&(this.state={domains:T(this.state.domains),currentStep:1,showSummary:!1},this.render()),a.matches('[data-action="next"]')&&(this.state.currentStep<this.state.domains.length?this.state={domains:T(this.state.domains),currentStep:this.state.currentStep+1,showSummary:!1}:this.state={domains:T(this.state.domains),currentStep:this.state.domains.length,showSummary:!0},this.render()),a.matches('[data-action="prev"]')&&(this.state.showSummary?this.state={domains:T(this.state.domains),currentStep:this.state.domains.length,showSummary:!1}:this.state.currentStep>1&&(this.state={domains:T(this.state.domains),currentStep:this.state.currentStep-1,showSummary:!1}),this.render()),a.matches('[data-action="reset"]')&&confirm(s("dialog.resetConfirm",this.language))&&(G(),this.state={domains:W(),currentStep:0,showSummary:!1},this.render()),a.matches('[data-action="print"]')&&window.print(),a.matches('[data-action="export"]')){const o=_();if(o){const i=new Blob([o],{type:"application/json"}),r=URL.createObjectURL(i),c=document.createElement("a");c.href=r,c.download="te-whare-tapa-wha-assessment.json",c.click(),URL.revokeObjectURL(r)}}if(a.matches('[data-action="import"]')){const o=document.querySelector("[data-import-input]");o==null||o.click()}if(a.matches('[data-action="edit"]')){const o=a.getAttribute("data-domain");if(o){const i=this.state.domains.findIndex(r=>r.id===o);i>=0&&(this.state={domains:T(this.state.domains),currentStep:i+1,showSummary:!1},this.render())}}}),document.addEventListener("input",t=>{const a=t.target;if(a.matches("[data-score]")){const o=a.getAttribute("data-score"),i=this.state.domains.find(r=>r.id===o);if(i){const r=Math.max(1,Math.min(5,parseInt(a.value,10)||1));i.score=r,K(this.state.domains),this.updateChart(),this.updateScoreDisplay(o,r)}}if(a.matches("[data-reflection]")){const o=a.getAttribute("data-reflection"),i=this.state.domains.find(r=>r.id===o);i&&(i.reflection=a.value,K(this.state.domains))}}),document.addEventListener("change",t=>{var o;const a=t.target;if(a.matches("[data-import-input]")){const i=(o=a.files)==null?void 0:o[0];if(i){const r=new FileReader;r.onload=()=>{try{const c=JSON.parse(r.result);c.domains&&Array.isArray(c.domains)?(U(c.domains),this.state={domains:T(c.domains),currentStep:0,showSummary:!1},this.render()):alert(s("import.error",this.language))}catch{alert(s("import.error",this.language))}},r.readAsText(i)}}})}setLanguage(t){this.language=t,this.showLanguageSelector=!1,q(t),this.updateHtmlLang(),this.render()}updateScoreDisplay(t,a){const o=document.querySelector('[data-score-value="'+t+'"]');o&&(o.textContent=String(a))}updateChart(){document.getElementById("live-chart")&&O("live-chart",this.state.domains),document.getElementById("summary-chart")&&O("summary-chart",this.state.domains)}render(){const t=document.getElementById("app");t&&(this.showLanguageSelector?t.innerHTML=this.renderLanguageSelector():this.state.currentStep===0?t.innerHTML=this.renderWelcome():this.state.showSummary?(t.innerHTML=this.renderSummary(),this.updateChart()):(t.innerHTML=this.renderAssessment(),this.updateChart()))}renderLanguageSelector(){const t=P(),a=d=>d===t?" selected":"",o=e(s("lang.selectTitle","en")),i=e(s("lang.selectTitle","mi")),r=e(s("lang.selectSubtitle","en")),c=e(s("lang.selectSubtitle","mi"));return`
      <section class="lang-selector" aria-labelledby="lang-select-title">
        <div class="lang-selector-content">
          <h1 id="lang-select-title">
            <span class="lang-mi">${i}</span>
            <span class="lang-en">${o}</span>
          </h1>
          <p class="lang-subtitle">
            <span class="lang-mi">${c}</span>
            <span class="lang-en">${r}</span>
          </p>
          <div class="lang-options" role="radiogroup" aria-label="${e(s("lang.selectTitle",this.language))}">
            <button type="button" class="lang-option${a("en")}" data-action="select-lang" data-lang="en" aria-checked="${t==="en"?"true":"false"}">
              ${e(s("lang.option.en","en"))}
            </button>
            <button type="button" class="lang-option${a("mi")}" data-action="select-lang" data-lang="mi" aria-checked="${t==="mi"?"true":"false"}">
              ${e(s("lang.option.mi","mi"))}
            </button>
          </div>
        </div>
      </section>`}renderWelcome(){return`
      <section class="welcome" aria-labelledby="welcome-title">
        <div class="welcome-content">
          <h1 id="welcome-title">Te Whare Tapa Whā</h1>
          <p class="subtitle">${e(s("welcome.subtitle",this.language))}</p>
          <p class="intro">${e(s("welcome.intro1",this.language))}</p>
          <p class="intro">${e(s("welcome.intro2",this.language))}</p>
          <p class="note">${e(s("welcome.note",this.language))}</p>
          <button type="button" class="btn primary" data-action="start">
            ${e(s("welcome.startButton",this.language))}
          </button>
        </div>
      </section>`}renderAssessment(){const t=this.state.domains[this.state.currentStep-1];if(!t)return"";const a=this.state.currentStep,o=this.state.domains.length,i=e(this.domainDescription(t)),r=e(this.domainPrompt(t)),c=e(s("assessment.scoreLabel",this.language)),d=e(s("assessment.progressLabel",this.language)),b=e(s("assessment.stepOf",this.language,{step:String(a),total:String(o)})),u=e(s("assessment.startOver",this.language)),g=e(s("assessment.reflectionPlaceholder",this.language)),f=e(s("assessment.chartTitle",this.language)),v=e(s("assessment.chartNote",this.language)),k=e(s("assessment.scoreFormat",this.language)),$=e(s("assessment.chartScoreAria",this.language,{name:t.maoriName})),S=e(s("chart.liveAriaLabel",this.language)),x=e(s("nav.back",this.language)),M=e(a===o?s("nav.seeSummary",this.language):s("nav.next",this.language));return`
      <section class="assessment" aria-labelledby="domain-title">
        <header class="assessment-header">
          <div class="progress" role="progressbar" aria-valuenow="${a}" aria-valuemin="1" aria-valuemax="${o}" aria-label="${d}">
            <span class="progress-text">${b}</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${a/o*100}%"></div>
            </div>
          </div>
          <button type="button" class="btn text" data-action="reset">${u}</button>
        </header>

        <div class="assessment-body">
          <div class="domain-panel">
            <h2 id="domain-title">
              <span class="maori">${e(t.maoriName)}</span>
              <span class="english">${e(t.name)}</span>
            </h2>
            <p class="domain-desc">${i}</p>

            <div class="score-control">
              <label for="score-${t.id}">
                ${c} <span class="score-value" data-score-value="${t.id}">${t.score}</span>${k}
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
                aria-label="${$}"
              />
              <div class="score-labels" aria-hidden="true">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>

            <div class="reflection-control">
              <label for="reflection-${t.id}">${r}</label>
              <textarea
                id="reflection-${t.id}"
                data-reflection="${t.id}"
                rows="4"
                placeholder="${g}"
              >${e(t.reflection)}</textarea>
            </div>
          </div>

          <div class="chart-panel">
            <h3 class="chart-title">${f}</h3>
            <div class="chart-container" id="live-chart" role="img" aria-label="${S}"></div>
            <p class="chart-note">${v}</p>
          </div>
        </div>

        <nav class="assessment-nav">
          <button type="button" class="btn secondary" data-action="prev" ${a===1?"disabled":""}>${x}</button>
          <button type="button" class="btn primary" data-action="next">
            ${M}
          </button>
        </nav>
      </section>`}renderSummary(){const t=this.state.domains,a=t.map(l=>l.score),o=a.reduce((l,w)=>l+w,0)/a.length,i=Math.min(...a),r=Math.max(...a),c=r-i,d=s("common.and",this.language),b=e(s("assessment.scoreFormat",this.language));let u="";if(c===0)u=e(s("summary.scoreEven",this.language));else if(c<=1)u=e(s("summary.scoreBalanced",this.language));else{const l=t.filter(y=>y.score===r).map(y=>this.domainName(y)),w=t.filter(y=>y.score===i).map(y=>this.domainName(y));u=e(s("summary.scoreSpread",this.language,{strongest:l.join(d),softest:w.join(d)}))}const g=e(s("summary.title",this.language)),f=e(s("summary.subtitle",this.language)),v=e(s("summary.noNotes",this.language)),k=e(s("summary.edit",this.language)),$=e(s("summary.disclaimer",this.language)),S=e(s("summary.backToEdit",this.language)),x=e(s("summary.print",this.language)),M=e(s("summary.startNew",this.language)),N=e(s("export.button",this.language)),E=e(s("import.button",this.language)),m=e(s("summary.avgNote",this.language,{avg:o.toFixed(1)})),p=e(s("chart.summaryAriaLabel",this.language)),h=t.map(l=>`
      <article class="summary-card">
        <h3>
          <span class="domain-names">
            <span class="maori">${e(l.maoriName)}</span>
            <span class="english">${e(l.name)}</span>
          </span>
          <span class="score-badge">${l.score}${b}</span>
        </h3>
        ${l.reflection?`<p class="summary-note">"${e(l.reflection)}"</p>`:`<p class="summary-note muted">${v}</p>`}
        <button type="button" class="btn text small" data-action="edit" data-domain="${l.id}">${k}</button>
      </article>
    `).join("");return`
      <section class="summary" aria-labelledby="summary-title">
        <header class="summary-header">
          <h1 id="summary-title">${g}</h1>
          <p class="subtitle">${f}</p>
        </header>

        <div class="summary-body">
          <div class="chart-panel large">
            <div class="chart-container" id="summary-chart" role="img" aria-label="${p}"></div>
            <p class="shape-note">${u}</p>
            <p class="avg-note">${m}</p>
          </div>

          <div class="summary-cards">
            ${h}
          </div>
        </div>

        <div class="summary-footer">
          <p class="disclaimer">${$}</p>
          <div class="summary-actions">
            <button type="button" class="btn secondary" data-action="prev">${S}</button>
            <button type="button" class="btn primary" data-action="print">${x}</button>
            <button type="button" class="btn text" data-action="export">${N}</button>
            <button type="button" class="btn text" data-action="import">${E}</button>
            <input type="file" accept=".json" data-import-input style="display: none;" />
            <button type="button" class="btn text" data-action="reset">${M}</button>
          </div>
        </div>
      </section>`}}const Q=()=>{new V};document.addEventListener("DOMContentLoaded",()=>{Q()});
