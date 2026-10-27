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

// ---------------------------------------------------------------------------
// Paper columns: highly cited / landmark peer-reviewed papers on questions,
// problem framing and curiosity. Citation counts are fetched live (OpenAlex).
// type: empirical | review | theory | conference
// ---------------------------------------------------------------------------
export const PAPERS = [
  {
    id: 'rittel1973', doi: '10.1007/BF01405730', type: 'theory',
    authors: 'Horst W. J. Rittel, Melvin M. Webber', year: 1973, venue: 'Policy Sciences, 4(2), 155–169',
    title: 'Dilemmas in a general theory of planning',
    ja: {
      headline: '社会の問題は「やっかいな問題（wicked problem）」である',
      what: '都市計画や社会政策の問題は、科学の問題のように明確に定義できず、「問題を定義すること」と「解決策を考えること」が切り離せない、と論じた古典。正解・不正解ではなく「より良い・より悪い」しかなく、止めどきもない。',
      why: '「wicked problem」という概念を生み、デザイン・政策・サステナビリティ研究に大きな影響を与え続けている。',
      implication: 'ESDや地域課題の問いは、最初から正しく定義できるものではない。問いを書き直すこと自体が、問題の理解を進める営みである。',
      prompt: 'この問いは、誰の視点から見た「問題」になっていますか？ほかの立場の人なら、問題をどう定義するでしょう？',
    },
    en: {
      headline: 'Social problems are "wicked problems"',
      what: 'A classic argument that problems in planning and social policy cannot be defined like scientific problems: defining the problem and imagining solutions are inseparable. There is no true/false, only better/worse, and no natural stopping point.',
      why: 'It coined "wicked problems" and still shapes design, policy and sustainability research.',
      implication: 'Questions in ESD or community issues can\'t be defined correctly at the start. Rewriting the question is itself how understanding of the problem grows.',
      prompt: 'From whose point of view is this a "problem"? How would people in other positions define it?',
    },
  },
  {
    id: 'dorst2011', doi: '10.1016/j.destud.2011.07.006', type: 'theory',
    authors: 'Kees Dorst', year: 2011, venue: 'Design Studies, 32(6), 521–532',
    title: 'The core of \'design thinking\' and its application',
    ja: {
      headline: 'デザイン思考の核心は「フレーム」をつくること',
      what: '演繹・帰納・アブダクションという推論の型から、デザイン思考の核心を分析。「何を（WHAT）」と「どう働くか（HOW）」から「価値」を生むため、新しい見方＝フレームを創り出すことが鍵だと示した。',
      why: 'デザイン思考を論理的に説明した論文としてデザイン研究で広く引用されている。のちの『Frame Innovation』につながる。',
      implication: '問いを磨くとは、答えを探す前に「どんなフレームでこの状況を見るか」を試すこと。同じ状況も、フレームが変われば違う問いになる。',
      prompt: 'この状況を「〜として見る」とすると？（例：授業を「対話の場として」「市場として」「庭として」見ると、問いはどう変わる？）',
    },
    en: {
      headline: 'The core of design thinking is creating frames',
      what: 'Analyses design thinking through patterns of reasoning (deduction, induction, abduction). To create value from a "what" and a "how", designers create new frames — new ways of seeing a situation.',
      why: 'Widely cited in design research as a logical account of design thinking; it led to the book Frame Innovation.',
      implication: 'Refining a question means trying out frames before looking for answers. The same situation yields different questions under different frames.',
      prompt: 'What if you see this situation "as" something else? (e.g., a class as a dialogue, a market, a garden — how does the question change?)',
    },
  },
  {
    id: 'alvesson2011', doi: '10.5465/AMR.2011.59330882', type: 'theory',
    authors: 'Mats Alvesson, Jörgen Sandberg', year: 2011, venue: 'Academy of Management Review, 36(2), 247–271',
    title: 'Generating research questions through problematization',
    ja: {
      headline: '「すき間を埋める」問いから、「前提を問い直す」問いへ',
      what: '多くの研究は既存研究の「すき間（gap）」を埋める問いを立てるが、それでは面白い理論は生まれにくい。既存研究の背後にある前提を特定し、問い直す「問題化（problematization）」の方法を提案した。',
      why: '経営学のトップ誌に掲載され、研究課題の立て方の論文として分野を超えて多く引用されている。',
      implication: '問いを磨くとき、「まだ誰もやっていないこと」より「みんなが当然と思っていること」を探すと、問いが深くなる。',
      prompt: 'この問いは、どんな前提の上に立っていますか？その前提が間違っていたら、何を問うべきでしょう？',
    },
    en: {
      headline: 'From "gap-spotting" to challenging assumptions',
      what: 'Most research asks questions that fill gaps in existing literature, which rarely leads to interesting theory. The authors propose "problematization": identifying and challenging the assumptions underlying existing work.',
      why: 'Published in a top management journal and widely cited across fields as a guide to constructing research questions.',
      implication: 'When refining a question, look for what everyone takes for granted, not just what no one has done yet.',
      prompt: 'What assumptions does this question rest on? If one of them were wrong, what should you ask instead?',
    },
  },
  {
    id: 'davis1971', doi: '10.1177/004839317100100211', type: 'theory',
    authors: 'Murray S. Davis', year: 1971, venue: 'Philosophy of the Social Sciences, 1(2), 309–344',
    title: 'That\'s interesting! Towards a phenomenology of sociology and a sociology of phenomenology',
    ja: {
      headline: '「面白い！」と言われる理論は、聴き手の前提を否定する',
      what: '有名な理論が「真実だから」ではなく「面白いから」注目されると論じ、面白さとは聴き手が当然視している前提を否定することだと分析した。面白さのパターンを分類している。',
      why: '半世紀以上にわたり、研究の問いや理論の「面白さ」を論じる際の定番文献として引用され続けている。',
      implication: '問いの「面白さ」は相手によって変わる。誰にとって面白い問いなのか（誰の前提を揺さぶるのか）を意識すると、問いが届く相手が見えてくる。',
      prompt: 'この問いを聞いた人の、どんな「当たり前」が揺さぶられますか？',
    },
    en: {
      headline: 'Interesting theories deny the audience\'s assumptions',
      what: 'Argues that famous theories draw attention not because they are true but because they are interesting — and that "interesting" means denying an assumption the audience takes for granted. It classifies patterns of interestingness.',
      why: 'For over fifty years it has been a standard reference on what makes research questions and theories interesting.',
      implication: 'Interestingness depends on the audience. Ask whose assumptions your question shakes, and you\'ll see who it speaks to.',
      prompt: 'Which "obvious" belief of your listener does this question unsettle?',
    },
  },
  {
    id: 'loewenstein1994', doi: '10.1037/0033-2909.116.1.75', type: 'review',
    authors: 'George Loewenstein', year: 1994, venue: 'Psychological Bulletin, 116(1), 75–98',
    title: 'The psychology of curiosity: A review and reinterpretation',
    ja: {
      headline: '好奇心は「知識のすき間」から生まれる',
      what: '好奇心研究を総説し、「情報ギャップ理論」を提案。自分の知識にすき間があると気づいたときに好奇心が生まれる。ただし、何も知らない状態では生まれにくく、少し知っているときに最も強くなる。',
      why: '好奇心研究の基礎文献として、心理学・教育・マーケティングなどで非常に多く引用されている。',
      implication: '問いが立たないときは、知識が少なすぎるのかもしれない。少し調べる・少し体験することで、すき間が見え、問いが立ちやすくなる。',
      prompt: 'この問いについて、「知っていること」と「知らないこと」の境目はどこにありますか？',
    },
    en: {
      headline: 'Curiosity comes from gaps in knowledge',
      what: 'A review of curiosity research proposing the "information-gap" theory: curiosity arises when we notice a gap in our knowledge. It is weak when we know nothing and strongest when we know a little.',
      why: 'A foundational, very highly cited paper across psychology, education and marketing.',
      implication: 'If no question comes, you may know too little. A bit of reading or experience reveals the gap — and the question.',
      prompt: 'Where exactly is the border between what you know and what you don\'t, in this question?',
    },
  },
  {
    id: 'kang2009', doi: '10.1111/j.1467-9280.2009.02402.x', type: 'empirical',
    authors: 'Min Jeong Kang, Ming Hsu, Ian M. Krajbich, George Loewenstein, Samuel M. McClure, Joseph Tao-yi Wang, Colin F. Camerer', year: 2009, venue: 'Psychological Science, 20(8), 963–973',
    title: 'The wick in the candle of learning: Epistemic curiosity activates reward circuitry and enhances memory',
    ja: {
      headline: '好奇心は、脳の報酬系を動かし記憶を高める',
      what: 'クイズ形式の質問への好奇心をfMRIで調べた研究。好奇心が高いとき報酬に関わる脳領域が活動し、答えを間違えた問題でも、好奇心が高かったものは後でよく覚えていた。',
      why: '好奇心と学習を脳科学で結びつけた研究として広く知られている。',
      implication: '「気になる」という感覚は、学びの燃料になる。問いを記録するとき、どれくらい気になるかを残しておく価値がある。',
      prompt: 'この問いは、今どのくらい「気になって」いますか？気にならなくなったなら、何が変わったのでしょう？',
    },
    en: {
      headline: 'Curiosity activates reward circuits and boosts memory',
      what: 'An fMRI study of curiosity about trivia questions. High curiosity activated reward-related brain regions, and people later remembered answers better for questions they had been curious about — even ones they had answered wrongly.',
      why: 'Widely known for linking curiosity and learning in neuroscience.',
      implication: 'The feeling of "I want to know" fuels learning. It\'s worth noting how curious you feel about a question.',
      prompt: 'How curious are you about this question right now? If the curiosity has faded, what changed?',
    },
  },
  {
    id: 'gruber2014', doi: '10.1016/j.neuron.2014.08.060', type: 'empirical',
    authors: 'Matthias J. Gruber, Bernard D. Gelman, Charan Ranganath', year: 2014, venue: 'Neuron, 84(2), 486–496',
    title: 'States of curiosity modulate hippocampus-dependent learning via the dopaminergic circuit',
    ja: {
      headline: '好奇心が高まると、関係ないことまで覚えやすくなる',
      what: '好奇心が高まった状態では、答えだけでなく、その間に偶然見た無関係な顔写真まで記憶に残りやすかった。ドーパミン系と海馬の活動がこれに関わっていた。',
      why: '好奇心の「波及効果」を示した研究として、教育分野でもよく紹介されている。',
      implication: '強い問いを持って歩くと、周りのものまで記憶に残りやすい。問いを持ったまま観察に出かける意味がここにある。',
      prompt: 'この問いを持ったまま出かけるなら、どこに行きたいですか？',
    },
    en: {
      headline: 'Curious minds also remember the incidental',
      what: 'In a state of high curiosity, people remembered not only answers but also unrelated faces shown in the meantime. Dopaminergic and hippocampal activity was involved.',
      why: 'Often cited in education for showing the "spillover" effect of curiosity.',
      implication: 'Walking around with a strong question helps you notice and remember your surroundings — a reason to go out and observe while holding a question.',
      prompt: 'If you went out holding this question, where would you want to go?',
    },
  },
  {
    id: 'rosenshine1996', doi: '10.3102/00346543066002181', type: 'review',
    authors: 'Barak Rosenshine, Carla Meister, Saul Chapman', year: 1996, venue: 'Review of Educational Research, 66(2), 181–221',
    title: 'Teaching students to generate questions: A review of the intervention studies',
    ja: {
      headline: '問いの立て方は「教えられる」',
      what: '学生に自分で問いを作らせる指導の介入研究26件をレビュー。問いを作る訓練は読解力を高め、特に「誰が・なぜ・どのように」などの手がかり語や、質問の型（question stems）を示す方法が効果的だった。',
      why: '教育研究の主要レビュー誌に掲載され、問いを生成する学習のエビデンスとして長く引用されている。',
      implication: '問いは才能ではなく、手がかりがあれば上達する技術。「なぜ」「もし」「どうすれば」という型を使うことは、エビデンスのある方法。',
      prompt: '「なぜ〜？」「〜と〜はどう違う？」「もし〜なら？」のどれかの型で、問いを3通りに書いてみると？',
    },
    en: {
      headline: 'Question generation can be taught',
      what: 'A review of 26 intervention studies teaching students to generate their own questions. Training improved comprehension; prompts such as signal words (who, why, how) and generic question stems were especially effective.',
      why: 'Published in a leading review journal and long cited as evidence for question-generation learning.',
      implication: 'Asking good questions is a learnable skill. Using stems like "Why…", "What if…", "How might…" is an evidence-based technique.',
      prompt: 'Rewrite your question three ways using stems: "Why…?", "How is … different from …?", "What if…?"',
    },
  },
  {
    id: 'chin2008', doi: '10.1080/03057260701828101', type: 'review',
    authors: 'Christine Chin, Jonathan Osborne', year: 2008, venue: 'Studies in Science Education, 44(1), 1–39',
    title: 'Students\' questions: A potential resource for teaching and learning science',
    ja: {
      headline: '学生の問いは、学びの資源になる',
      what: '理科教育における学生の問いの研究をレビュー。学生の問いは理解の状態を映し、考えを方向づけ、議論を生む。一方で、教室では学生が問いを発する機会が少ないことも指摘した。',
      why: '学生の問いに関する代表的なレビューとして、科学教育で広く引用されている。',
      implication: '学生の問いを「答えるべきもの」ではなく「授業の素材」として扱うと、学びがひらく。自分の問いも同じく、答えより素材として育てられる。',
      prompt: 'この問いに答えるより、この問いから「何を学べる」でしょう？',
    },
    en: {
      headline: 'Students\' questions are a resource for learning',
      what: 'A review of research on students\' questions in science education. Questions reveal understanding, direct thinking and spark discussion — yet students rarely get chances to ask them in class.',
      why: 'A key review on student questioning, widely cited in science education.',
      implication: 'Treat questions as material for learning, not just things to answer — including your own.',
      prompt: 'Rather than answering this question, what could you learn from it?',
    },
  },
  {
    id: 'graesser1994', doi: '10.3102/00028312031001104', type: 'empirical',
    authors: 'Arthur C. Graesser, Natalie K. Person', year: 1994, venue: 'American Educational Research Journal, 31(1), 104–137',
    title: 'Question asking during tutoring',
    ja: {
      headline: '深い問いは、少ない',
      what: '個別指導の場面での問いを分析。学生は教室より個別指導で多くの問いを発したが、「なぜ」「どのように」といった深い推論を伴う問いは少なかった。深い問いの質は、試験の成績と関係していた。',
      why: '問いの分類と、深い問いの重要性を示した研究として多く引用されている。',
      implication: '問いの「量」より「深さ」。確認するための問い（いつ？何？）から、説明を求める問い（なぜ？どうして？）へ移れているか確かめる。',
      prompt: 'この問いは「確認」の問いですか、「説明」を求める問いですか？「なぜ」を一段深くすると？',
    },
    en: {
      headline: 'Deep questions are rare',
      what: 'An analysis of questions in tutoring sessions. Students asked far more questions than in classrooms, but few were deep-reasoning questions (why, how). The quality of deep questions was related to exam performance.',
      why: 'Often cited for its question taxonomy and for showing the value of deep questions.',
      implication: 'Depth matters more than quantity. Check whether you are moving from checking questions (when? what?) to explanatory ones (why? how?).',
      prompt: 'Is this a checking question or an explaining question? What happens if you go one "why" deeper?',
    },
  },
  {
    id: 'rao2018', doi: '10.18653/v1/P18-1255', type: 'conference',
    authors: 'Sudha Rao, Hal Daumé III', year: 2018, venue: 'ACL 2018 (Best Long Paper Award)',
    title: 'Learning to ask good questions: Ranking clarification questions using neural expected value of perfect information',
    ja: {
      headline: '良い問いとは、答えが「役に立つ」問い',
      what: 'AIに良い確認の問いを選ばせる研究。良い問いを「その答えを得たときに、どれだけ有益な情報が増えるか（完全情報の期待値）」で評価するモデルを提案した。自然言語処理のトップ会議ACLで最優秀論文賞。',
      why: 'AIと「問う力」を結ぶ研究として注目された。',
      implication: '問いの良し悪しを「答えが分かったら、何が変わるか」で考えてみる。答えが出ても何も変わらない問いは、まだ磨く余地がある。',
      prompt: 'この問いの答えが分かったら、あなたの行動や考えの何が変わりますか？',
    },
    en: {
      headline: 'A good question is one whose answer is useful',
      what: 'Research on teaching AI to choose good clarification questions. It scores questions by how much useful information their answers would add (expected value of perfect information). Best Long Paper at ACL, a top NLP conference.',
      why: 'Notable as a bridge between AI and the skill of questioning.',
      implication: 'Judge a question by "what would change if I knew the answer?" If nothing would change, it can be sharpened further.',
      prompt: 'If you knew the answer to this question, what in your actions or thinking would change?',
    },
  },
];
