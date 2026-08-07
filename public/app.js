var C=Object.defineProperty;var F=(o,t,a)=>t in o?C(o,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):o[t]=a;var S=(o,t,a)=>F(o,typeof t!="symbol"?t+"":t,a);const E="te-whare-tapa-wha-assessment",R=[{id:"tinana",name:"Physical wellbeing",maoriName:"Taha tinana",description:"How your body feels and how you care for it — movement, rest, nourishment, and physical strength.",descriptionMi:"He aha tō kiko e noho nei, me tūpato koe i a ia — neke, moemoeā, kaiponu, me kaha tinana.",prompt:"What does looking after your tinana mean for you right now?",promptMi:"He aha te tikanga o tūpato i tō tinana mō koe kei ināianei?"},{id:"hinengaro",name:"Mental and emotional wellbeing",maoriName:"Taha hinengaro",description:"Your thoughts, feelings, and how you make sense of the world. Clear thinking and expressing what is going on inside.",descriptionMi:"Ōu whakaaro, ōu rongo, me tūpato koe i te ao. Whakaaro clear me āwhina i te mea e noho nei ki roto.",prompt:"How are your thoughts and feelings sitting with you at the moment?",promptMi:"He aha ōu whakaaro me rongo e noho nei mā koe pēlā?"},{id:"wairua",name:"Spiritual wellbeing",maoriName:"Taha wairua",description:"Your sense of meaning, connection to something greater, values, identity, and what gives your life purpose.",descriptionMi:"Tō whakapono o tētahi, hononga ki tētahi mea nui, āhua, whakapono, me te mea e homai nei he-āhua ki tō ao.",prompt:"What gives your life meaning or a sense of connection right now?",promptMi:"He aha e homai nei he-āhua ki tō ao rānei hononga kei ināianei?"},{id:"whanau",name:"Family and social wellbeing",maoriName:"Taha whānau",description:"The people you belong with — family, friends, community, and the relationships that support and shape you.",descriptionMi:"Ngā tāngata e tūpato ana koe — whānau, hoa, hapai, me ngā whakapā e tautoko ana me āhua koe.",prompt:"Who helps you feel you belong, and how are those connections for you?",promptMi:"Ko wai e āwhina ana kia tūpato koe, me he aha āu hononga?"}],I=()=>R.map(o=>({...o,score:3,reflection:""})),T=o=>o.map(t=>({...t})),Y=()=>{try{const o=localStorage.getItem(E);if(o){const t=JSON.parse(o);if(t.domains&&Array.isArray(t.domains))return{domains:t.domains}}}catch{}return null},K=o=>{try{localStorage.setItem(E,JSON.stringify({domains:[...o]}))}catch{}},_=()=>{try{const o=localStorage.getItem(E);if(o)return o}catch{}return null},U=o=>{try{localStorage.setItem(E,JSON.stringify({domains:[...o]}))}catch{}},J=()=>{try{localStorage.removeItem(E)}catch{}},j="te-whare-tapa-wha-language",G=()=>{try{const o=localStorage.getItem(j);if(o==="en"||o==="mi")return o}catch{}return null},q=o=>{try{localStorage.setItem(j,o)}catch{}},X=o=>{const t=o/2;return`
    <circle cx="${t}" cy="${t}" r="120" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.15"/>
    <circle cx="${t}" cy="${t}" r="90" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.12"/>
    <circle cx="${t}" cy="${t}" r="60" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.1"/>
    <path d="M${t},50 L${t+70},100 L${t+70},170 L${t},220 L${t-70},170 L${t-70},100 Z" fill="none" stroke="var(--chart-bg-custom)" stroke-width="1.2" opacity="0.1"/>
    <path d="M${t},80 L${t+40},110 L${t+40},160 L${t},190 L${t-40},160 L${t-40},110 Z" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.8" opacity="0.08"/>`},Z=(o,t)=>{const a=o/2,n=110,i=5,r=t.length,c=Math.PI*2/r,h=-Math.PI/2,p="var(--chart-value-level-stroke)",d=[];for(let g=1;g<=i;g++){const f=g/i*n,v=[];for(let k=0;k<r;k++){const $=h+k*c,x=a+f*Math.cos($),L=a+f*Math.sin($);v.push(`${x.toFixed(2)},${L.toFixed(2)}`)}d.push(`<polygon points="${v.join(" ")}" fill="none" stroke="${p}" stroke-width="1" opacity="0.35"/>`)}return d.join("")},W=(o,t)=>{const a=document.getElementById(o);if(!a)return;const n=280,i=n/2,r=110,c=5,h=t.length,p=Math.PI*2/h,d=-Math.PI/2,g=t.map((m,y)=>{const u=d+y*p,l=m.score/5*r;return{x:i+l*Math.cos(u),y:i+l*Math.sin(u),labelX:i+(r+28)*Math.cos(u),labelY:i+(r+28)*Math.sin(u),domain:m}}),f=Array.from({length:c},(m,y)=>{const u=c-y,l=u/c*r;return`<polygon points="${Array.from({length:h},(b,B)=>{const O=d+B*p;return`${i+l*Math.cos(O)},${i+l*Math.sin(O)}`}).join(" ")}" class="chart-level level-${u}" />`}).join(""),v=Array.from({length:h},(m,y)=>{const u=d+y*p,l=i+r*Math.cos(u),w=i+r*Math.sin(u);return`<line x1="${i}" y1="${i}" x2="${l}" y2="${w}" class="chart-axis" />`}).join(""),$=`<polygon points="${g.map(m=>`${m.x},${m.y}`).join(" ")}" class="chart-data" />`,x=g.map(m=>`<circle cx="${m.x}" cy="${m.y}" r="5" class="chart-dot" />`).join(""),L=g.map(m=>{const y=m.domain.maoriName.replace("Taha ","");return`<text x="${m.labelX}" y="${m.labelY}" class="chart-label" text-anchor="middle" dominant-baseline="middle">${y}</text>`}).join(""),M=Array.from({length:c},(m,y)=>{const u=y+1,l=u/c*r,w=d,b=i+l*Math.cos(w)+10,B=i+l*Math.sin(w);return`<text x="${b}" y="${B}" class="chart-level-label">${u}</text>`}).join(""),A=X(n),N=Z(n,t);a.innerHTML=`
    <svg viewBox="0 0 ${n} ${n}" width="100%" height="100%" class="radar-svg" aria-hidden="true">
      <g class="chart-bg-custom" aria-hidden="true">
        ${A}
      </g>
      <g class="chart-value-level-polygons" aria-hidden="true">
        ${N}
      </g>
      <g class="chart-bg">
        ${f}
        ${v}
      </g>
      ${$}
      ${x}
      ${L}
      ${M}
    </svg>`},D="en",z=(o,t)=>t?o.replace(/\{(\w+)\}/g,(a,n)=>Object.prototype.hasOwnProperty.call(t,n)?String(t[n]):a):o,H={en:{"common.and":" and ","lang.selectTitle":"Choose your language","lang.selectSubtitle":"Select a language to begin","lang.option.en":"English","lang.option.mi":"Māori","lang.selectButton":"Start","welcome.subtitle":"A wellbeing reflection","welcome.intro1":"Te Whare Tapa Whā is a model of hauora developed by Sir Mason Durie. It describes four walls of a house, each representing a dimension of wellbeing. When the walls are strong and balanced, the house stands well.","welcome.intro2":"This tool is for personal reflection and conversation. It is not a diagnosis or clinical assessment. The meaning of each score belongs to you.","welcome.note":"This is a digital interpretation of the framework, offered with respect.","welcome.startButton":"Begin reflection","assessment.progressLabel":"Progress","assessment.stepOf":"Step {step} of {total}","assessment.startOver":"Start over","assessment.scoreLabel":"Where do you sit right now?","assessment.scoreFormat":" / 5","assessment.reflectionPlaceholder":"Your thoughts (optional)","assessment.chartTitle":"Your current shape","assessment.chartNote":"The shape updates as you move the slider. Stronger areas sit further out.","assessment.chartScoreAria":"Score for {name}","chart.liveAriaLabel":"Radar chart showing current wellbeing scores","chart.summaryAriaLabel":"Radar chart of your wellbeing scores","nav.back":"Back","nav.next":"Next","nav.seeSummary":"See summary","summary.title":"Your reflection","summary.subtitle":"A snapshot of where you sit right now","summary.scoreEven":"Your scores sit evenly across all four dimensions.","summary.scoreBalanced":"Your shape is fairly balanced, with only small differences between dimensions.","summary.scoreSpread":"Stronger areas include {strongest}. Areas sitting lower include {softest}.","summary.noNotes":"No notes added.","summary.edit":"Edit","summary.disclaimer":"This is a personal reflection tool based on Te Whare Tapa Whā. The scores and shape are yours to interpret. They do not replace professional support or conversation with people you trust.","summary.backToEdit":"Back to edit","summary.print":"Print or save as PDF","summary.startNew":"Start a new reflection","summary.avgNote":"Average across dimensions: {avg}","export.download":"Export assessment data","export.button":"Export","export.title":"Export your reflection","export.description":"Review your assessment data below, then download it as a JSON file.","export.downloadButton":"Download JSON file","export.back":"Back to summary","import.button":"Import","import.error":"Import failed. Please check the file format.","dialog.resetConfirm":"Start a new reflection? Your current scores and notes will be cleared."},mi:{"common.and":" me ","lang.selectTitle":"Whiriwhi i tō reo","lang.selectSubtitle":"Whiriwhi tētahi reo kia tīmata","lang.option.en":"English","lang.option.mi":"Māori","lang.selectButton":"Tīmata","welcome.subtitle":"He whakamātautautā hauora","welcome.intro1":"He taua hauora a Te Whare Tapa Whā, āwhakapapaia e Sir Mason Durie. E whakamārama ana i ngā pakaranga e whā o te whare, ko tētahi e tohutupu ana i tētahi ara hauora. Ki te kaha me tūturu ngā pakaranga, ka tūpato te whare.","welcome.intro2":"Ko tēnei taputapu he whakamātautautā motu-motu me kōrero. Kāore i tētahi whakapa rānei aromātakitanga kiriti. Ko te tikanga o tētahi tūtohi ke tōu.","welcome.note":"He whakamārama tuihāpai tōnei, āwhinatia ki te whakapono.","welcome.startButton":"Tīmata i te whakamātautautā","assessment.progressLabel":"Hāpai","assessment.stepOf":"Tūtohi {step} o {total}","assessment.startOver":"Tīmata anō","assessment.scoreLabel":"He aha tō āhua o ināianei?","assessment.scoreFormat":" / 5","assessment.reflectionPlaceholder":"Āu whakaaro (kōwhiri)","assessment.chartTitle":"Ko tō āhua o ināianei","assessment.chartNote":"Ka whakahoua tēnei āhua he rite i te tīmata o te koro. Ko ngā wāhi kaha kei tua.","assessment.chartScoreAria":"Tūtohi {name}","chart.liveAriaLabel":"Kahikātea radar e whaguanitia ana i ngā tūtohi hauora o ināianei","chart.summaryAriaLabel":"Kahikātea radar o āu tūtohi hauora","nav.back":"Hoki","nav.next":"Panoni","nav.seeSummary":"Tirohanga mātautautā","summary.title":"Tō whakamātautautā","summary.subtitle":"He tirohanga o te wāhi e noho ana koe","summary.scoreEven":"Ke tūpato ō tūtohi i runga i ngā ara e whā.","summary.scoreBalanced":"He āhua tūturu rawa tō āhua, me pāmamahi iti noa i waenganui i ngā ara.","summary.scoreSpread":"Ko ngā wāhi kaha e whāngai ana i {strongest}. Ko ngā wāhi ponaku kei raro e whāngai ana i {softest}.","summary.noNotes":"Kāore he kōrero anō.","summary.edit":"Whakatika","summary.disclaimer":"He taputapu whakamātautautā motu-motu tōnei, āhono i te Whare Tapa Whā. Ko ngā tūtohi me te āhua ke tōu mā te whakapono. Kāore e korekorehu i te tautoko pūkenga rānei kōrero me ngā tāngata e whakapono ana koe.","summary.backToEdit":"Hoki ki te whakatika","summary.print":"Tāpata i te mātaitai","summary.startNew":"Tīmata whakamātautautā hou","summary.avgNote":"Neutoti i waenganui i ngā ara: {avg}","export.download":"Kawea i ngā raraunga aromātakitanga","export.button":"Kawea","export.title":"Kawea tō whakamātautautā","export.description":"Tirohia ō raraunga aromātakitanga ki raro, kātahi ka kukuhia hei kōnae JSON.","export.downloadButton":"Kukuhia te kōnae JSON","export.back":"Hoki ki te whakarāpopotanga","import.button":"Kuhu","import.error":"I rahua te kuhu. Tēnā whakamātau anō i te hōtuku.","dialog.resetConfirm":"Tīmata whakamātautautā hou? Ka konta o tūtohi me kōrero o ināianei."}},s=(o,t=D,a)=>{const i=(H[t]??H.en)[o]??H.en[o]??o;return z(i,a)},e=o=>{const t=document.createElement("div");return t.textContent=o,t.innerHTML},P=()=>{var o;return typeof navigator<"u"&&((o=navigator.language)!=null&&o.startsWith("mi"))?"mi":D};class V{constructor(){S(this,"state");S(this,"language");S(this,"showLanguageSelector");S(this,"showExportScreen",!1);S(this,"domainName",t=>this.language==="mi"?t.maoriName:t.name);S(this,"domainDescription",t=>this.language==="mi"?t.descriptionMi??t.description:t.description);S(this,"domainPrompt",t=>this.language==="mi"?t.promptMi??t.prompt:t.prompt);const t=G();this.language=t??P(),this.showLanguageSelector=t===null;const a=Y();this.state={domains:(a==null?void 0:a.domains)??I(),currentStep:0,showSummary:!1},this.init()}init(){this.updateHtmlLang(),this.render(),this.bindEvents()}updateHtmlLang(){document.documentElement.setAttribute("lang",this.language)}bindEvents(){document.addEventListener("click",t=>{const a=t.target;if(a.matches('[data-action="select-lang"]')){const n=a.getAttribute("data-lang");this.setLanguage(n);return}if(a.matches('[data-action="start"]')&&(this.state={domains:T(this.state.domains),currentStep:1,showSummary:!1},this.render()),a.matches('[data-action="next"]')&&(this.state.currentStep<this.state.domains.length?this.state={domains:T(this.state.domains),currentStep:this.state.currentStep+1,showSummary:!1}:this.state={domains:T(this.state.domains),currentStep:this.state.domains.length,showSummary:!0},this.render()),a.matches('[data-action="prev"]')&&(this.state.showSummary?this.state={domains:T(this.state.domains),currentStep:this.state.domains.length,showSummary:!1}:this.state.currentStep>1&&(this.state={domains:T(this.state.domains),currentStep:this.state.currentStep-1,showSummary:!1}),this.render()),a.matches('[data-action="reset"]')&&confirm(s("dialog.resetConfirm",this.language))&&(J(),this.state={domains:I(),currentStep:0,showSummary:!1},this.render()),a.matches('[data-action="print"]')&&window.print(),a.matches('[data-action="export"]')){this.showExportScreen=!0,this.render();return}if(a.matches('[data-action="export-download"]')){const n=_();if(n){const i=new Blob([n],{type:"application/json"}),r=URL.createObjectURL(i),c=document.createElement("a");c.href=r,c.download="te-whare-tapa-wha-assessment.json",c.click(),URL.revokeObjectURL(r)}return}if(a.matches('[data-action="export-back"]')){this.showExportScreen=!1,this.render();return}if(a.matches('[data-action="import"]')){const n=document.querySelector("[data-import-input]");n==null||n.click()}if(a.matches('[data-action="edit"]')){const n=a.getAttribute("data-domain");if(n){const i=this.state.domains.findIndex(r=>r.id===n);i>=0&&(this.state={domains:T(this.state.domains),currentStep:i+1,showSummary:!1},this.render())}}}),document.addEventListener("input",t=>{const a=t.target;if(a.matches("[data-score]")){const n=a.getAttribute("data-score"),i=this.state.domains.find(r=>r.id===n);if(i){const r=Math.max(1,Math.min(5,parseInt(a.value,10)||1));i.score=r,K(this.state.domains),this.updateChart(),this.updateScoreDisplay(n,r)}}if(a.matches("[data-reflection]")){const n=a.getAttribute("data-reflection"),i=this.state.domains.find(r=>r.id===n);i&&(i.reflection=a.value,K(this.state.domains))}}),document.addEventListener("change",t=>{var n;const a=t.target;if(a.matches("[data-import-input]")){const i=(n=a.files)==null?void 0:n[0];if(i){const r=new FileReader;r.onload=()=>{try{const c=JSON.parse(r.result);c.domains&&Array.isArray(c.domains)?(U(c.domains),this.state={domains:T(c.domains),currentStep:0,showSummary:!1},this.render()):alert(s("import.error",this.language))}catch{alert(s("import.error",this.language))}},r.readAsText(i)}}})}setLanguage(t){this.language=t,this.showLanguageSelector=!1,q(t),this.updateHtmlLang(),this.render()}updateScoreDisplay(t,a){const n=document.querySelector('[data-score-value="'+t+'"]');n&&(n.textContent=String(a))}updateChart(){document.getElementById("live-chart")&&W("live-chart",this.state.domains),document.getElementById("summary-chart")&&W("summary-chart",this.state.domains)}render(){const t=document.getElementById("app");t&&(this.showLanguageSelector?t.innerHTML=this.renderLanguageSelector():this.showExportScreen?t.innerHTML=this.renderExportScreen():this.state.currentStep===0?t.innerHTML=this.renderWelcome():this.state.showSummary?(t.innerHTML=this.renderSummary(),this.updateChart()):(t.innerHTML=this.renderAssessment(),this.updateChart()))}renderLanguageSelector(){const t=P(),a=h=>h===t?" selected":"",n=e(s("lang.selectTitle","en")),i=e(s("lang.selectTitle","mi")),r=e(s("lang.selectSubtitle","en")),c=e(s("lang.selectSubtitle","mi"));return`
      <section class="lang-selector" aria-labelledby="lang-select-title">
        <div class="lang-selector-content">
          <h1 id="lang-select-title">
            <span class="lang-mi">${i}</span>
            <span class="lang-en">${n}</span>
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
      </section>`}renderAssessment(){const t=this.state.domains[this.state.currentStep-1];if(!t)return"";const a=this.state.currentStep,n=this.state.domains.length,i=e(this.domainDescription(t)),r=e(this.domainPrompt(t)),c=e(s("assessment.scoreLabel",this.language)),h=e(s("assessment.progressLabel",this.language)),p=e(s("assessment.stepOf",this.language,{step:String(a),total:String(n)})),d=e(s("assessment.startOver",this.language)),g=e(s("assessment.reflectionPlaceholder",this.language)),f=e(s("assessment.chartTitle",this.language)),v=e(s("assessment.chartNote",this.language)),k=e(s("assessment.scoreFormat",this.language)),$=e(s("assessment.chartScoreAria",this.language,{name:t.maoriName})),x=e(s("chart.liveAriaLabel",this.language)),L=e(s("nav.back",this.language)),M=e(a===n?s("nav.seeSummary",this.language):s("nav.next",this.language));return`
      <section class="assessment" aria-labelledby="domain-title">
        <header class="assessment-header">
          <div class="progress" role="progressbar" aria-valuenow="${a}" aria-valuemin="1" aria-valuemax="${n}" aria-label="${h}">
            <span class="progress-text">${p}</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${a/n*100}%"></div>
            </div>
          </div>
          <button type="button" class="btn text" data-action="reset">${d}</button>
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
            <div class="chart-container" id="live-chart" role="img" aria-label="${x}"></div>
            <p class="chart-note">${v}</p>
          </div>
        </div>

        <nav class="assessment-nav">
          <button type="button" class="btn secondary" data-action="prev" ${a===1?"disabled":""}>${L}</button>
          <button type="button" class="btn primary" data-action="next">
            ${M}
          </button>
        </nav>
      </section>`}renderSummary(){const t=this.state.domains,a=t.map(l=>l.score),n=a.reduce((l,w)=>l+w,0)/a.length,i=Math.min(...a),r=Math.max(...a),c=r-i,h=s("common.and",this.language),p=e(s("assessment.scoreFormat",this.language));let d="";if(c===0)d=e(s("summary.scoreEven",this.language));else if(c<=1)d=e(s("summary.scoreBalanced",this.language));else{const l=t.filter(b=>b.score===r).map(b=>this.domainName(b)),w=t.filter(b=>b.score===i).map(b=>this.domainName(b));d=e(s("summary.scoreSpread",this.language,{strongest:l.join(h),softest:w.join(h)}))}const g=e(s("summary.title",this.language)),f=e(s("summary.subtitle",this.language)),v=e(s("summary.noNotes",this.language)),k=e(s("summary.edit",this.language)),$=e(s("summary.disclaimer",this.language)),x=e(s("summary.backToEdit",this.language)),L=e(s("summary.print",this.language)),M=e(s("summary.startNew",this.language)),A=e(s("export.button",this.language)),N=e(s("import.button",this.language)),m=e(s("summary.avgNote",this.language,{avg:n.toFixed(1)})),y=e(s("chart.summaryAriaLabel",this.language)),u=t.map(l=>`
      <article class="summary-card">
        <h3>
          <span class="domain-names">
            <span class="maori">${e(l.maoriName)}</span>
            <span class="english">${e(l.name)}</span>
          </span>
          <span class="score-badge">${l.score}${p}</span>
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
            <div class="chart-container" id="summary-chart" role="img" aria-label="${y}"></div>
            <p class="shape-note">${d}</p>
            <p class="avg-note">${m}</p>
          </div>

          <div class="summary-cards">
            ${u}
          </div>
        </div>

        <div class="summary-footer">
          <p class="disclaimer">${$}</p>
          <div class="summary-actions">
            <button type="button" class="btn secondary" data-action="prev">${x}</button>
            <button type="button" class="btn primary" data-action="print">${L}</button>
            <button type="button" class="btn text" data-action="export">${A}</button>
            <button type="button" class="btn text" data-action="import">${N}</button>
            <input type="file" accept=".json" data-import-input style="display: none;" />
            <button type="button" class="btn text" data-action="reset">${M}</button>
          </div>
        </div>
      </section>`}renderExportScreen(){const t=e(s("export.title",this.language)),a=e(s("export.description",this.language)),n=e(s("export.downloadButton",this.language)),i=e(s("export.back",this.language)),c=this.state.domains.map(h=>{const p=this.language==="mi"?h.maoriName:h.name;return`<li>${e(p)}: ${h.score} / 5</li>`}).join("");return`
      <section class="export-screen" aria-labelledby="export-title">
        <div class="export-content">
          <h1 id="export-title">${t}</h1>
          <p class="export-description">${a}</p>
          <ul class="export-domain-list">
            ${c}
          </ul>
          <div class="export-actions">
            <button type="button" class="btn secondary" data-action="export-back">${i}</button>
            <button type="button" class="btn primary" data-action="export-download">${n}</button>
          </div>
        </div>
      </section>`}}const Q=()=>{new V};document.addEventListener("DOMContentLoaded",()=>{Q()});
