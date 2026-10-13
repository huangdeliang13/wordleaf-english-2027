// Original starter content: common English words, not an official examination syllabus.
const raw = `achieve|v.|实现；达到|阅读常用|You can achieve your goal with regular practice.|坚持练习，你就能实现目标。|achieve a goal 实现目标
improve|v.|改善；提高|阅读常用|Reading every day helps improve your English.|每天阅读有助于提高英语。|improve your skills 提高技能
require|v.|需要；要求|阅读常用|This job requires good communication skills.|这份工作需要良好的沟通能力。|require sb. to do sth. 要求某人做某事
provide|v.|提供|阅读常用|The library provides a quiet place to study.|图书馆提供了安静的学习场所。|provide sb. with sth. 为某人提供某物
consider|v.|考虑；认为|阅读常用|Please consider both sides of the question.|请考虑这个问题的两个方面。|consider doing sth. 考虑做某事
develop|v.|发展；培养|阅读常用|It takes time to develop a good habit.|培养好习惯需要时间。|develop a habit 养成习惯
increase|v./n.|增加；增长|阅读常用|The number of visitors increased last year.|去年游客数量增加了。|increase by 增加了；increase to 增加到
reduce|v.|减少；降低|阅读常用|Taking the bus can reduce air pollution.|乘坐公交车可以减少空气污染。|reduce costs 降低成本
affect|v.|影响|阅读常用|Lack of sleep can affect your memory.|缺乏睡眠会影响记忆力。|affect 常作动词；effect 常作名词
effect|n.|影响；效果|阅读常用|The new rule had a positive effect.|新规定产生了积极影响。|have an effect on 对……有影响
benefit|n./v.|好处；受益|阅读常用|Students benefit from regular exercise.|学生从规律锻炼中受益。|benefit from 从……中受益
suggest|v.|建议；暗示|阅读常用|I suggest taking a short break.|我建议休息一会儿。|suggest doing sth. 建议做某事
allow|v.|允许|阅读常用|The teacher allows us to ask questions.|老师允许我们提问。|allow sb. to do sth. 允许某人做某事
avoid|v.|避免|阅读常用|Try to avoid making the same mistake.|尽量避免犯同样的错误。|avoid doing sth. 避免做某事
decide|v.|决定|阅读常用|She decided to study in the library.|她决定在图书馆学习。|decide to do sth. 决定做某事
prefer|v.|更喜欢|阅读常用|I prefer tea to coffee.|比起咖啡，我更喜欢茶。|prefer A to B 比起B更喜欢A
manage|v.|管理；设法做到|阅读常用|He managed to finish the work on time.|他设法按时完成了工作。|manage to do sth. 设法做成某事
prevent|v.|阻止；预防|阅读常用|Regular exercise helps prevent illness.|规律锻炼有助于预防疾病。|prevent sb. from doing sth. 阻止某人做某事
encourage|v.|鼓励|阅读常用|My teacher encouraged me to keep trying.|老师鼓励我继续尝试。|encourage sb. to do sth. 鼓励某人做某事
support|v./n.|支持|阅读常用|Her family supported her decision.|她的家人支持她的决定。|support a decision 支持决定
realize|v.|意识到；实现|阅读常用|I realized that I needed more practice.|我意识到自己需要更多练习。|realize a dream 实现梦想
recognize|v.|认出；承认|阅读常用|I recognized her voice immediately.|我立刻认出了她的声音。|recognize 与 realize 的含义不同
explain|v.|解释|阅读常用|Could you explain this sentence to me?|你能向我解释这个句子吗？|explain sth. to sb. 向某人解释某事
describe|v.|描述|阅读常用|Can you describe the place you visited?|你能描述一下你去过的地方吗？|describe sth. 描述某事物
compare|v.|比较|阅读常用|Compare the two answers carefully.|仔细比较这两个答案。|compare A with B 把A与B比较
include|v.|包括|阅读常用|The price includes breakfast.|这个价格包含早餐。|including 包括；included 放在被包含对象之后
expect|v.|期待；预料|阅读常用|We expect the project to finish soon.|我们预计项目很快会完成。|expect sb. to do sth. 期待某人做某事
accept|v.|接受|阅读常用|She accepted the offer after careful thought.|经过认真考虑，她接受了这个提议。|accept 接受；receive 收到
refuse|v.|拒绝|阅读常用|He refused to give up.|他拒绝放弃。|refuse to do sth. 拒绝做某事
depend|v.|依靠；取决于|阅读常用|Success depends on preparation and effort.|成功取决于准备和努力。|depend on 依靠；取决于
available|adj.|可获得的；有空的|阅读常用|More information is available online.|网上可以获取更多信息。|be available 可获得；有空
necessary|adj.|必要的|阅读常用|It is necessary to review new words.|复习新单词是必要的。|It is necessary to do sth. 做某事是必要的
possible|adj.|可能的|阅读常用|It is possible to learn from mistakes.|从错误中学习是可能的。|as soon as possible 尽快
important|adj.|重要的|阅读常用|Sleep is important for learning.|睡眠对学习很重要。|be important for 对……重要
common|adj.|常见的；共同的|阅读常用|This is a common mistake among learners.|这是学习者常犯的错误。|have something in common 有共同点
similar|adj.|相似的|阅读常用|Their answers are similar to mine.|他们的答案和我的相似。|be similar to 与……相似
different|adj.|不同的|阅读常用|People have different learning habits.|人们有不同的学习习惯。|be different from 与……不同
certain|adj.|确定的；某些|阅读常用|I am certain that she will come.|我确信她会来。|be certain about 对……有把握
likely|adj./adv.|可能的；很可能|阅读常用|He is likely to arrive before noon.|他很可能在中午之前到达。|be likely to do sth. 很可能做某事
responsible|adj.|负责的；有责任的|阅读常用|We are responsible for our own learning.|我们要对自己的学习负责。|be responsible for 对……负责
however|adv.|然而|逻辑表达|The task was difficult. However, we finished it.|任务很难。然而，我们完成了它。|常用于转折；留意句间标点
therefore|adv.|因此|逻辑表达|It was raining; therefore, we stayed inside.|当时下雨，因此我们待在室内。|表示因果关系中的结果
although|conj.|虽然；尽管|逻辑表达|Although he was tired, he kept reading.|虽然他很累，但他继续阅读。|although 从句通常不与 but 连用
unless|conj.|除非；如果不|逻辑表达|You will miss the bus unless you leave now.|如果你不现在出发，就会错过公交车。|unless 通常相当于 if ... not
instead|adv.|代替；反而|逻辑表达|I walked home instead of taking a taxi.|我步行回家，没有乘出租车。|instead of 后接名词或动名词
despite|prep.|尽管|逻辑表达|Despite the rain, they went for a walk.|尽管下雨，他们还是去散步了。|despite 后接名词或动名词
otherwise|adv.|否则；不然|逻辑表达|Hurry up; otherwise, we will be late.|快点，否则我们会迟到。|可表达相反情况下的结果
besides|adv./prep.|此外；除……之外（还）|逻辑表达|Besides English, she also studies history.|除了英语，她还学习历史。|besides 表示包括在内的“除了”
especially|adv.|尤其；特别|逻辑表达|I enjoy reading, especially short stories.|我喜欢阅读，尤其喜欢短篇小说。|强调其中某一项
actually|adv.|实际上|逻辑表达|The problem is actually quite simple.|这个问题实际上很简单。|用于说明实际情况
probably|adv.|大概；很可能|逻辑表达|She will probably arrive this afternoon.|她很可能今天下午到达。|表示较大的可能性
gradually|adv.|逐渐地|逻辑表达|His English gradually improved.|他的英语逐渐进步了。|gradual 是形容词形式
finally|adv.|终于；最后|逻辑表达|They finally found the correct answer.|他们终于找到了正确答案。|可表示经过一段过程后的结果
recently|adv.|最近|逻辑表达|I have recently started a new course.|我最近开始了一门新课程。|常见于现在完成时语境
regularly|adv.|有规律地；定期地|逻辑表达|Review your notes regularly.|定期复习笔记。|regular 是形容词形式
immediately|adv.|立即|逻辑表达|Please call me immediately if you need help.|如果需要帮助，请立即给我打电话。|immediate 是形容词形式
particularly|adv.|尤其；特别|逻辑表达|This method is particularly useful for beginners.|这个方法对初学者特别有用。|particular 是形容词形式
eventually|adv.|最终|逻辑表达|After many attempts, he eventually succeeded.|多次尝试之后，他最终成功了。|强调过程之后的最终结果
frequently|adv.|经常；频繁地|逻辑表达|This word appears frequently in newspapers.|这个词经常出现在报纸中。|frequent 是形容词形式
otherwise|adv.|在其他方面；否则|逻辑表达|The room is small but otherwise comfortable.|房间很小，但在其他方面很舒适。|注意结合上下文选择词义
reason|n.|原因；理由|逻辑表达|What is the reason for the change?|这个变化的原因是什么？|the reason for ……的原因
result|n./v.|结果；导致|逻辑表达|Hard work often results in progress.|努力常常带来进步。|result in 导致；result from 由……产生
purpose|n.|目的|逻辑表达|The purpose of this activity is to build confidence.|这项活动的目的是建立信心。|on purpose 故意地
advantage|n.|优势；优点|逻辑表达|Online courses have several advantages.|网络课程有几个优点。|take advantage of 利用
disadvantage|n.|缺点；不利条件|逻辑表达|A major disadvantage is the high cost.|一个主要缺点是成本很高。|与 advantage 对应
evidence|n.|证据|逻辑表达|There is no evidence to support the claim.|没有证据支持这个说法。|通常作不可数名词
opinion|n.|观点；看法|逻辑表达|In my opinion, the plan is worth trying.|在我看来，这个计划值得尝试。|in one's opinion 在某人看来
attitude|n.|态度|逻辑表达|A positive attitude can help you face difficulties.|积极的态度有助于面对困难。|attitude towards 对……的态度
detail|n.|细节|逻辑表达|Please read the instructions in detail.|请详细阅读说明。|in detail 详细地
conclusion|n.|结论|逻辑表达|We reached the same conclusion.|我们得出了相同的结论。|reach a conclusion 得出结论
education|n.|教育|校园与社会|Education can create more opportunities.|教育可以创造更多机会。|educate 是动词形式
knowledge|n.|知识|校园与社会|Practice helps us use our knowledge.|实践帮助我们运用知识。|通常作不可数名词
experience|n./v.|经验；经历|校园与社会|She has experience in teaching English.|她有英语教学经验。|“经验”不可数；“经历”可数
opportunity|n.|机会|校园与社会|This course offers an opportunity to learn.|这门课程提供了一个学习机会。|an opportunity to do sth. 做某事的机会
challenge|n./v.|挑战|校园与社会|Learning a new language is a challenge.|学习一门新语言是一个挑战。|face a challenge 面对挑战
progress|n./v.|进步；进展|校园与社会|You have made great progress this month.|你这个月取得了很大的进步。|make progress 取得进步；名词通常不可数
effort|n.|努力|校园与社会|Your effort will make a difference.|你的努力会产生影响。|make an effort 努力
confidence|n.|信心|校园与社会|Small successes help build confidence.|小的成功有助于建立信心。|have confidence in 对……有信心
ability|n.|能力|校园与社会|The course develops your ability to write.|这门课程培养你的写作能力。|the ability to do sth. 做某事的能力
skill|n.|技能|校园与社会|Communication is an important skill.|沟通是一项重要技能。|develop skills 培养技能
habit|n.|习惯|校园与社会|Reading before bed is a good habit.|睡前阅读是个好习惯。|form a habit 养成习惯
method|n.|方法|校园与社会|Different students prefer different methods.|不同学生喜欢不同的方法。|a method of doing sth. 做某事的方法
practice|n./v.|练习；实践|校园与社会|You need more practice in speaking.|你需要更多口语练习。|practice doing sth. 练习做某事
attention|n.|注意；关注|校园与社会|Pay attention to the meaning of the sentence.|注意句子的意思。|pay attention to 后接名词或动名词
memory|n.|记忆；记忆力|校园与社会|Sleep plays an important role in memory.|睡眠在记忆中起着重要作用。|memory 也可指一段回忆
environment|n.|环境|校园与社会|A quiet environment makes studying easier.|安静的环境让学习更轻松。|protect the environment 保护环境
pollution|n.|污染|校园与社会|Air pollution is a serious problem.|空气污染是一个严重问题。|pollute 是动词形式
resource|n.|资源|校园与社会|The library is a useful learning resource.|图书馆是一种有用的学习资源。|natural resources 自然资源
society|n.|社会|校园与社会|Technology has changed our society.|科技改变了我们的社会。|social 是形容词形式
community|n.|社区；群体|校园与社会|Volunteers help people in their community.|志愿者帮助社区里的人。|a local community 当地社区
technology|n.|技术；科技|校园与社会|Technology can make learning more convenient.|科技能让学习更加方便。|technological 是形容词形式
communication|n.|交流；沟通|校园与社会|Good communication prevents misunderstandings.|良好的沟通可以避免误解。|communicate with 与……交流
information|n.|信息|校园与社会|Please check the information carefully.|请仔细核对信息。|不可数：a piece of information 一条信息
research|n./v.|研究|校园与社会|The team is doing research on sleep.|这个团队正在研究睡眠。|do research 进行研究
health|n.|健康|校园与社会|Walking every day is good for your health.|每天步行有益健康。|healthy 是形容词形式
quality|n.|质量；品质|校园与社会|We should focus on the quality of our work.|我们应该关注工作质量。|quality of life 生活质量
value|n./v.|价值；重视|校园与社会|We value your time and effort.|我们重视你付出的时间和努力。|valuable 是形容词形式
choice|n.|选择|校园与社会|Everyone should have a choice.|每个人都应该有选择的机会。|make a choice 作出选择
decision|n.|决定|校园与社会|Think carefully before making a decision.|作决定之前要认真思考。|decide 是动词形式
relationship|n.|关系|校园与社会|Trust is important in any relationship.|信任在任何关系中都很重要。|relationship between ……之间的关系
participate|v.|参与|校园与社会|All students can participate in the activity.|所有学生都可以参加这项活动。|participate in 参与
apply|v.|申请；应用|校园与社会|She plans to apply for a scholarship.|她计划申请奖学金。|apply for 申请；apply to 适用于
prepare|v.|准备|校园与社会|We need to prepare for the exam.|我们需要为考试做准备。|prepare for 为……做准备
complete|v./adj.|完成；完整的|校园与社会|Please complete the task before Friday.|请在周五之前完成任务。|complete a task 完成任务
concentrate|v.|集中注意力|校园与社会|It is hard to concentrate in a noisy room.|在嘈杂的房间里很难集中注意力。|concentrate on 专注于
solve|v.|解决|校园与社会|We worked together to solve the problem.|我们一起解决了这个问题。|solve a problem 解决问题
discover|v.|发现|校园与社会|She discovered a useful way to review words.|她发现了一种有用的复习单词的方法。|discover 常指发现原已存在的事物
create|v.|创造|校园与社会|The project will create new jobs.|这个项目将创造新的就业岗位。|creative 是形容词形式
achieve|v.|实现；达到|校园与社会|We can achieve more by working together.|通过合作，我们能取得更多成果。|achievement 是名词形式
fail|v.|失败；未能|校园与社会|He failed to notice the spelling mistake.|他没有注意到这个拼写错误。|fail to do sth. 未能做某事
familiar|adj.|熟悉的|写作积累|Are you familiar with this word?|你熟悉这个单词吗？|be familiar with 熟悉……
convenient|adj.|方便的|写作积累|Online learning is convenient for many students.|在线学习对许多学生来说很方便。|It is convenient for sb. 对某人来说方便
effective|adj.|有效的|写作积累|This is an effective way to learn vocabulary.|这是学习词汇的有效方法。|effect 是名词形式
independent|adj.|独立的|写作积累|College students should become more independent.|大学生应该变得更加独立。|independence 是名词形式
patient|adj./n.|耐心的；病人|写作积累|Be patient when you learn something new.|学习新东西时要有耐心。|be patient with 对……有耐心
valuable|adj.|有价值的；宝贵的|写作积累|She gave me some valuable advice.|她给了我一些宝贵的建议。|advice 通常作不可数名词
successful|adj.|成功的|写作积累|The event was successful because of teamwork.|由于团队合作，这次活动很成功。|succeed 动词；success 名词
serious|adj.|严重的；认真的|写作积累|Water pollution is a serious issue.|水污染是一个严重问题。|be serious about 认真对待
positive|adj.|积极的；肯定的|写作积累|Try to keep a positive attitude.|努力保持积极的态度。|a positive attitude 积极的态度
negative|adj.|消极的；否定的|写作积累|Stress may have a negative effect on sleep.|压力可能对睡眠产生负面影响。|a negative effect 负面影响
essential|adj.|必不可少的|写作积累|Practice is essential for learning a language.|练习对学习语言必不可少。|be essential for 对……必不可少
focus|v./n.|专注；焦点|写作积累|Focus on one task at a time.|一次专注于一项任务。|focus on 专注于
contribute|v.|贡献；促成|写作积累|Everyone can contribute to a cleaner environment.|每个人都能为更清洁的环境出力。|contribute to 有助于；为……作贡献
promote|v.|促进；推广|写作积累|The club promotes healthy habits.|这个俱乐部倡导健康习惯。|promote development 促进发展
protect|v.|保护|写作积累|We should protect the environment.|我们应该保护环境。|protect ... from ... 保护……免受……
concern|n./v.|担忧；涉及|写作积累|Parents expressed concern about the problem.|家长们表达了对这个问题的担忧。|be concerned about 担心……
respect|n./v.|尊重|写作积累|We should respect different opinions.|我们应该尊重不同的意见。|show respect for 对……表示尊重
balance|n./v.|平衡|写作积累|Find a balance between study and rest.|找到学习和休息之间的平衡。|a balance between A and B A与B之间的平衡
advice|n.|建议|写作积累|Could you give me some advice?|你能给我一些建议吗？|不可数：a piece of advice 一条建议
recommend|v.|推荐；建议|写作积累|I recommend reading this book.|我推荐读这本书。|recommend doing sth. 建议做某事`;
const seen = new Set();
export const STARTER_WORDS = raw.split('\n').map(line => {
  const [term, pos, meaning, group, example, translation, tip] = line.split('|');
  return { id: `base:${term}`, term, pos, meaning, group, example, translation, tip };
}).filter(w => { if (seen.has(w.id)) return false; seen.add(w.id); return true; });
