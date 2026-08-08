var P=Object.defineProperty;var j=(i,t,a)=>t in i?P(i,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):i[t]=a;var L=(i,t,a)=>j(i,typeof t!="symbol"?t+"":t,a);const N="te-whare-tapa-wha-assessment",R=[{id:"tinana",name:"Physical wellbeing",maoriName:"Taha tinana",description:"How your body feels and how you care for it — movement, rest, nourishment, and physical strength.",descriptionMi:"He aha tō kiko e noho nei, me tūpato koe i a ia — neke, moemoeā, kaiponu, me kaha tinana.",prompt:"What does looking after your tinana mean for you right now?",promptMi:"He aha te tikanga o tūpato i tō tinana mō koe kei ināianei?"},{id:"hinengaro",name:"Mental and emotional wellbeing",maoriName:"Taha hinengaro",description:"Your thoughts, feelings, and how you make sense of the world. Clear thinking and expressing what is going on inside.",descriptionMi:"Ōu whakaaro, ōu rongo, me tūpato koe i te ao. Whakaaro clear me āwhina i te mea e noho nei ki roto.",prompt:"How are your thoughts and feelings sitting with you at the moment?",promptMi:"He aha ōu whakaaro me rongo e noho nei mā koe pēlā?"},{id:"wairua",name:"Spiritual wellbeing",maoriName:"Taha wairua",description:"Your sense of meaning, connection to something greater, values, identity, and what gives your life purpose.",descriptionMi:"Tō whakapono o tētahi, hononga ki tētahi mea nui, āhua, whakapono, me te mea e homai nei he-āhua ki tō ao.",prompt:"What gives your life meaning or a sense of connection right now?",promptMi:"He aha e homai nei he-āhua ki tō ao rānei hononga kei ināianei?"},{id:"whanau",name:"Family and social wellbeing",maoriName:"Taha whānau",description:"The people you belong with — family, friends, community, and the relationships that support and shape you.",descriptionMi:"Ngā tāngata e tūpato ana koe — whānau, hoa, hapai, me ngā whakapā e tautoko ana me āhua koe.",prompt:"Who helps you feel you belong, and how are those connections for you?",promptMi:"Ko wai e āwhina ana kia tūpato koe, me he aha āu hononga?"}],D=()=>R.map(i=>({...i,score:3,reflection:""})),M=i=>i.map(t=>({...t})),Y=()=>{try{const i=localStorage.getItem(N);if(i){const t=JSON.parse(i);if(t.domains&&Array.isArray(t.domains))return{domains:t.domains}}}catch{}return null},B=i=>{try{localStorage.setItem(N,JSON.stringify({domains:[...i]}))}catch{}},J=()=>{try{const i=localStorage.getItem(N);if(i){const t=JSON.parse(i);if(t.domains&&Array.isArray(t.domains))return{domains:t.domains}}}catch{}return null},_=i=>{if(!Array.isArray(i))throw new Error("Invalid import data: domains must be an array");const t=["id","name","maoriName","description","prompt","score"];for(const a of i){for(const n of t)if(!Object.prototype.hasOwnProperty.call(a,n))throw new Error(`Invalid domain: missing required field "${n}"`);const e=a.score;if(typeof e!="number"||e<1||e>5)throw new Error("Invalid domain: score must be between 1 and 5")}try{localStorage.setItem(N,JSON.stringify({domains:[...i]}))}catch{}},U=()=>{try{localStorage.removeItem(N)}catch{}},K="te-whare-tapa-wha-language",q=()=>{try{const i=localStorage.getItem(K);if(i==="en"||i==="mi")return i}catch{}return null},G=i=>{try{localStorage.setItem(K,i)}catch{}},X=i=>{const t=i/2;return`
    <circle cx="${t}" cy="${t}" r="120" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.15"/>
    <circle cx="${t}" cy="${t}" r="90" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.12"/>
    <circle cx="${t}" cy="${t}" r="60" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.1"/>
    <path d="M${t},50 L${t+70},100 L${t+70},170 L${t},220 L${t-70},170 L${t-70},100 Z" fill="none" stroke="var(--chart-bg-custom)" stroke-width="1.2" opacity="0.1"/>
    <path d="M${t},80 L${t+40},110 L${t+40},160 L${t},190 L${t-40},160 L${t-40},110 Z" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.8" opacity="0.08"/>`},z=(i,t)=>{const a=i/2,e=110,n=5,r=t.length,c=Math.PI*2/r,m=-Math.PI/2,p="var(--chart-value-level-stroke)",g=[];for(let d=1;d<=n;d++){const f=d/n*e,u=[];for(let w=0;w<r;w++){const v=m+w*c,$=a+f*Math.cos(v),S=a+f*Math.sin(v);u.push(`${$.toFixed(2)},${S.toFixed(2)}`)}g.push(`<polygon points="${u.join(" ")}" fill="none" stroke="${p}" stroke-width="1" opacity="0.35" data-chart-level="${d}" style="pointer-events: auto;" />`)}return g.join("")},I=(i,t)=>{const a=document.getElementById(i);if(!a)return;const e=280,n=e/2,r=110,c=5,m=t.length,p=Math.PI*2/m,g=-Math.PI/2,d=t.map((h,y)=>{const b=g+y*p,l=h.score/5*r;return{x:n+l*Math.cos(b),y:n+l*Math.sin(b),labelX:n+(r+28)*Math.cos(b),labelY:n+(r+28)*Math.sin(b),domain:h}}),f=Array.from({length:c},(h,y)=>{const b=c-y,l=b/c*r;return`<polygon points="${Array.from({length:m},(k,H)=>{const C=g+H*p;return`${n+l*Math.cos(C)},${n+l*Math.sin(C)}`}).join(" ")}" class="chart-level level-${b}" />`}).join(""),u=Array.from({length:m},(h,y)=>{const b=g+y*p,l=n+r*Math.cos(b),x=n+r*Math.sin(b);return`<line x1="${n}" y1="${n}" x2="${l}" y2="${x}" class="chart-axis" />`}).join(""),v=`<polygon points="${d.map(h=>`${h.x},${h.y}`).join(" ")}" class="chart-data" />`,$=d.map(h=>`<circle cx="${h.x}" cy="${h.y}" r="8" class="chart-dot" data-domain="${h.domain.id}" />`).join(""),S=d.map(h=>{const y=h.domain.maoriName.replace("Taha ","");return`<text x="${h.labelX}" y="${h.labelY}" class="chart-label" text-anchor="middle" dominant-baseline="middle">${y}</text>`}).join(""),T=Array.from({length:c},(h,y)=>{const b=y+1,l=b/c*r,x=g,k=n+l*Math.cos(x)+10,H=n+l*Math.sin(x);return`<text x="${k}" y="${H}" class="chart-level-label">${b}</text>`}).join(""),E=X(e),A=z(e,t);a.innerHTML=`
    <svg viewBox="0 0 ${e} ${e}" width="100%" height="100%" class="radar-svg" aria-hidden="true">
      <g class="chart-bg-custom" aria-hidden="true">
        ${E}
      </g>
      <g class="chart-value-level-polygons" aria-hidden="true">
        ${A}
      </g>
      <g class="chart-bg">
        ${f}
        ${u}
      </g>
      ${v}
      ${$}
      ${S}
      ${T}
    </svg>`},W="en",Z=(i,t)=>t?i.replace(/\{(\w+)\}/g,(a,e)=>Object.prototype.hasOwnProperty.call(t,e)?String(t[e]):a):i,O={en:{"common.and":" and ","lang.selectTitle":"Choose your language","lang.selectSubtitle":"Select a language to begin","lang.option.en":"English","lang.option.mi":"Māori","lang.selectButton":"Start","welcome.subtitle":"A wellbeing reflection","welcome.intro1":"Te Whare Tapa Whā is a model of hauora developed by Sir Mason Durie. It describes four walls of a house, each representing a dimension of wellbeing. When the walls are strong and balanced, the house stands well.","welcome.intro2":"This tool is for personal reflection and conversation. It is not a diagnosis or clinical assessment. The meaning of each score belongs to you.","welcome.note":"This is a digital interpretation of the framework, offered with respect.","welcome.startButton":"Begin reflection","assessment.progressLabel":"Progress","assessment.stepOf":"Step {step} of {total}","assessment.startOver":"Start over","assessment.scoreLabel":"Where do you sit right now?","assessment.scoreFormat":" / 5","assessment.reflectionPlaceholder":"Your thoughts (optional)","assessment.chartTitle":"Your current shape","assessment.chartNote":"The shape updates as you move the slider. Stronger areas sit further out.","assessment.chartScoreAria":"Score for {name}","chart.liveAriaLabel":"Radar chart showing current wellbeing scores","chart.summaryAriaLabel":"Radar chart of your wellbeing scores","chart.fullscreenTitle":"Assessment chart","nav.back":"Back","nav.next":"Next","nav.seeSummary":"See summary","summary.title":"Your reflection","summary.subtitle":"A snapshot of where you sit right now","summary.scoreEven":"Your scores sit evenly across all four dimensions.","summary.scoreBalanced":"Your shape is fairly balanced, with only small differences between dimensions.","summary.scoreSpread":"Stronger areas include {strongest}. Areas sitting lower include {softest}.","summary.noNotes":"No notes added.","summary.edit":"Edit","summary.disclaimer":"This is a personal reflection tool based on Te Whare Tapa Whā. The scores and shape are yours to interpret. They do not replace professional support or conversation with people you trust.","summary.backToEdit":"Back to edit","summary.print":"Print or save as PDF","summary.startNew":"Start a new reflection","summary.avgNote":"Average across dimensions: {avg}","export.download":"Export assessment data","export.button":"Export","export.title":"Export your reflection","export.description":"Review your assessment data below, then download it as a JSON file.","export.downloadButton":"Download JSON file","export.back":"Back to summary","import.button":"Import","import.error":"Import failed. Please check the file format.","dialog.resetConfirm":"Start a new reflection? Your current scores and notes will be cleared."},mi:{"common.and":" me ","lang.selectTitle":"Whiriwhi i tō reo","lang.selectSubtitle":"Whiriwhi tētahi reo kia tīmata","lang.option.en":"English","lang.option.mi":"Māori","lang.selectButton":"Tīmata","welcome.subtitle":"He whakamātautautā hauora","welcome.intro1":"He taua hauora a Te Whare Tapa Whā, āwhakapapaia e Sir Mason Durie. E whakamārama ana i ngā pakaranga e whā o te whare, ko tētahi e tohutupu ana i tētahi ara hauora. Ki te kaha me tūturu ngā pakaranga, ka tūpato te whare.","welcome.intro2":"Ko tēnei taputapu he whakamātautautā motu-motu me kōrero. Kāore i tētahi whakapa rānei aromātakitanga kiriti. Ko te tikanga o tētahi tūtohi ke tōu.","welcome.note":"He whakamārama tuihāpai tōnei, āwhinatia ki te whakapono.","welcome.startButton":"Tīmata i te whakamātautautā","assessment.progressLabel":"Hāpai","assessment.stepOf":"Tūtohi {step} o {total}","assessment.startOver":"Tīmata anō","assessment.scoreLabel":"He aha tō āhua o ināianei?","assessment.scoreFormat":" / 5","assessment.reflectionPlaceholder":"Āu whakaaro (kōwhiri)","assessment.chartTitle":"Ko tō āhua o ināianei","assessment.chartNote":"Ka whakahoua tēnei āhua he rite i te tīmata o te koro. Ko ngā wāhi kaha kei tua.","assessment.chartScoreAria":"Tūtohi {name}","chart.liveAriaLabel":"Kahikātea radar e whaguanitia ana i ngā tūtohi hauora o ināianei","chart.summaryAriaLabel":"Kahikātea radar o āu tūtohi hauora","chart.fullscreenTitle":"Tūtohi aromātakitanga","nav.back":"Hoki","nav.next":"Panoni","nav.seeSummary":"Tirohanga mātautautā","summary.title":"Tō whakamātautautā","summary.subtitle":"He tirohanga o te wāhi e noho ana koe","summary.scoreEven":"Ke tūpato ō tūtohi i runga i ngā ara e whā.","summary.scoreBalanced":"He āhua tūturu rawa tō āhua, me pāmamahi iti noa i waenganui i ngā ara.","summary.scoreSpread":"Ko ngā wāhi kaha e whāngai ana i {strongest}. Ko ngā wāhi ponaku kei raro e whāngai ana i {softest}.","summary.noNotes":"Kāore he kōrero anō.","summary.edit":"Whakatika","summary.disclaimer":"He taputapu whakamātautautā motu-motu tōnei, āhono i te Whare Tapa Whā. Ko ngā tūtohi me te āhua ke tōu mā te whakapono. Kāore e korekorehu i te tautoko pūkenga rānei kōrero me ngā tāngata e whakapono ana koe.","summary.backToEdit":"Hoki ki te whakatika","summary.print":"Tāpata i te mātaitai","summary.startNew":"Tīmata whakamātautautā hou","summary.avgNote":"Neutoti i waenganui i ngā ara: {avg}","export.download":"Kawea i ngā raraunga aromātakitanga","export.button":"Kawea","export.title":"Kawea tō whakamātautautā","export.description":"Tirohia ō raraunga aromātakitanga ki raro, kātahi ka kukuhia hei kōnae JSON.","export.downloadButton":"Kukuhia te kōnae JSON","export.back":"Hoki ki te whakarāpopotanga","import.button":"Kuhu","import.error":"I rahua te kuhu. Tēnā whakamātau anō i te hōtuku.","dialog.resetConfirm":"Tīmata whakamātautautā hou? Ka konta o tūtohi me kōrero o ināianei."}},o=(i,t=W,a)=>{const n=(O[t]??O.en)[i]??O.en[i]??i;return Z(n,a)},s=i=>{const t=document.createElement("div");return t.textContent=i,t.innerHTML},F=()=>{var i;return typeof navigator<"u"&&((i=navigator.language)!=null&&i.startsWith("mi"))?"mi":W};class V{constructor(){L(this,"state");L(this,"language");L(this,"showLanguageSelector");L(this,"showExportScreen",!1);L(this,"showFullscreenChart",!1);L(this,"domainName",t=>this.language==="mi"?t.maoriName:t.name);L(this,"domainDescription",t=>this.language==="mi"?t.descriptionMi??t.description:t.description);L(this,"domainPrompt",t=>this.language==="mi"?t.promptMi??t.prompt:t.prompt);const t=q();this.language=t??F(),this.showLanguageSelector=t===null;const a=Y();this.state={domains:(a==null?void 0:a.domains)??D(),currentStep:0,showSummary:!1},this.init()}init(){this.updateHtmlLang(),this.render(),this.bindEvents()}updateHtmlLang(){document.documentElement.setAttribute("lang",this.language)}bindEvents(){document.addEventListener("click",t=>{const a=t.target;if(a.matches('[data-action="select-lang"]')){const e=a.getAttribute("data-lang");this.setLanguage(e);return}if(a.matches('[data-action="start"]')&&(this.state={domains:M(this.state.domains),currentStep:1,showSummary:!1},this.render()),a.matches('[data-action="next"]')&&(this.state.currentStep<this.state.domains.length?this.state={domains:M(this.state.domains),currentStep:this.state.currentStep+1,showSummary:!1}:this.state={domains:M(this.state.domains),currentStep:this.state.domains.length,showSummary:!0},this.render()),a.matches('[data-action="prev"]')&&(this.state.showSummary?this.state={domains:M(this.state.domains),currentStep:this.state.domains.length,showSummary:!1}:this.state.currentStep>1&&(this.state={domains:M(this.state.domains),currentStep:this.state.currentStep-1,showSummary:!1}),this.render()),a.matches('[data-action="reset"]')&&confirm(o("dialog.resetConfirm",this.language))&&(U(),this.state={domains:D(),currentStep:0,showSummary:!1},this.render()),a.matches('[data-action="print"]')&&window.print(),a.matches('[data-action="export"]')){this.showExportScreen=!0,this.render();return}if(a.matches('[data-action="export-download"]')){const e=J();if(e){const n=new Blob([JSON.stringify(e)],{type:"application/json"}),r=URL.createObjectURL(n),c=document.createElement("a");c.href=r,c.download="te-whare-tapa-wha-assessment.json",c.click(),URL.revokeObjectURL(r)}return}if(a.matches('[data-action="export-back"]')){this.showExportScreen=!1,this.render();return}if(a.matches('[data-action="chart-expand"]')){this.showFullscreenChart=!0,this.render();return}if(a.matches('[data-action="chart-close"]')){this.showFullscreenChart=!1,this.render();return}if(a.matches(".chart-value-level-polygons polygon")){const e=parseInt(a.getAttribute("data-chart-level")||"0",10);if(e>=1&&e<=5&&this.state.currentStep>0&&!this.state.showSummary){const n=this.state.domains[this.state.currentStep-1];n&&(n.score=e,B(this.state.domains),this.render())}return}if(a.matches(".chart-dot")){const e=a.getAttribute("data-domain");if(e&&this.state.currentStep>0&&!this.state.showSummary){const n=this.state.domains[this.state.currentStep-1];n&&n.id===e&&this.startDotDrag(t,e)}return}if(a.matches('[data-action="import"]')){const e=document.querySelector("[data-import-input]");e==null||e.click()}if(a.matches('[data-action="edit"]')){const e=a.getAttribute("data-domain");if(e){const n=this.state.domains.findIndex(r=>r.id===e);n>=0&&(this.state={domains:M(this.state.domains),currentStep:n+1,showSummary:!1},this.render())}}}),document.addEventListener("input",t=>{const a=t.target;if(a.matches("[data-score]")){const e=a.getAttribute("data-score"),n=this.state.domains.find(r=>r.id===e);if(n){const r=Math.max(1,Math.min(5,parseInt(a.value,10)||1));n.score=r,B(this.state.domains),this.updateChart(),this.updateScoreDisplay(e,r)}}if(a.matches("[data-reflection]")){const e=a.getAttribute("data-reflection"),n=this.state.domains.find(r=>r.id===e);n&&(n.reflection=a.value,B(this.state.domains))}}),document.addEventListener("change",t=>{var e;const a=t.target;if(a.matches("[data-import-input]")){const n=(e=a.files)==null?void 0:e[0];if(n){const r=new FileReader;r.onload=()=>{try{const c=JSON.parse(r.result);_(c.domains),this.state={domains:M(c.domains),currentStep:0,showSummary:!1},this.render()}catch{alert(o("import.error",this.language))}},r.readAsText(n)}}})}setLanguage(t){this.language=t,this.showLanguageSelector=!1,G(t),this.updateHtmlLang(),this.render()}updateScoreDisplay(t,a){const e=document.querySelector('[data-score-value="'+t+'"]');e&&(e.textContent=String(a))}startDotDrag(t,a){const e=document.querySelector(".radar-svg");if(!e)return;const n=e.getBoundingClientRect(),r=280,c=r/2,m=110,p=this.state.domains[this.state.currentStep-1];if(!p||this.state.domains.findIndex(u=>u.id===a)<0)return;const d=u=>{u.preventDefault();const w="touches"in u?u.touches[0].clientX:u.clientX,v="touches"in u?u.touches[0].clientY:u.clientY,$=(w-n.left)/(n.width??r)*r,S=(v-n.top)/(n.height??r)*r,T=$-c,E=S-c,A=Math.sqrt(T*T+E*E),h=Math.max(0,Math.min(A,m)),y=Math.max(1,Math.min(5,Math.round(h/m*5)));y!==p.score&&(p.score=y,B(this.state.domains),this.updateChart(),this.updateScoreDisplay(a,y))},f=()=>{document.removeEventListener("mousemove",d),document.removeEventListener("mouseup",f),document.removeEventListener("touchmove",d),document.removeEventListener("touchend",f)};document.addEventListener("mousemove",d),document.addEventListener("mouseup",f),document.addEventListener("touchmove",d,{passive:!1}),document.addEventListener("touchend",f)}updateChart(){document.getElementById("live-chart")&&I("live-chart",this.state.domains),document.getElementById("summary-chart")&&I("summary-chart",this.state.domains)}render(){const t=document.getElementById("app");t&&(this.showLanguageSelector?t.innerHTML=this.renderLanguageSelector():this.showExportScreen?t.innerHTML=this.renderExportScreen():this.state.currentStep===0?t.innerHTML=this.renderWelcome():this.showFullscreenChart?(t.innerHTML=this.renderFullscreenChart(),this.updateFullscreenChart()):this.state.showSummary?(t.innerHTML=this.renderSummary(),this.updateChart()):(t.innerHTML=this.renderAssessment(),this.updateChart()))}renderLanguageSelector(){const t=F(),a=m=>m===t?" selected":"",e=s(o("lang.selectTitle","en")),n=s(o("lang.selectTitle","mi")),r=s(o("lang.selectSubtitle","en")),c=s(o("lang.selectSubtitle","mi"));return`
      <section class="lang-selector" aria-labelledby="lang-select-title">
        <div class="lang-selector-content">
          <h1 id="lang-select-title">
            <span class="lang-mi">${n}</span>
            <span class="lang-en">${e}</span>
          </h1>
          <p class="lang-subtitle">
            <span class="lang-mi">${c}</span>
            <span class="lang-en">${r}</span>
          </p>
          <div class="lang-options" role="radiogroup" aria-label="${s(o("lang.selectTitle",this.language))}">
            <button type="button" class="lang-option${a("en")}" data-action="select-lang" data-lang="en" aria-checked="${t==="en"?"true":"false"}">
              ${s(o("lang.option.en","en"))}
            </button>
            <button type="button" class="lang-option${a("mi")}" data-action="select-lang" data-lang="mi" aria-checked="${t==="mi"?"true":"false"}">
              ${s(o("lang.option.mi","mi"))}
            </button>
          </div>
        </div>
      </section>`}renderWelcome(){return`
      <section class="welcome" aria-labelledby="welcome-title">
        <div class="welcome-content">
          <h1 id="welcome-title">Te Whare Tapa Whā</h1>
          <p class="subtitle">${s(o("welcome.subtitle",this.language))}</p>
          <p class="intro">${s(o("welcome.intro1",this.language))}</p>
          <p class="intro">${s(o("welcome.intro2",this.language))}</p>
          <p class="note">${s(o("welcome.note",this.language))}</p>
          <button type="button" class="btn primary" data-action="start">
            ${s(o("welcome.startButton",this.language))}
          </button>
        </div>
      </section>`}renderAssessment(){const t=this.state.domains[this.state.currentStep-1];if(!t)return"";const a=this.state.currentStep,e=this.state.domains.length,n=s(this.domainDescription(t)),r=s(this.domainPrompt(t)),c=s(o("assessment.scoreLabel",this.language)),m=s(o("assessment.progressLabel",this.language)),p=s(o("assessment.stepOf",this.language,{step:String(a),total:String(e)})),g=s(o("assessment.startOver",this.language)),d=s(o("assessment.reflectionPlaceholder",this.language)),f=s(o("assessment.chartTitle",this.language)),u=s(o("assessment.chartNote",this.language)),w=s(o("assessment.scoreFormat",this.language)),v=s(o("assessment.chartScoreAria",this.language,{name:t.maoriName})),$=s(o("chart.liveAriaLabel",this.language)),S=s(o("nav.back",this.language)),T=s(a===e?o("nav.seeSummary",this.language):o("nav.next",this.language));return`
      <section class="assessment" aria-labelledby="domain-title">
        <header class="assessment-header">
          <div class="progress" role="progressbar" aria-valuenow="${a}" aria-valuemin="1" aria-valuemax="${e}" aria-label="${m}">
            <span class="progress-text">${p}</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${a/e*100}%"></div>
            </div>
          </div>
          <button type="button" class="btn text" data-action="reset">${g}</button>
        </header>

        <div class="assessment-body">
          <div class="domain-panel">
            <h2 id="domain-title">
              <span class="maori">${s(t.maoriName)}</span>
              <span class="english">${s(t.name)}</span>
            </h2>
            <p class="domain-desc">${n}</p>

            <div class="score-control">
              <label for="score-${t.id}">
                ${c} <span class="score-value" data-score-value="${t.id}">${t.score}</span>${w}
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
                aria-label="${v}"
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
                placeholder="${d}"
              >${s(t.reflection)}</textarea>
            </div>
          </div>

          <div class="chart-panel">
            <h3 class="chart-title">${f}</h3>
            <button type="button" class="chart-expand-btn" data-action="chart-expand" aria-label="Expand chart">⛶</button>
            <div class="chart-container" id="live-chart" role="img" aria-label="${$}"></div>
            <p class="chart-note">${u}</p>
          </div>
        </div>

        <nav class="assessment-nav">
          <button type="button" class="btn secondary" data-action="prev" ${a===1?"disabled":""}>${S}</button>
          <button type="button" class="btn primary" data-action="next">
            ${T}
          </button>
        </nav>
      </section>`}renderSummary(){const t=this.state.domains,a=t.map(l=>l.score),e=a.reduce((l,x)=>l+x,0)/a.length,n=Math.min(...a),r=Math.max(...a),c=r-n,m=o("common.and",this.language),p=s(o("assessment.scoreFormat",this.language));let g="";if(c===0)g=s(o("summary.scoreEven",this.language));else if(c<=1)g=s(o("summary.scoreBalanced",this.language));else{const l=t.filter(k=>k.score===r).map(k=>this.domainName(k)),x=t.filter(k=>k.score===n).map(k=>this.domainName(k));g=s(o("summary.scoreSpread",this.language,{strongest:l.join(m),softest:x.join(m)}))}const d=s(o("summary.title",this.language)),f=s(o("summary.subtitle",this.language)),u=s(o("summary.noNotes",this.language)),w=s(o("summary.edit",this.language)),v=s(o("summary.disclaimer",this.language)),$=s(o("summary.backToEdit",this.language)),S=s(o("summary.print",this.language)),T=s(o("summary.startNew",this.language)),E=s(o("export.button",this.language)),A=s(o("import.button",this.language)),h=s(o("summary.avgNote",this.language,{avg:e.toFixed(1)})),y=s(o("chart.summaryAriaLabel",this.language)),b=t.map(l=>`
      <article class="summary-card">
        <h3>
          <span class="domain-names">
            <span class="maori">${s(l.maoriName)}</span>
            <span class="english">${s(l.name)}</span>
          </span>
          <span class="score-badge">${l.score}${p}</span>
        </h3>
        ${l.reflection?`<p class="summary-note">"${s(l.reflection)}"</p>`:`<p class="summary-note muted">${u}</p>`}
        <button type="button" class="btn text small" data-action="edit" data-domain="${l.id}">${w}</button>
      </article>
    `).join("");return`
      <section class="summary" aria-labelledby="summary-title">
        <header class="summary-header">
          <h1 id="summary-title">${d}</h1>
          <p class="subtitle">${f}</p>
        </header>

        <div class="summary-body">
          <div class="chart-panel large">
            <button type="button" class="chart-expand-btn" data-action="chart-expand" aria-label="Expand chart">⛶</button>
            <div class="chart-container" id="summary-chart" role="img" aria-label="${y}"></div>
            <p class="shape-note">${g}</p>
            <p class="avg-note">${h}</p>
          </div>

          <div class="summary-cards">
            ${b}
          </div>
        </div>

        <div class="summary-footer">
          <p class="disclaimer">${v}</p>
          <div class="summary-actions">
            <button type="button" class="btn secondary" data-action="prev">${$}</button>
            <button type="button" class="btn primary" data-action="print">${S}</button>
            <button type="button" class="btn text" data-action="export">${E}</button>
            <button type="button" class="btn text" data-action="import">${A}</button>
            <input type="file" accept=".json" data-import-input style="display: none;" aria-label="${A}" />
            <button type="button" class="btn text" data-action="reset">${T}</button>
          </div>
        </div>
      </section>`}renderExportScreen(){const t=s(o("export.title",this.language)),a=s(o("export.description",this.language)),e=s(o("export.downloadButton",this.language)),n=s(o("export.back",this.language)),c=this.state.domains.map(m=>{const p=this.language==="mi"?m.maoriName:m.name;return`<li>${s(p)}: ${m.score} / 5</li>`}).join("");return`
      <section class="export-screen" aria-labelledby="export-title">
        <div class="export-content">
          <h1 id="export-title">${t}</h1>
          <p class="export-description">${a}</p>
          <ul class="export-domain-list">
            ${c}
          </ul>
          <div class="export-actions">
            <button type="button" class="btn secondary" data-action="export-back">${n}</button>
            <button type="button" class="btn primary" data-action="export-download">${e}</button>
          </div>
        </div>
      </section>`}renderFullscreenChart(){const t=s(o("chart.fullscreenTitle",this.language)),a=s(o("nav.back",this.language)),e=this.state.showSummary?'<div class="chart-container" id="fullscreen-chart" role="img" aria-label="'+s(o("chart.summaryAriaLabel",this.language))+'"></div>':'<div class="chart-container" id="fullscreen-chart" role="img" aria-label="'+s(o("chart.liveAriaLabel",this.language))+'"></div>';return`
      <section class="fullscreen-chart" aria-labelledby="fullscreen-chart-title">
        <div class="fullscreen-chart-content">
          <h1 id="fullscreen-chart-title">${t}</h1>
          ${e}
          <button type="button" class="btn secondary chart-close" data-action="chart-close">${a}</button>
        </div>
      </section>`}updateFullscreenChart(){setTimeout(()=>{(this.state.showSummary||this.state.currentStep>0)&&I("fullscreen-chart",this.state.domains)},0)}}const Q=()=>{new V};document.addEventListener("DOMContentLoaded",()=>{Q()});
