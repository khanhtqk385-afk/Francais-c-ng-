
/* FRANÇAIS PLUS - FRONTEND APP
   Frontend chạy trên GitHub Pages.
   Backend AI được đặt riêng trong worker.js.
*/
(() => {
  'use strict';

  const $ = id => document.getElementById(id);

  // Điền URL Worker thật sau khi triển khai.
  // Ví dụ: https://ten-worker.ten-tai-khoan.workers.dev/api/chat
  window.FP_AI_API_URL = window.FP_AI_API_URL || "";

  const LEVELS = {
    A1: {
      name: "Débutant",
      desc: "Giao tiếp cơ bản",
      lessons: [
        ["Se présenter","Giới thiệu bản thân","Bonjour ! Je m’appelle Lan."],
        ["La famille","Gia đình","Voici ma famille."],
        ["La vie quotidienne","Sinh hoạt hằng ngày","Je me lève à sept heures."],
        ["Les goûts","Sở thích","J’aime la musique et le cinéma."]
      ]
    },
    A2: {
      name: "Élémentaire",
      desc: "Giao tiếp quen thuộc",
      lessons: [
        ["Voyages et vacances","Du lịch và kỳ nghỉ","L’année dernière, je suis allé à Paris."],
        ["Faire des achats","Mua sắm","Je voudrais acheter cette chemise."],
        ["La santé","Sức khỏe","Je dois prendre rendez-vous."],
        ["La ville","Thành phố","La pharmacie est près de la banque."]
      ]
    },
    B1: {
      name: "Intermédiaire",
      desc: "Diễn đạt ý kiến",
      lessons: [
        ["Études et travail","Học tập và công việc","Je voudrais poursuivre mes études en France."],
        ["Les médias","Truyền thông","Les réseaux sociaux influencent notre quotidien."],
        ["Environnement","Môi trường","Il faut réduire les déchets."],
        ["Relations sociales","Quan hệ xã hội","À mon avis, le dialogue est essentiel."]
      ]
    },
    B2: {
      name: "Avancé",
      desc: "Lập luận và thảo luận",
      lessons: [
        ["Société et citoyenneté","Xã hội và công dân","La participation citoyenne renforce la démocratie."],
        ["Sciences et technologies","Khoa học và công nghệ","Le progrès technologique soulève des questions éthiques."],
        ["Culture et identité","Văn hóa và bản sắc","La diversité culturelle est une richesse."],
        ["Débats contemporains","Các vấn đề đương đại","Il convient de nuancer cette affirmation."]
      ]
    }
  };

  const QUIZZES = {
    A1: [
      {q:"Comment dit-on 'Xin chào' ?",o:["Bonjour","Merci","Au revoir","Pardon"],a:0,e:"Bonjour có nghĩa là xin chào."},
      {q:"Je ___ vietnamien.",o:["es","suis","est","sommes"],a:1,e:"Je suis là cách chia đúng của être."},
      {q:"Quel est le féminin de étudiant ?",o:["étudiente","étudiante","étudiants","étudier"],a:1,e:"étudiant → étudiante."},
      {q:"Nous signifie…",o:["Tôi","Bạn","Chúng tôi","Họ"],a:2,e:"Nous nghĩa là chúng tôi/chúng ta."}
    ],
    A2: [
      {q:"Hier, nous ___ au cinéma.",o:["allons","sommes allés","irons","aller"],a:1,e:"Passé composé của aller dùng être."},
      {q:"Je voudrais ___ eau.",o:["de l’","du","des","à la"],a:0,e:"Eau là danh từ bắt đầu bằng nguyên âm."},
      {q:"Depuis deux ans diễn tả…",o:["Tương lai","Hành động bắt đầu trong quá khứ và còn tiếp diễn","Mệnh lệnh","Một thời điểm tương lai"],a:1,e:"Depuis diễn tả khoảng thời gian còn tiếp tục."},
      {q:"Quel mot est un adverbe ?",o:["Rapide","Rapidement","Rapidité","Ralentir"],a:1,e:"Rapidement là trạng từ."}
    ],
    B1: [
      {q:"Si j’avais plus de temps, je ___ davantage.",o:["voyage","voyagerai","voyagerais","voyagé"],a:2,e:"Si + imparfait, conditionnel présent."},
      {q:"Il faut que tu ___ à l’heure.",o:["viens","viendras","viennes","venir"],a:2,e:"Il faut que đi với subjonctif."},
      {q:"Cependant exprime…",o:["La cause","L’opposition","La conséquence","Le but"],a:1,e:"Cependant chỉ sự đối lập."},
      {q:"Chọn câu đúng.",o:["Bien qu’il est tard","Bien qu’il soit tard","Bien qu’il sera tard","Bien qu’il être tard"],a:1,e:"Bien que + subjonctif."}
    ],
    B2: [
      {q:"Il aurait réussi s’il ___ davantage.",o:["travaille","avait travaillé","travaillera","travaille demain"],a:1,e:"Si + plus-que-parfait, conditionnel passé."},
      {q:"Nonobstant signifie…",o:["Malgré","Grâce à","À cause de","Afin de"],a:0,e:"Nonobstant nghĩa là bất chấp."},
      {q:"Quelle tournure exprime une concession ?",o:["De sorte que","Bien que","Parce que","Afin que"],a:1,e:"Bien que diễn tả sự nhượng bộ."},
      {q:"Il convient de souligner que…",o:["Cần nhấn mạnh rằng","Tôi phản đối","Tôi quên rằng","Tôi không biết"],a:0,e:"Đây là cách diễn đạt trang trọng."}
    ]
  };

  const WORDS = [
    ["bonjour","xin chào","interjection"],
    ["merci","cảm ơn","nom"],
    ["au revoir","tạm biệt","expression"],
    ["la famille","gia đình","nom féminin"],
    ["un ami","một người bạn","nom masculin"],
    ["la maison","ngôi nhà","nom féminin"],
    ["l’école","trường học","nom féminin"],
    ["apprendre","học","verbe"],
    ["comprendre","hiểu","verbe"],
    ["parler","nói","verbe"],
    ["voyager","du lịch","verbe"],
    ["un voyage","chuyến đi","nom masculin"],
    ["la santé","sức khỏe","nom féminin"],
    ["le travail","công việc","nom masculin"],
    ["réussir","thành công","verbe"],
    ["pourtant","tuy nhiên","adverbe"],
    ["cependant","tuy nhiên","connecteur"],
    ["néanmoins","tuy vậy","adverbe"],
    ["environnement","môi trường","nom masculin"],
    ["la société","xã hội","nom féminin"]
  ];

  const DEFAULT_STATE = {
    done: [],
    scores: [],
    reviewed: [],
    days: [],
    lastLevel: "A1"
  };

  let state = loadState();
  let selectedLevel = "A1";
  let activeQuiz = null;
  let activeBot = "tutor";
  let chatHistory = [];

  const BOT_NAMES = {
    tutor:"Gia sư tiếng Pháp",
    conversation:"Luyện hội thoại",
    exam:"Luyện thi DELF",
    vocab:"Trợ lý từ vựng"
  };

  const BOT_SUBS = {
    tutor:"Giải thích ngữ pháp, sửa câu và đưa ví dụ",
    conversation:"Thực hành hội thoại theo tình huống",
    exam:"Luyện kỹ năng theo định hướng DELF",
    vocab:"Giải nghĩa và mở rộng vốn từ"
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem("fp_state") || "null");

      if (!saved || typeof saved !== "object") {
        return {...DEFAULT_STATE};
      }

      return {
        done: Array.isArray(saved.done) ? saved.done : [],
        scores: Array.isArray(saved.scores) ? saved.scores : [],
        reviewed: Array.isArray(saved.reviewed) ? saved.reviewed : [],
        days: Array.isArray(saved.days) ? saved.days : [],
        lastLevel: LEVELS[saved.lastLevel] ? saved.lastLevel : "A1"
      };
    } catch (error) {
      console.warn("Không đọc được tiến độ cũ.", error);
      return {...DEFAULT_STATE};
    }
  }

  function saveState() {
    try {
      localStorage.setItem("fp_state", JSON.stringify(state));
    } catch (error) {
      console.warn("Không thể lưu tiến độ.", error);
    }
    updateStats();
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function markStudyDay() {
    const day = todayKey();
    if (!state.days.includes(day)) state.days.push(day);
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#39;"
    }[c]));
  }

  function jsString(s) {
    return "'" + String(s)
      .replace(/\\/g,"\\\\")
      .replace(/'/g,"\\'")
      .replace(/\r?\n/g,"\\n") + "'";
  }

  // ĐIỀU HƯỚNG
  function showView(name) {
    document.querySelectorAll(".view").forEach(v => {
      v.classList.toggle("active",v.id===name);
    });

    document.querySelectorAll(".navbtn").forEach(b => {
      b.classList.toggle("active",b.dataset.view===name);
    });

    if(name==="progress") renderProgress();
    if(name==="vocab") renderWords();

    window.scrollTo({top:0,behavior:"smooth"});
  }

  // CẤP ĐỘ
  function renderLevels() {
    const html = Object.entries(LEVELS).map(([level,data]) => {
      const count = state.done.filter(x => x.startsWith(level+"-")).length;
      const percent = Math.round(count/data.lessons.length*100);

      return `
        <button class="level" onclick="chooseLevel('${level}')">
          <strong>${level}</strong>
          <b>${data.name}</b>
          <small>${data.desc}</small>
          <div class="progress">
            <i style="width:${percent}%"></i>
          </div>
        </button>
      `;
    }).join("");

    $("homeLevels").innerHTML = html;
    $("courseLevels").innerHTML = html;
  }

  function chooseLevel(level) {
    if(!LEVELS[level]) return;

    selectedLevel = level;
    state.lastLevel = level;

    saveState();
    renderCourse(level);
    showView("courses");
  }

  // KHÓA HỌC
  function renderCourse(level) {
    const data = LEVELS[level];
    if(!data) return;

    selectedLevel = level;

    $("courseDetail").innerHTML = `
      <div class="between" style="margin:20px 0 12px">
        <div>
          <h2>${level} – ${data.name}</h2>
          <p class="muted">${data.desc}. Chọn một unité để học.</p>
        </div>
        <span class="tag">${data.lessons.length} unités mẫu</span>
      </div>

      <div class="lessonlist">
        ${data.lessons.map((l,i) => {
          const id = level+"-"+i;
          const done = state.done.includes(id);

          return `
            <article class="lessoncard">
              <div>
                <span class="tag">UNITÉ ${i+1}</span>
                <h3>${escapeHTML(l[0])} ${done?"✓":""}</h3>
                <p>${escapeHTML(l[1])}</p>
              </div>
              <button class="btn ${done?"secondary":""}"
                onclick="openLesson('${level}',${i})">
                ${done?"Ôn tập":"Bắt đầu học"}
              </button>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function openLesson(level,index) {
    const lesson = LEVELS[level]?.lessons[index];
    if(!lesson) return;

    const id = level+"-"+index;

    $("lessonContent").innerHTML = `
      <span class="tag">${level} · UNITÉ ${index+1}</span>
      <h2>${escapeHTML(lesson[0])}</h2>
      <p class="muted">${escapeHTML(lesson[1])}</p>

      <div class="panel">
        <h3>Objectif – Mục tiêu</h3>
        <p>Sử dụng từ vựng và cấu trúc cơ bản liên quan đến chủ đề.</p>

        <h3>Exemple – Ví dụ</h3>
        <p style="font-size:20px;color:var(--navy)">
          ${escapeHTML(lesson[2])}
        </p>

        <button class="btn secondary"
          onclick="speakFrench(${jsString(lesson[2])})">
          🔊 Nghe phát âm
        </button>
      </div>

      <div class="panel" style="margin-top:12px">
        <h3>À retenir – Ghi nhớ</h3>
        <p>Đọc câu ví dụ và thử tự đặt thêm hai câu tương tự.</p>
      </div>

      <button class="btn" style="margin-top:14px"
        onclick="completeLesson('${id}','${level}')">
        Đánh dấu hoàn thành ✓
      </button>
    `;

    showView("lesson");
  }

  function completeLesson(id,level) {
    if(!state.done.includes(id)) state.done.push(id);

    state.lastLevel = level;
    markStudyDay();
    saveState();
    renderLevels();
    renderCourse(level);

    $("lessonContent").insertAdjacentHTML(
      "beforeend",
      '<p class="feedback" style="color:var(--green)">Bravo ! Bài học đã được lưu.</p>'
    );
  }

  // BÀI TẬP
  function startQuiz() {
    const level = $("practiceLevel").value;
    const source = QUIZZES[level];

    if(!source) {
      $("quizArea").textContent = "Không tìm thấy bài tập.";
      return;
    }

    activeQuiz = {
      level,
      questions: source,
      answers: {}
    };

    $("quizArea").innerHTML = source.map((q,i) => `
      <div class="question">
        <b>Câu ${i+1}. ${escapeHTML(q.q)}</b>

        ${q.o.map((opt,j) => `
          <button class="option" id="opt-${i}-${j}"
            onclick="chooseAnswer(${i},${j})">
            ${String.fromCharCode(65+j)}. ${escapeHTML(opt)}
          </button>
        `).join("")}

        <div id="feedback-${i}" class="feedback"></div>
      </div>
    `).join("") + `
      <button class="btn" onclick="submitQuiz()">
        Nộp bài và xem kết quả
      </button>
      <div id="quizResult"></div>
    `;
  }

  function chooseAnswer(qi,oi) {
    if(!activeQuiz || activeQuiz.answers.submitted) return;

    activeQuiz.answers[qi] = oi;

    activeQuiz.questions[qi].o.forEach((_,j) => {
      $("opt-"+qi+"-"+j).classList.toggle("selected",j===oi);
    });
  }

  function submitQuiz() {
    if(!activeQuiz) return;

    const {level,questions,answers} = activeQuiz;
    const count = Object.keys(answers).filter(k=>k!=="submitted").length;

    if(count!==questions.length) {
      $("quizResult").innerHTML =
        '<p class="notice">Hãy chọn đáp án cho tất cả câu hỏi.</p>';
      return;
    }

    let correct = 0;

    questions.forEach((q,i) => {
      const chosen = answers[i];
      const ok = chosen===q.a;

      if(ok) correct++;

      q.o.forEach((_,j) => {
        const el = $("opt-"+i+"-"+j);
        el.disabled = true;

        if(j===q.a) el.classList.add("correct");
        else if(j===chosen) el.classList.add("wrong");
      });

      $("feedback-"+i).textContent =
        (ok?"Đúng! ":"Chưa chính xác. ")+q.e;
    });

    answers.submitted = true;

    const score = Math.round(correct/questions.length*10);

    state.scores.push({
      level,
      score,
      date:todayKey()
    });

    markStudyDay();
    saveState();

    $("quizResult").innerHTML = `
      <div class="panel" style="margin-top:14px">
        <h3>Kết quả: ${correct}/${questions.length} câu đúng</h3>
        <p>Điểm: <b>${score}/10</b></p>
        <p>${score>=8?"Excellent !":score>=5?"Bon travail !":"Tiếp tục luyện tập nhé !"}</p>
      </div>
    `;
  }

  // TỪ VỰNG
  function renderWords() {
    const query = ($("wordSearch")?.value||"")
      .trim()
      .toLocaleLowerCase("vi");

    const rows = WORDS.filter(w =>
      w.join(" ").toLocaleLowerCase("vi").includes(query)
    );

    $("wordList").innerHTML = rows.length
      ? rows.map(w => `
        <div class="word">
          <div>
            <strong>${escapeHTML(w[0])}</strong>
            <div class="muted">
              ${escapeHTML(w[1])} · ${escapeHTML(w[2])}
            </div>
          </div>

          <div class="row">
            <button class="btn secondary"
              onclick="speakFrench(${jsString(w[0])})">🔊</button>

            <button class="btn ghost"
              onclick="reviewWord(${jsString(w[0])})">
              ${state.reviewed.includes(w[0])?"✓":"Ôn"}
            </button>
          </div>
        </div>
      `).join("")
      : '<div class="empty">Không tìm thấy từ phù hợp.</div>';
  }

  function reviewWord(word) {
    if(!state.reviewed.includes(word)) {
      state.reviewed.push(word);
    }

    markStudyDay();
    saveState();
    renderWords();
  }

  function speakFrench(text) {
    if(!("speechSynthesis" in window)) {
      alert("Trình duyệt chưa hỗ trợ đọc văn bản.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  // THỐNG KÊ
  function updateStats() {
    if($("statDone")) $("statDone").textContent = state.done.length;

    if($("statWords")) $("statWords").textContent = state.reviewed.length;

    if($("statScore")) {
      $("statScore").textContent = state.scores.length
        ? (state.scores.reduce((s,x)=>s+x.score,0)/state.scores.length).toFixed(1)+"/10"
        : "—";
    }

    let streak = 0;
    const days = new Set(state.days);
    const d = new Date();
    d.setHours(0,0,0,0);

    while(days.has(
      `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
    )) {
      streak++;
      d.setDate(d.getDate()-1);
    }

    if($("statStreak")) $("statStreak").textContent = streak;

    if($("continueBox")) {
      $("continueBox").innerHTML = `
        Trình độ gần nhất: <b>${state.lastLevel}</b>
        <button class="btn secondary"
          onclick="chooseLevel('${state.lastLevel}')">
          Tiếp tục học
        </button>
      `;
    }
  }

  function renderProgress() {
    const total = Object.values(LEVELS)
      .reduce((n,x)=>n+x.lessons.length,0);

    $("progressContent").innerHTML = `
      <div class="stats">
        <div class="stat">
          <b>${state.done.length}/${total}</b>
          <span>Bài học hoàn thành</span>
        </div>
        <div class="stat">
          <b>${state.scores.length}</b>
          <span>Lượt kiểm tra</span>
        </div>
        <div class="stat">
          <b>${state.reviewed.length}</b>
          <span>Từ đã ôn</span>
        </div>
        <div class="stat">
          <b>${state.days.length}</b>
          <span>Ngày đã học</span>
        </div>
      </div>

      ${Object.entries(LEVELS).map(([l,d]) => {
        const n = state.done.filter(x=>x.startsWith(l+"-")).length;

        return `
          <div class="panel" style="margin:10px 0">
            <div class="between">
              <b>${l} – ${d.name}</b>
              <span>${n}/${d.lessons.length}</span>
            </div>
            <div class="progress">
              <i style="width:${n/d.lessons.length*100}%"></i>
            </div>
          </div>
        `;
      }).join("")}
    `;
  }

  // CHATBOT AI
  function selectBot(bot) {
    if(!BOT_NAMES[bot]) return;

    activeBot = bot;
    chatHistory = [];

    document.querySelectorAll(".bot-choice").forEach(b => {
      b.classList.toggle("active",b.dataset.bot===bot);
    });

    $("botTitle").textContent = BOT_NAMES[bot];
    $("botSubtitle").textContent = BOT_SUBS[bot];

    $("chatLog").replaceChildren();
    appendChat("bot","Bonjour ! Bạn muốn luyện tập nội dung gì hôm nay?");
  }

  function appendChat(role,text) {
    const div = document.createElement("div");
    div.className = "bubble "+role;
    div.textContent = text;

    $("chatLog").appendChild(div);
    $("chatLog").scrollTop = $("chatLog").scrollHeight;
  }

  function clearBotChat() {
    chatHistory = [];
    $("chatLog").replaceChildren();
    appendChat("bot","Cuộc trò chuyện đã được làm mới. Bonjour !");
  }

  async function sendChat(event) {
    event?.preventDefault();

    const input = $("chatInput");
    const message = input.value.trim();

    if(!message) return;

    const endpoint = window.FP_AI_API_URL || "";

    appendChat("user",message);
    input.value = "";

    if(!endpoint) {
      appendChat(
        "bot",
        "Chatbot chưa được kết nối. Hãy triển khai Cloudflare Worker và điền URL /api/chat vào FP_AI_API_URL trong app.js."
      );
      return;
    }

    const send = $("chatSend");
    send.disabled = true;
    send.textContent = "Đang gửi…";

    try {
      const controller = new AbortController();
      const timeout = setTimeout(()=>controller.abort(),30000);

      let response;

      try {
        response = await fetch(endpoint,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            bot:activeBot,
            level:$("botLevel").value,
            message,
            history:chatHistory.slice(-10)
          }),
          signal:controller.signal
        });
      } finally {
        clearTimeout(timeout);
      }

      const data = await response.json().catch(()=>({}));

      if(!response.ok) {
        throw new Error(data.error||"Lỗi máy chủ "+response.status);
      }

      if(typeof data.reply!=="string"||!data.reply.trim()) {
        throw new Error("AI không trả về nội dung.");
      }

      chatHistory.push(
        {role:"user",content:message},
        {role:"assistant",content:data.reply}
      );

      chatHistory = chatHistory.slice(-10);
      appendChat("bot",data.reply);

    } catch(error) {
      appendChat(
        "bot",
        "Không thể kết nối AI: "+
        (error.name==="AbortError"?"Hết thời gian chờ 30 giây.":error.message)
      );
    } finally {
      send.disabled = 
