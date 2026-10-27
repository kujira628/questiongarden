// Question Garden — research-based content (bilingual)
// Evidence levels: "strong" = well-supported (experiments / reviews),
// "emerging" = promising but limited or mixed, "theory" = theoretical perspective.

export const STAGES = ['why', 'whatif', 'how'];

// ---------------------------------------------------------------------------
// Method brief (embedded in the coach's system prompt and the About screen)
// ---------------------------------------------------------------------------
export const PRINCIPLES = [
  {
    id: 'diverge',
    evidence: 'strong',
    ja: {
      title: '広げてから、絞る',
      body: '判断を保留して問いをたくさん出し、閉じた問い⇄開いた問いに変換し、最後に大事なものを選ぶ。',
    },
    en: {
      title: 'Go wide before you go narrow',
      body: 'Generate many questions without judging, convert closed ⇄ open questions, then prioritize the few that matter.',
    },
    refs: ['qft', 'gregersen', 'kedrick2023', 'clark2019'],
  },
  {
    id: 'assumption',
    evidence: 'theory',
    ja: {
      title: '前提を見つけ、揺さぶる',
      body: '良い問いは、当たり前とされている前提を問い直すことで「面白く」なる。',
    },
    en: {
      title: 'Find the assumption, then challenge it',
      body: 'Questions become interesting when they challenge an assumption people take for granted, rather than just filling a gap.',
    },
    refs: ['alvesson2011', 'davis1971', 'paulelder'],
  },
  {
    id: 'stages',
    evidence: 'emerging',
    ja: {
      title: '問いは「なぜ？→もし〜なら？→どうすれば？」と育つ',
      body: '問いは完成品ではなくプロセス。Why（気づき）→ What if（可能性を広げる）→ How（試す）と段階的に育て、変えた理由を残す。',
    },
    en: {
      title: 'Questions grow: Why → What if → How',
      body: 'A question is a process, not a product. Grow it from Why (noticing) to What if (opening possibilities) to How (trying), and keep the reasons for each change.',
    },
    refs: ['berger', 'raz2026', 'dewey', 'anzai2020'],
  },
  {
    id: 'walk',
    evidence: 'strong',
    ja: {
      title: '歩いて広げ、座って磨く',
      body: '歩くと発散的思考が高まるが、正解がひとつの課題には効かない。Why／What ifの段階では歩き、Howの段階では座って書く。',
    },
    en: {
      title: 'Walk to open, sit to sharpen',
      body: 'Walking boosts divergent thinking but not single-answer tasks. Walk in the Why / What if stages; sit and write in the How stage.',
    },
    refs: ['oppezzo2014', 'stevenson2018', 'gendlin'],
  },
  {
    id: 'people',
    evidence: 'strong',
    ja: {
      title: '人と一緒に考える',
      body: '問いを人に投げかけ、聴き、聴いてもらうことは、アイデアと関係の両方を育てる。会話は録音せず、自分の振り返りを残す。',
    },
    en: {
      title: 'Think with other people',
      body: 'Asking, listening and being listened to grow both ideas and relationships. Never record others; log your own reflection afterwards.',
    },
    refs: ['huang2017', 'itzchakov2017', 'hoever2012', 'bohm', 'lavewenger'],
  },
  {
    id: 'agency',
    evidence: 'interpretation',
    ja: {
      title: '問いの著者はあなた、AIはコーチ',
      body: 'コーチは映し返し、問いかけ、選択肢を示す。次のバージョンを書くのは常にあなた自身。',
    },
    en: {
      title: 'You are the author, the AI is the coach',
      body: 'The coach reflects, asks and offers options. You always write the next version yourself.',
    },
    refs: ['oecd2030'],
  },
];

// ---------------------------------------------------------------------------
// References (titles kept in original language)
// ---------------------------------------------------------------------------
export const REFS = {
  qft: { cite: 'Rothstein, D. & Santana, L. (2011). Make Just One Change: Teach Students to Ask Their Own Questions. Harvard Education Press.', url: 'https://rightquestion.org/resources/research-on-the-question-formulation-technique/', peer: false },
  gregersen: { cite: 'Gregersen, H. (2018). Questions Are the Answer. Harper Business. / "Question bursts" (MIT Sloan).', url: 'https://mitsloan.mit.edu/ideas-made-to-matter/heres-how-question-bursts-make-better-brainstorms', peer: false },
  kedrick2023: { cite: 'Kedrick, K., Schrater, P. & Koutstaal, W. (2023). The multifaceted role of self-generated question asking in curiosity-driven learning. Cognitive Science, 47(4), e13253.', url: 'https://experts.umn.edu/en/publications/the-multifaceted-role-of-self-generated-question-asking-in-curios/', peer: true },
  clark2019: { cite: 'Clark, S., Harbaugh, A. G. & Seider, S. (2019). Fostering adolescent curiosity through a question brainstorming intervention. Journal of Adolescence, 75.', url: 'https://rightquestion.org/resources/research-on-the-question-formulation-technique/', peer: true },
  alvesson2011: { cite: 'Alvesson, M. & Sandberg, J. (2011). Generating research questions through problematization. Academy of Management Review, 36(2), 247–271.', url: 'https://www.lunduniversity.lu.se/lup/publication/4a0a3faa-5cf8-4636-bf13-9644ab79a9e8', peer: true },
  davis1971: { cite: 'Davis, M. S. (1971). That\'s interesting! Philosophy of the Social Sciences, 1(2), 309–344.', url: 'https://scholar.google.com/scholar?q=Davis+1971+%22That%27s+interesting%22', peer: true },
  paulelder: { cite: 'Paul, R. & Elder, L. The Thinker\'s Guide to the Art of Socratic Questioning. Foundation for Critical Thinking.', url: 'https://www.criticalthinking.org/', peer: false },
  berger: { cite: 'Berger, W. (2014). A More Beautiful Question. Bloomsbury. / ウォーレン・バーガー『Q思考：シンプルな問いで本質をつかむ思考法』鈴木立哉訳, ダイヤモンド社, 2016.', url: 'https://www.diamond.co.jp/book/9784478023426.html', peer: false },
  raz2026: { cite: 'Raz, T. & Kenett, Y. N. (2026). The psychology of question asking: A comprehensive review. Annual Review of Psychology.', url: 'https://www.citedrive.com/en/discovery/the-psychology-of-question-asking-a-comprehensive-review/', peer: true },
  dewey: { cite: 'Dewey, J. (1938). Logic: The Theory of Inquiry. / Experience and Education.', url: 'https://scholar.google.com/scholar?q=Dewey+Logic+The+Theory+of+Inquiry', peer: false },
  anzai2020: { cite: '安斎勇樹・塩瀬隆之（2020）『問いのデザイン：創造的対話のファシリテーション』学芸出版社.', url: 'https://www.hanmoto.com/bd/isbn/9784761527433', peer: false },
  oppezzo2014: { cite: 'Oppezzo, M. & Schwartz, D. L. (2014). Give your ideas some legs: The positive effect of walking on creative thinking. Journal of Experimental Psychology: Learning, Memory, and Cognition, 40(4), 1142–1152.', url: 'https://www.apa.org/news/press/releases/2014/04/creativity-walk', peer: true },
  stevenson2018: { cite: 'Stevenson, M. P., Schilhab, T. & Bentsen, P. (2018). Attention Restoration Theory II: A systematic review to clarify attention processes affected by exposure to natural environments. J. Toxicology and Environmental Health, Part B, 21(4).', url: 'https://research.regionh.dk/en/publications/attention-restoration-theory-ii-a-systematic-review-to-clarify-at/', peer: true },
  sturm2022: { cite: 'Sturm, V. E. et al. (2022). Big smile, small self: Awe walks promote prosocial positive emotions in older adults. Emotion, 22(5).', url: 'https://pubmed.ncbi.nlm.nih.gov/32955293/', peer: true },
  sio2009: { cite: 'Sio, U. N. & Ormerod, T. C. (2009). Does incubation enhance problem solving? A meta-analytic review. Psychological Bulletin, 135(1), 94–120.', url: 'https://pubmed.ncbi.nlm.nih.gov/19210055/', peer: true },
  baird2012: { cite: 'Baird, B. et al. (2012). Inspired by distraction: Mind wandering facilitates creative incubation. Psychological Science, 23(10), 1117–1122.', url: 'https://labs.psych.ucsb.edu/schooler/jonathan/node/260', peer: true },
  wagner2004: { cite: 'Wagner, U., Gais, S., Haider, H., Verleger, R. & Born, J. (2004). Sleep inspires insight. Nature, 427, 352–355.', url: 'https://doi.org/10.1038/nature02223', peer: true },
  fernandes2018: { cite: 'Fernandes, M. A., Wammes, J. D. & Meade, M. E. (2018). The surprisingly powerful influence of drawing on memory. Current Directions in Psychological Science, 27(5).', url: 'https://www.psychologicalscience.org/journals/current-directions/0963721418755385/', peer: true },
  broaders2007: { cite: 'Broaders, S. C., Cook, S. W., Mitchell, Z. & Goldin-Meadow, S. (2007). Making children gesture brings out implicit knowledge and leads to learning. Journal of Experimental Psychology: General, 136(4).', url: 'https://scholar.google.com/scholar?q=Broaders+2007+Making+children+gesture+brings+out+implicit+knowledge', peer: true },
  mehta2012: { cite: 'Mehta, R., Zhu, R. & Cheema, A. (2012). Is noise always bad? Exploring the effects of ambient noise on creative cognition. Journal of Consumer Research, 39(4), 784–799.', url: 'https://academic.oup.com/jcr/article/39/4/784/1795620', peer: true },
  jia2009: { cite: 'Jia, L., Hirt, E. R. & Karpen, S. C. (2009). Lessons from a faraway land: The effect of spatial distance on creative cognition. Journal of Experimental Social Psychology, 45(5).', url: 'https://scholar.google.com/scholar?q=Jia+Hirt+Karpen+2009+Lessons+from+a+faraway+land', peer: true },
  itzchakov2017: { cite: 'Itzchakov, G., Kluger, A. N. & Castro, D. R. (2017). I am aware of my inconsistencies but can tolerate them: The effect of high quality listening on speakers\' attitude ambivalence. Personality and Social Psychology Bulletin, 43(1).', url: 'https://cris.huji.ac.il/en/publications/i-am-aware-of-my-inconsistencies-but-can-tolerate-them-the-effect/', peer: true },
  huang2017: { cite: 'Huang, K., Yeomans, M., Brooks, A. W., Minson, J. & Gino, F. (2017). It doesn\'t hurt to ask: Question-asking increases liking. Journal of Personality and Social Psychology, 113(3).', url: 'https://dash.harvard.edu/handle/1/35647952', peer: true },
  fiorella2013: { cite: 'Fiorella, L. & Mayer, R. E. (2013). The relative benefits of learning by teaching and teaching expectancy. Contemporary Educational Psychology, 38(4).', url: 'https://scholar.google.com/scholar?q=Fiorella+Mayer+2013+learning+by+teaching+teaching+expectancy', peer: true },
  mullen1991: { cite: 'Mullen, B., Johnson, C. & Salas, E. (1991). Productivity loss in brainstorming groups: A meta-analytic integration. Basic and Applied Social Psychology, 12(1).', url: 'https://scholar.google.com/scholar?q=Mullen+Johnson+Salas+1991+Productivity+loss+in+brainstorming+groups', peer: true },
  hoever2012: { cite: 'Hoever, I. J., van Knippenberg, D., van Ginkel, W. P. & Barkema, H. G. (2012). Fostering team creativity: Perspective taking as key to unlocking diversity\'s potential. Journal of Applied Psychology, 97(5).', url: 'https://repub.eur.nl/pub/35005', peer: true },
  gendlin: { cite: 'Gendlin, E. T. (1978). Focusing. / Polanyi, M. (1966). The Tacit Dimension.', url: 'https://scholar.google.com/scholar?q=Gendlin+Focusing+felt+sense', peer: false },
  bohm: { cite: 'Bohm, D. (1996). On Dialogue. Routledge. / Isaacs, W. (1999). Dialogue and the Art of Thinking Together.', url: 'https://scholar.google.com/scholar?q=Bohm+On+Dialogue', peer: false },
  lavewenger: { cite: 'Lave, J. & Wenger, E. (1991). Situated Learning: Legitimate Peripheral Participation. Cambridge University Press.', url: 'https://scholar.google.com/scholar?q=Lave+Wenger+1991+Situated+Learning', peer: false },
  oecd2030: { cite: 'OECD (2019). OECD Learning Compass 2030 — Student Agency.', url: 'https://www.oecd.org/education/2030-project/', peer: false },
};

// ---------------------------------------------------------------------------
// Research tips: embodiment, place, people, rest, questioning
// ---------------------------------------------------------------------------
export const TIP_CATEGORIES = ['body', 'place', 'people', 'rest', 'question'];

export const TIPS = [
  {
    id: 'walk', category: 'body', evidence: 'strong', refs: ['oppezzo2014'],
    ja: {
      title: '歩くと、アイデアが広がる',
      idea: 'スタンフォード大の実験では、歩いている間（屋内のトレッドミルでも屋外でも）は座っているときより、ものの新しい使い方などの発散的なアイデアが多く出ました。歩いた直後に座っても効果が少し残りました。一方、正解がひとつの課題には効果がありませんでした。',
      tryToday: '問いをひとつだけ持って15分歩き、「もし〜なら？」をできるだけ多く出してみる。磨くのは帰ってから座って。',
      caveat: '大学生を対象にした実験室課題。アイデアの量・新奇性の効果で、最終的な判断の質ではありません。',
    },
    en: {
      title: 'Walking widens your ideas',
      idea: 'In Stanford experiments, people generated more divergent ideas (e.g., novel uses for objects) while walking — on an indoor treadmill or outdoors — than while sitting. The boost partly lingered when they sat down afterwards. Walking did not help single-answer (convergent) tasks.',
      tryToday: 'Walk for 15 minutes holding one question. Generate as many "What if…?" questions as you can. Refine them later, sitting down.',
      caveat: 'Lab tasks with university students. The effect is on the number and novelty of ideas, not on the quality of final decisions.',
    },
  },
  {
    id: 'nature', category: 'place', evidence: 'strong', refs: ['stevenson2018'],
    ja: {
      title: '自然の中で、頭の柔らかさが戻る',
      idea: '42研究のメタ分析では、自然環境に触れた後にワーキングメモリと認知的柔軟性が向上しました（効果量は小〜中程度）。注意のコントロールへの効果は一貫していませんでした。',
      tryToday: '20分、スマホをしまって公園や川沿いに問いを持っていく。戻ったらひとことだけ記録。',
      caveat: '効果は控えめで、研究ごとのばらつきもあります。',
    },
    en: {
      title: 'Nature restores mental flexibility',
      idea: 'A meta-analysis of 42 studies found that exposure to natural environments improved working memory and cognitive flexibility (small-to-moderate effects). Effects on attentional control were less consistent.',
      tryToday: 'Take your question to a park or riverside for 20 minutes with your phone away. Record one sentence when you come back.',
      caveat: 'Effects are modest and vary between studies.',
    },
  },
  {
    id: 'awe', category: 'place', evidence: 'emerging', refs: ['sturm2022'],
    ja: {
      title: '「畏敬の散歩」で、自分を小さく感じる',
      idea: '高齢者が8週間、毎週「畏敬（awe）」を探しながら散歩したところ、通常の散歩群よりも喜びや思いやりに関わる感情が増え、自撮り写真の中の自分が小さく写るようになりました。',
      tryToday: '散歩中に、大きなもの・意外なもの・美しいものをひとつ探す。それが自分の問いに何を問いかけてくるか考える。',
      caveat: '高齢者を対象としたウェルビーイングの研究で、創造性を直接測ったものではありません。',
    },
    en: {
      title: 'Awe walks make the self feel smaller',
      idea: 'Older adults who took weekly "awe walks" for 8 weeks — deliberately looking for things that were vast or surprising — reported more joy and prosocial emotions than a regular-walk group, and appeared smaller in their own selfies.',
      tryToday: 'On a walk, look for one thing that is vast, surprising or beautiful. Ask what it asks of your question.',
      caveat: 'A wellbeing study with older adults; it did not measure creativity directly.',
    },
  },
  {
    id: 'incubation', category: 'rest', evidence: 'strong', refs: ['sio2009'],
    ja: {
      title: '一度、問いを寝かせる',
      idea: 'メタ分析では、問題からいったん離れる「孵化（インキュベーション）」期間が問題解決を助け、特に発散的な課題で効果が大きいことが示されました。事前に十分取り組んでおくことも大切です。',
      tryToday: '10分だけ問いに集中して取り組み、意図的に脇に置く。明日、もう一度開いてみる。',
      caveat: '効果は課題の種類や休憩の過ごし方によって変わります。',
    },
    en: {
      title: 'Let the question incubate',
      idea: 'A meta-analysis found that stepping away from a problem (an incubation period) helps problem solving, especially on divergent tasks — and works best after a solid period of working on it first.',
      tryToday: 'Work on your question with full focus for 10 minutes, then deliberately set it aside. Open it again tomorrow.',
      caveat: 'The effect depends on the type of task and how the break is spent.',
    },
  },
  {
    id: 'mindwander', category: 'rest', evidence: 'emerging', refs: ['baird2012'],
    ja: {
      title: 'ぼんやりできる単純作業をする',
      idea: '休憩中に頭を使わない簡単な作業をして心がさまよった人は、難しい作業をした人や何もしなかった人よりも、同じ創造的課題に戻ったときの成績が上がりました。',
      tryToday: '問いを考えたあと、皿洗い・洗濯物たたみ・ゆっくり歩くなど、ぼんやりできることをする。浮かんだことはすぐ記録。',
      caveat: '中心となるのは一つの研究で、その後の研究では一貫して再現されてはいません。',
    },
    en: {
      title: 'Do something easy and let your mind wander',
      idea: 'People who did an undemanding task during a break (so their minds wandered) improved more on a creative problem they returned to than those who did a demanding task or simply rested.',
      tryToday: 'After thinking about your question, do something mindless — dishes, folding laundry, a slow walk. Capture whatever surfaces.',
      caveat: 'Based mainly on one study; later studies have not consistently reproduced the effect.',
    },
  },
  {
    id: 'sleep', category: 'rest', evidence: 'strong', refs: ['wagner2004'],
    ja: {
      title: '寝ると、ひらめく',
      idea: '数字の課題に隠れた近道のルールがあった実験で、学習後に眠ったグループは、起きていたグループの2倍以上の割合でそのルールに気づきました（Nature誌）。',
      tryToday: '寝る前に問いを一度だけ読む。朝起きて最初に浮かんだことを書く。',
      caveat: '特定の課題での結果で、その後の研究で睡眠の段階による違いなどが議論されています。',
    },
    en: {
      title: 'Sleep on it',
      idea: 'In a number task with a hidden shortcut rule, people who slept after practice were more than twice as likely to discover the rule as those who stayed awake (published in Nature).',
      tryToday: 'Read your question once before bed. Write down the first thing that comes to mind in the morning.',
      caveat: 'One specific task; later research debates which sleep stages matter.',
    },
  },
  {
    id: 'sketch', category: 'body', evidence: 'strong', refs: ['fernandes2018'],
    ja: {
      title: '書くより、描く',
      idea: '覚えたい内容を絵に描くと、文字で書き写すより記憶に残りやすいことが、多くの実験で示されています。描くことで、意味・動き・イメージを同時に処理するためと考えられています。',
      tryToday: '問いを文章ではなく、図や絵で描いてみる。何が中心で、何がつながっているか。',
      caveat: '記憶への効果の研究です。問いの発見への効果は、ここからの解釈（推論）です。',
    },
    en: {
      title: 'Draw it instead of writing it',
      idea: 'Across many experiments, drawing information leads to better memory than writing it out — likely because drawing combines meaning, movement and imagery.',
      tryToday: 'Sketch your question as a picture or diagram instead of a sentence. What is at the center? What connects?',
      caveat: 'This research is about memory. Applying it to finding questions is an interpretation.',
    },
  },
  {
    id: 'gesture', category: 'body', evidence: 'strong', refs: ['broaders2007'],
    ja: {
      title: '手を動かして説明する',
      idea: '算数の問題を説明するときにジェスチャーを使うよう促された子どもは、言葉ではまだ表せない新しい解き方を手で表し、その後の授業からより多く学びました。',
      tryToday: '問いを声に出して、手を使いながら説明してみる。手が先に示したアイデアに注目する。',
      caveat: '子どもと算数の研究です。大人の問いへの応用は推論です。',
    },
    en: {
      title: 'Explain it with your hands',
      idea: 'Children told to gesture while explaining math problems expressed new strategies with their hands that they could not yet put into words — and learned more from later instruction.',
      tryToday: 'Explain your question out loud, using your hands. Notice ideas your hands show before your words do.',
      caveat: 'A study with children and math. Applying it to adult questions is an inference.',
    },
  },
  {
    id: 'feltsense', category: 'body', evidence: 'theory', refs: ['gendlin'],
    ja: {
      title: 'まだ言葉にならない感覚に耳をすます',
      idea: 'ジェンドリンの「フェルトセンス」は、まだ言葉にならない、身体で感じる意味の感覚。ポランニーは「我々は語れる以上のことを知っている」と述べました（暗黙知）。',
      tryToday: '問いを読んで、胸やお腹のあたりにどんな感じがあるか30秒待つ。その感じにぴったりの言葉を探す。',
      caveat: '理論的・臨床的な視点で、創造性への効果が実験的に確かめられたものではありません。',
    },
    en: {
      title: 'Listen to the feeling before the words',
      idea: 'Gendlin\'s "felt sense" is a bodily sense of meaning that is not yet in words. Polanyi wrote that "we can know more than we can tell" (tacit knowing).',
      tryToday: 'Read your question and wait 30 seconds: what do you feel in your chest or stomach? Look for words that fit that feeling.',
      caveat: 'A theoretical and clinical perspective, not an experimentally tested creativity effect.',
    },
  },
  {
    id: 'noise', category: 'place', evidence: 'emerging', refs: ['mehta2012'],
    ja: {
      title: 'カフェくらいのざわめき',
      idea: '中程度の環境音（約70dB、カフェ程度）は、静かな環境（50dB）や大きな騒音（85dB）よりも創造的な課題の成績を高めました。少し抽象的に考えやすくなるためと説明されています。',
      tryToday: '問いをカフェに持っていく。整理ではなく、広げる作業をする。',
      caveat: '実験数は限られ、個人差もあります。',
    },
    en: {
      title: 'A café-level hum',
      idea: 'Moderate ambient noise (about 70 dB, like a café) improved creative task performance compared with quiet (50 dB) or loud (85 dB) conditions — possibly by encouraging more abstract thinking.',
      tryToday: 'Take your question to a café and use the time to widen it, not to organize it.',
      caveat: 'A limited number of experiments; individual differences apply.',
    },
  },
  {
    id: 'distance', category: 'place', evidence: 'emerging', refs: ['jia2009'],
    ja: {
      title: '遠くから問いを眺める',
      idea: '課題が「遠く離れた場所から来た」と伝えられた参加者は、近くから来たと伝えられた参加者よりも創造的な解答をしました。心理的な距離が抽象的な思考を促すと考えられています。',
      tryToday: '「この問いは、遠い国や50年後の人ならどう問うだろう？」と書いてみる。',
      caveat: '実験室での操作による結果で、再現性は十分に確立されていません。',
    },
    en: {
      title: 'Look at the question from far away',
      idea: 'Participants told a task came from a faraway place gave more creative answers than those told it came from nearby — psychological distance seems to encourage abstract thinking.',
      tryToday: 'Write: "How would someone in a distant country — or 50 years from now — ask this question?"',
      caveat: 'Lab manipulations; replication is not well established.',
    },
  },
  {
    id: 'listening', category: 'people', evidence: 'strong', refs: ['itzchakov2017'],
    ja: {
      title: 'ただ聴いてもらう',
      idea: '質の高い傾聴を受けた話し手は、不安が下がり、自分の考えの矛盾に気づきながらもそれを受け止め、より複雑で多面的な見方を持つようになりました。',
      tryToday: '誰かに「アドバイスなしで5分だけ聴いて」と頼み、問いについて話す。逆に誰かの話をただ聴くのも。',
      caveat: '実験で傾聴の質を操作した研究です。',
    },
    en: {
      title: 'Ask someone to just listen',
      idea: 'Speakers who received high-quality listening became less anxious, more aware of their own inconsistencies — and comfortable holding them — and developed more complex, multi-sided views.',
      tryToday: 'Ask someone: "Could you just listen for 5 minutes, no advice?" Talk through your question. Or offer the same to someone else.',
      caveat: 'Experiments that manipulated listening quality.',
    },
  },
  {
    id: 'followup', category: 'people', evidence: 'strong', refs: ['huang2017'],
    ja: {
      title: 'フォローアップの質問をする',
      idea: '会話の中で質問、特に相手の話を受けたフォローアップの質問を多くする人は、相手から好かれやすいことが、オンライン会話やスピードデートの研究で示されました。',
      tryToday: '問いに関係する話題が出たら、相手に続けて2つ質問してみる。',
      caveat: '主に好感度への効果の研究で、問いの深まりへの効果は推論です。',
    },
    en: {
      title: 'Ask follow-up questions',
      idea: 'In online chats and speed-dating studies, people who asked more questions — especially follow-ups to what the other person said — were liked more.',
      tryToday: 'When a topic related to your question comes up, ask the other person two follow-up questions in a row.',
      caveat: 'The research is about liking; the effect on deepening your question is an inference.',
    },
  },
  {
    id: 'teach', category: 'people', evidence: 'strong', refs: ['fiorella2013'],
    ja: {
      title: '人に教えてみる',
      idea: '学んだ内容を実際に人に説明した学生は、「教える準備」をしただけの学生よりも、1週間後の理解度が高くなりました。',
      tryToday: '問いを学生や友人に1分で説明する。どこで言葉に詰まったかをメモする。',
      caveat: '学習内容の理解についての研究で、問いそのものへの応用は推論です。',
    },
    en: {
      title: 'Try teaching it',
      idea: 'Students who actually explained what they learned to others understood it better a week later than students who only prepared to teach.',
      tryToday: 'Explain your question to a student or friend in one minute. Note where you stumbled.',
      caveat: 'About understanding learned content; applying it to questions is an inference.',
    },
  },
  {
    id: 'alonefirst', category: 'people', evidence: 'strong', refs: ['mullen1991'],
    ja: {
      title: 'まず一人で、それから一緒に',
      idea: 'メタ分析では、集団でのブレインストーミングよりも、個人が別々に考えて後で合わせたほうが、アイデアの数が多く、質の面でも上回る傾向がありました。',
      tryToday: '人と話す前に、自分の問いを5つ一人で書いておく。それから共有する。',
      caveat: 'アイデアの量の研究です。集団には合意形成や深まりなど別の利点があります。',
    },
    en: {
      title: 'Alone first, then together',
      idea: 'A meta-analysis found that individuals thinking separately and pooling ideas afterwards tend to produce more ideas — and often better-rated ones — than interactive brainstorming groups.',
      tryToday: 'Before talking with others, write five questions on your own. Then share.',
      caveat: 'Mostly about idea quantity; groups have other benefits such as shared understanding and depth.',
    },
  },
  {
    id: 'perspective', category: 'people', evidence: 'strong', refs: ['hoever2012'],
    ja: {
      title: '違う視点を、まず言い直す',
      idea: '多様なメンバーのチームが創造的になったのは、互いの視点を取ろうとしたときだけでした。多様性は、視点取得があって初めて力になります。',
      tryToday: '全く違う分野の人に問いを話す。反論する前に、相手の見方を自分の言葉で言い直してみる。',
      caveat: '実験室でのチーム課題による研究です。',
    },
    en: {
      title: 'Restate a different view first',
      idea: 'Diverse teams were more creative only when members actively took each other\'s perspectives. Diversity pays off through perspective taking.',
      tryToday: 'Share your question with someone from a very different field. Before responding, restate their view in your own words.',
      caveat: 'Based on lab team tasks.',
    },
  },
  {
    id: 'qquality', category: 'question', evidence: 'strong', refs: ['kedrick2023'],
    ja: {
      title: '良い問いが、好奇心を育てる',
      idea: '質の高い問いを多く立てた人ほど、好奇心が高く、答えを探しに行き、後でよく覚えていました。問いを立てること自体が、知らないことの価値を高めるようです。',
      tryToday: '気になったことを、すぐ調べる前に「問い」の形で3つ書いてみる。',
      caveat: '事実に関する課題での研究です。',
    },
    en: {
      title: 'Good questions grow curiosity',
      idea: 'People who asked more high-quality questions were more curious, more likely to seek answers, and remembered them better. Asking questions seems to raise the value of what we don\'t yet know.',
      tryToday: 'Before looking something up, write three questions about it first.',
      caveat: 'Based on fact-based question tasks.',
    },
  },
];

// ---------------------------------------------------------------------------
// Invitation templates. stages: which question stages they fit.
// ---------------------------------------------------------------------------
export const INVITATIONS = [
  // Body
  { id: 'b-walk', category: 'body', stages: ['why', 'whatif'], tip: 'walk',
    ja: '問いをひとつだけ持って15分歩いてみませんか。戻ったら、ひとことだけ記録を。',
    en: 'Take a 15-minute walk holding only this question. Record one sentence when you return.' },
  { id: 'b-feel', category: 'body', stages: ['why'], tip: 'feltsense',
    ja: 'この問いのどこが、からだのどのあたりで「もやっと」または「わくわく」しますか。30秒、感じてみて。',
    en: 'Where in your body does this question feel unclear — or exciting? Take 30 seconds to notice.' },
  { id: 'b-sketch', category: 'body', stages: ['whatif', 'how'], tip: 'sketch',
    ja: '今日は、この問いを文章ではなく絵や図で描いてみませんか。',
    en: 'Sketch this question today instead of writing it.' },
  { id: 'b-hands', category: 'body', stages: ['whatif'], tip: 'gesture',
    ja: '問いを声に出して、手を動かしながら説明してみて。手が先に見つけるものがあるかも。',
    en: 'Explain the question out loud, using your hands. Your hands may find something first.' },
  { id: 'b-sleep', category: 'body', stages: ['why', 'whatif', 'how'], tip: 'sleep',
    ja: '今夜、寝る前に問いを一度だけ読んで。朝いちばんに浮かんだことを記録しましょう。',
    en: 'Read this question once before bed tonight. Capture the first thing that comes to mind in the morning.' },
  { id: 'b-chores', category: 'body', stages: ['whatif'], tip: 'mindwander',
    ja: '10分考えたら、皿洗いや洗濯物たたみなど、ぼんやりできることを。浮かんだらすぐメモ。',
    en: 'Think for 10 minutes, then do something mindless — dishes, laundry. Capture what surfaces.' },
  // Place
  { id: 'p-observe', category: 'place', stages: ['why', 'whatif'], tip: null,
    ja: 'この問いが「実際に起きている場所」へ行って、10分だけ観察してみませんか。',
    en: 'Go to a place where this question actually happens and observe for 10 minutes.' },
  { id: 'p-nature', category: 'place', stages: ['why', 'whatif'], tip: 'nature',
    ja: 'スマホをしまって、20分だけ公園や川沿いへ。問いはポケットに入れて。',
    en: 'Put your phone away and spend 20 minutes in a park or by a river, with the question in your pocket.' },
  { id: 'p-cafe', category: 'place', stages: ['whatif'], tip: 'noise',
    ja: 'カフェくらいのざわめきの中で、問いを広げる時間をとってみて。',
    en: 'Spend some time widening this question somewhere with a café-level hum.' },
  { id: 'p-far', category: 'place', stages: ['whatif'], tip: 'distance',
    ja: '遠い国の人や、50年後の人なら、この問いをどう問うでしょう？',
    en: 'How would someone in a distant country — or 50 years from now — ask this question?' },
  { id: 'p-awe', category: 'place', stages: ['why'], tip: 'awe',
    ja: '散歩中に、大きなもの・意外なものをひとつ探して。それはこの問いに何を問いかけますか。',
    en: 'On a walk, find one thing that is vast or surprising. What does it ask of this question?' },
  // People
  { id: 'r-differ', category: 'people', stages: ['whatif', 'how'], tip: 'perspective',
    ja: 'この問いを違う見方をする人に話して、「あなたならどう問う？」と聞いてみませんか。',
    en: 'Ask one person who sees this differently: what would they ask instead?' },
  { id: 'r-teach', category: 'people', stages: ['how'], tip: 'teach',
    ja: '学生か友人に、この問いを1分で説明してみて。どこで詰まりましたか？',
    en: 'Explain this question to a student or friend in one minute. Where did you stumble?' },
  { id: 'r-absent', category: 'people', stages: ['why', 'how'], tip: null,
    ja: 'この問いに影響を受けるのに、まだ会話にいない人は誰でしょう？',
    en: 'Who is affected by this question but not yet in the conversation?' },
  { id: 'r-listen', category: 'people', stages: ['whatif'], tip: 'listening',
    ja: '誰かに「アドバイスなしで5分だけ聴いて」と頼んで、問いについて話してみませんか。',
    en: 'Ask someone to just listen for 5 minutes — no advice — while you talk through this question.' },
  { id: 'r-follow', category: 'people', stages: ['why'], tip: 'followup',
    ja: '今日の会話で、相手の話に続けて2つ質問してみて。問いのヒントが隠れているかも。',
    en: 'In a conversation today, ask two follow-up questions in a row. A clue may be hiding there.' },
  { id: 'r-alone', category: 'people', stages: ['whatif'], tip: 'alonefirst',
    ja: '人と話す前に、一人で問いを5つ書いておきましょう。それから共有を。',
    en: 'Before talking with others, write five questions on your own. Then share.' },
];
