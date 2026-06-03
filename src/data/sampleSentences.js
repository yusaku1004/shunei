// 森沢メソッド準拠サンプル例文（日→英）
// level: 1=入門 2=初級 3=中級 4=上級
export const SAMPLE_SENTENCES = [

  // =====================
  // be動詞
  // =====================
  { jp: '私は学生です。', en: 'I am a student.', tag: 'be動詞', level: 1 },
  { jp: '彼女は医者です。', en: 'She is a doctor.', tag: 'be動詞', level: 1 },
  { jp: 'これは私の本です。', en: 'This is my book.', tag: 'be動詞', level: 1 },
  { jp: '彼らは友達です。', en: 'They are friends.', tag: 'be動詞', level: 1 },
  { jp: '私は今、とても疲れています。', en: 'I am very tired now.', tag: 'be動詞', level: 1 },
  { jp: '彼は背が高くて、親切です。', en: 'He is tall and kind.', tag: 'be動詞', level: 1 },
  { jp: '空は今日、青いです。', en: 'The sky is blue today.', tag: 'be動詞', level: 1 },
  { jp: 'この問題はとても難しいです。', en: 'This problem is very difficult.', tag: 'be動詞', level: 1 },
  { jp: '私たちは同じクラスです。', en: 'We are in the same class.', tag: 'be動詞', level: 1 },

  // =====================
  // 一般動詞・現在形
  // =====================
  { jp: '私は毎朝コーヒーを飲みます。', en: 'I drink coffee every morning.', tag: '一般動詞', level: 1 },
  { jp: '彼は東京に住んでいます。', en: 'He lives in Tokyo.', tag: '一般動詞', level: 1 },
  { jp: '私たちは英語を勉強しています。', en: 'We study English.', tag: '一般動詞', level: 1 },
  { jp: '彼女は毎日走ります。', en: 'She runs every day.', tag: '一般動詞', level: 1 },
  { jp: '私は音楽を聴くのが好きです。', en: 'I like listening to music.', tag: '一般動詞', level: 1 },
  { jp: '彼は毎晩本を読みます。', en: 'He reads a book every evening.', tag: '一般動詞', level: 1 },
  { jp: '彼女は大学で数学を教えています。', en: 'She teaches math at university.', tag: '一般動詞', level: 2 },
  { jp: '私は週末に料理をします。', en: 'I cook on weekends.', tag: '一般動詞', level: 1 },
  { jp: '彼らは毎朝7時に起きます。', en: 'They get up at seven every morning.', tag: '一般動詞', level: 1 },
  { jp: '私の母は花を育てるのが好きです。', en: 'My mother likes growing flowers.', tag: '一般動詞', level: 2 },
  { jp: '私は毎晩日記をつけています。', en: 'I keep a diary every night.', tag: '一般動詞', level: 1 },
  { jp: '彼女は3カ国語を話します。', en: 'She speaks three languages.', tag: '一般動詞', level: 2 },
  { jp: '私たちは同じ目標に向かって働いています。', en: 'We work toward the same goal.', tag: '一般動詞', level: 2 },
  { jp: 'このレストランは午後11時まで営業しています。', en: 'This restaurant is open until eleven p.m.', tag: '一般動詞', level: 1 },

  // =====================
  // 現在進行形
  // =====================
  { jp: '彼は今、電話で話しています。', en: 'He is talking on the phone now.', tag: '現在進行形', level: 1 },
  { jp: '私たちは新しいプロジェクトに取り組んでいます。', en: 'We are working on a new project.', tag: '現在進行形', level: 2 },
  { jp: '彼女は今、報告書を書いています。', en: 'She is writing a report now.', tag: '現在進行形', level: 2 },
  { jp: '子供たちは公園で遊んでいます。', en: 'The children are playing in the park.', tag: '現在進行形', level: 1 },
  { jp: '外は雨が降っています。', en: 'It is raining outside.', tag: '現在進行形', level: 1 },
  { jp: '彼は新しいスキルを学んでいるところです。', en: 'He is learning new skills.', tag: '現在進行形', level: 2 },
  { jp: '彼女は今、新しいビジネスを立ち上げようとしています。', en: 'She is trying to start a new business.', tag: '現在進行形', level: 3 },
  { jp: '私は今、ちょうど出かけるところです。', en: 'I am just about to go out.', tag: '現在進行形', level: 2 },

  // =====================
  // 過去形
  // =====================
  { jp: '昨日、私は映画を見ました。', en: 'I watched a movie yesterday.', tag: '過去形', level: 1 },
  { jp: '彼は先週東京を訪れました。', en: 'He visited Tokyo last week.', tag: '過去形', level: 1 },
  { jp: '私たちは昨夜夕食を食べました。', en: 'We had dinner last night.', tag: '過去形', level: 1 },
  { jp: '彼女は子供のとき、ピアノを弾いていました。', en: 'She played the piano when she was a child.', tag: '過去形', level: 2 },
  { jp: '昨日の会議は2時間かかりました。', en: 'Yesterday\'s meeting took two hours.', tag: '過去形', level: 2 },
  { jp: '私は学生のとき、毎日図書館に行きました。', en: 'I went to the library every day when I was a student.', tag: '過去形', level: 2 },
  { jp: '彼女は先月新しい仕事を始めました。', en: 'She started a new job last month.', tag: '過去形', level: 2 },
  { jp: '私たちは先週末、海に行きました。', en: 'We went to the beach last weekend.', tag: '過去形', level: 1 },
  { jp: '彼は昨日遅くまで残業しました。', en: 'He worked overtime until late yesterday.', tag: '過去形', level: 2 },
  { jp: '子供のころ、私はよく祖父母の家を訪ねました。', en: 'As a child, I often visited my grandparents\' house.', tag: '過去形', level: 2 },
  { jp: '彼はその知らせを聞いて驚きました。', en: 'He was surprised to hear the news.', tag: '過去形', level: 2 },
  { jp: 'その問題を解決するのに3時間かかりました。', en: 'It took us three hours to solve the problem.', tag: '過去形', level: 2 },
  { jp: '彼女はその時、涙をこらえられませんでした。', en: 'She could not hold back her tears at that time.', tag: '過去形', level: 3 },

  // =====================
  // 未来形
  // =====================
  { jp: '明日、私は友達に会います。', en: 'I will meet my friend tomorrow.', tag: '未来形', level: 1 },
  { jp: '彼女は来年アメリカに行く予定です。', en: 'She is going to go to America next year.', tag: '未来形', level: 2 },
  { jp: '会議は3時に始まります。', en: 'The meeting will start at three.', tag: '未来形', level: 2 },
  { jp: '明日は晴れるでしょう。', en: 'It will be sunny tomorrow.', tag: '未来形', level: 1 },
  { jp: '彼は来月、転職する予定です。', en: 'He is going to change jobs next month.', tag: '未来形', level: 2 },
  { jp: '新しいシステムは来週から使えるようになります。', en: 'The new system will be available from next week.', tag: '未来形', level: 3 },
  { jp: '彼女は3年後に結婚する予定です。', en: 'She is going to get married in three years.', tag: '未来形', level: 2 },
  { jp: '来週から新しい習慣を始めるつもりです。', en: 'I am going to start a new habit from next week.', tag: '未来形', level: 2 },
  { jp: 'いつかは自分のビジネスを持ちたいと思っています。', en: 'I hope to have my own business someday.', tag: '未来形', level: 3 },

  // =====================
  // 現在完了形
  // =====================
  { jp: '私はその映画をもう見ました。', en: 'I have already seen the movie.', tag: '現在完了', level: 2 },
  { jp: '彼は一度もパリに行ったことがありません。', en: 'He has never been to Paris.', tag: '現在完了', level: 2 },
  { jp: '私はここに3年間住んでいます。', en: 'I have lived here for three years.', tag: '現在完了', level: 2 },
  { jp: '彼女はちょうど昼食を終えたところです。', en: 'She has just finished lunch.', tag: '現在完了', level: 2 },
  { jp: '私はこの会社で10年間働いています。', en: 'I have worked at this company for ten years.', tag: '現在完了', level: 2 },
  { jp: '私たちはまだ結論に達していません。', en: 'We have not reached a conclusion yet.', tag: '現在完了', level: 3 },
  { jp: '彼はその本を3回読んだことがあります。', en: 'He has read that book three times.', tag: '現在完了', level: 2 },
  { jp: '最近、物価が上がっています。', en: 'Prices have been rising recently.', tag: '現在完了', level: 3 },
  { jp: '彼女はずっとその問題について考えてきました。', en: 'She has been thinking about that problem.', tag: '現在完了', level: 3 },
  { jp: '彼女はそのニュースをまだ聞いていません。', en: 'She has not heard the news yet.', tag: '現在完了', level: 2 },
  { jp: '私はその映画を何度も見たことがあります。', en: 'I have seen that movie many times.', tag: '現在完了', level: 2 },
  { jp: '彼らはずっと同じ問題を抱えています。', en: 'They have been dealing with the same problem.', tag: '現在完了', level: 3 },

  // =====================
  // 助動詞 (can / could)
  // =====================
  { jp: '私はフランス語を少し話せます。', en: 'I can speak a little French.', tag: '助動詞', level: 1 },
  { jp: '子供のころ、私は速く走ることができました。', en: 'I could run fast when I was a child.', tag: '助動詞', level: 2 },
  { jp: '彼女はピアノが弾けますか？', en: 'Can she play the piano?', tag: '助動詞', level: 1 },
  { jp: '明日、手伝ってもらえますか？', en: 'Could you help me tomorrow?', tag: '助動詞', level: 2 },
  { jp: '窓を開けてもらえますか？', en: 'Could you open the window?', tag: '助動詞', level: 2 },
  { jp: '彼はその問題を解くことができませんでした。', en: 'He could not solve the problem.', tag: '助動詞', level: 2 },

  // =====================
  // 助動詞 (should / must / may / might)
  // =====================
  { jp: '毎日英語を練習すべきです。', en: 'You should practice English every day.', tag: '助動詞', level: 2 },
  { jp: '健康のために野菜を食べなければなりません。', en: 'You must eat vegetables for your health.', tag: '助動詞', level: 2 },
  { jp: '彼はもう帰ったかもしれません。', en: 'He may have already gone home.', tag: '助動詞', level: 3 },
  { jp: '今すぐ病院へ行ったほうがいいですよ。', en: 'You should go to the hospital right away.', tag: '助動詞', level: 2 },
  { jp: '傘を持って行ったほうがいいかもしれません。', en: 'You might want to take an umbrella.', tag: '助動詞', level: 2 },
  { jp: 'ここでは静かにしなければなりません。', en: 'You must be quiet here.', tag: '助動詞', level: 1 },
  { jp: 'もう少し考えさせてください。', en: 'Please let me think about it a little more.', tag: '助動詞', level: 2 },
  { jp: '彼はもっと努力すべきだったと思います。', en: 'I think he should have tried harder.', tag: '助動詞', level: 3 },
  { jp: '何かあれば遠慮なく言ってください。', en: 'Please feel free to say anything if there is a problem.', tag: '助動詞', level: 2 },

  // =====================
  // 比較級・最上級
  // =====================
  { jp: '彼は私より背が高いです。', en: 'He is taller than me.', tag: '比較', level: 1 },
  { jp: '今日は昨日より暑いです。', en: 'It is hotter today than yesterday.', tag: '比較', level: 1 },
  { jp: '英語はフランス語より簡単だと思います。', en: 'I think English is easier than French.', tag: '比較', level: 2 },
  { jp: '富士山は日本で一番高い山です。', en: 'Mt. Fuji is the highest mountain in Japan.', tag: '比較', level: 1 },
  { jp: 'これは私が今まで食べた中で一番おいしい料理です。', en: 'This is the most delicious food I have ever eaten.', tag: '比較', level: 3 },
  { jp: '彼女はクラスの中で一番頑張っています。', en: 'She works the hardest in the class.', tag: '比較', level: 2 },
  { jp: '新しいモデルは古いものより2倍速いです。', en: 'The new model is twice as fast as the old one.', tag: '比較', level: 3 },
  { jp: '私は電車よりバスのほうが好きです。', en: 'I prefer buses to trains.', tag: '比較', level: 2 },
  { jp: '彼の新しいアパートは前のより広いです。', en: 'His new apartment is bigger than his old one.', tag: '比較', level: 2 },
  { jp: 'この方法はあの方法ほど効果的ではありません。', en: 'This method is not as effective as that one.', tag: '比較', level: 2 },
  { jp: '彼女はクラスで一番の努力家です。', en: 'She is the most hardworking student in the class.', tag: '比較', level: 2 },

  // =====================
  // 不定詞
  // =====================
  { jp: '私は英語を話せるようになりたいです。', en: 'I want to be able to speak English.', tag: '不定詞', level: 2 },
  { jp: '彼は医者になるために一生懸命勉強しました。', en: 'He studied hard to become a doctor.', tag: '不定詞', level: 2 },
  { jp: '彼女は映画を見に映画館へ行きました。', en: 'She went to the cinema to watch a movie.', tag: '不定詞', level: 2 },
  { jp: '私は旅行するために十分なお金を貯めたいです。', en: 'I want to save enough money to travel.', tag: '不定詞', level: 2 },
  { jp: '外国語を学ぶことは脳に良いです。', en: 'Learning a foreign language is good for your brain.', tag: '不定詞', level: 2 },
  { jp: '彼は何を言えばいいか分かりませんでした。', en: 'He did not know what to say.', tag: '不定詞', level: 3 },
  { jp: '私は今夜どこへ行くか決めていません。', en: 'I have not decided where to go tonight.', tag: '不定詞', level: 3 },
  { jp: 'この問題は簡単に解決できません。', en: 'This problem is not easy to solve.', tag: '不定詞', level: 2 },
  { jp: '彼女は泣き出しそうでした。', en: 'She was about to cry.', tag: '不定詞', level: 3 },
  { jp: '何か飲み物を持ってきましょうか？', en: 'Would you like me to bring you something to drink?', tag: '不定詞', level: 2 },

  // =====================
  // 動名詞
  // =====================
  { jp: '早起きすることは体にいいです。', en: 'Getting up early is good for your health.', tag: '動名詞', level: 2 },
  { jp: '毎日運動することが大切です。', en: 'Exercising every day is important.', tag: '動名詞', level: 2 },
  { jp: '彼は人前で話すことが苦手です。', en: 'He is not good at speaking in public.', tag: '動名詞', level: 2 },
  { jp: '新しい言語を学ぶことは挑戦的ですが楽しいです。', en: 'Learning a new language is challenging but fun.', tag: '動名詞', level: 2 },
  { jp: '私は写真を撮るのが趣味です。', en: 'Taking pictures is my hobby.', tag: '動名詞', level: 1 },
  { jp: '彼女は音楽を聴かずには眠れません。', en: 'She cannot sleep without listening to music.', tag: '動名詞', level: 3 },
  { jp: '毎日少しずつ練習することが大切です。', en: 'It is important to keep practicing a little every day.', tag: '動名詞', level: 2 },
  { jp: '彼は映画を見て英語を学びました。', en: 'He learned English by watching movies.', tag: '動名詞', level: 2 },
  { jp: 'もっと早く始めておけばよかったと後悔しています。', en: 'I regret not starting earlier.', tag: '動名詞', level: 3 },

  // =====================
  // 受動態
  // =====================
  { jp: 'この橋は100年前に建てられました。', en: 'This bridge was built 100 years ago.', tag: '受動態', level: 2 },
  { jp: '英語は世界中で話されています。', en: 'English is spoken all over the world.', tag: '受動態', level: 2 },
  { jp: 'その映画は若者に人気があります。', en: 'The movie is popular among young people.', tag: '受動態', level: 2 },
  { jp: 'このレポートは明日までに提出しなければなりません。', en: 'This report must be submitted by tomorrow.', tag: '受動態', level: 3 },
  { jp: '彼は先週、社長に任命されました。', en: 'He was appointed president last week.', tag: '受動態', level: 3 },
  { jp: '私の提案は受け入れられませんでした。', en: 'My proposal was not accepted.', tag: '受動態', level: 3 },
  { jp: 'その試合は雨のために中止されました。', en: 'The game was canceled because of the rain.', tag: '受動態', level: 2 },
  { jp: 'その本は多くの言語に翻訳されています。', en: 'The book has been translated into many languages.', tag: '受動態', level: 2 },
  { jp: '会議は突然キャンセルされました。', en: 'The meeting was suddenly cancelled.', tag: '受動態', level: 2 },
  { jp: '彼女は新しいプロジェクトのリーダーに選ばれました。', en: 'She was chosen as the leader of the new project.', tag: '受動態', level: 3 },

  // =====================
  // 関係代名詞
  // =====================
  { jp: 'これは私が昨日買った本です。', en: 'This is the book that I bought yesterday.', tag: '関係代名詞', level: 3 },
  { jp: '彼は私が尊敬する人です。', en: 'He is a person whom I respect.', tag: '関係代名詞', level: 3 },
  { jp: '私には東京に住んでいる友人がいます。', en: 'I have a friend who lives in Tokyo.', tag: '関係代名詞', level: 2 },
  { jp: 'これが彼が話していた問題です。', en: 'This is the problem that he was talking about.', tag: '関係代名詞', level: 3 },
  { jp: '彼女が作った料理はとてもおいしかったです。', en: 'The food that she made was very delicious.', tag: '関係代名詞', level: 2 },
  { jp: '私は英語が得意な友人に頼みました。', en: 'I asked a friend who is good at English.', tag: '関係代名詞', level: 3 },
  { jp: 'これが私がずっと探していたものです。', en: 'This is what I have been looking for.', tag: '関係代名詞', level: 3 },
  { jp: 'その試験に合格した学生は全員、奨学金をもらいました。', en: 'All the students who passed the exam received scholarships.', tag: '関係代名詞', level: 4 },
  { jp: '私が住んでいる町はとても静かです。', en: 'The town where I live is very quiet.', tag: '関係代名詞', level: 3 },
  { jp: '彼が書いた手紙を読みました。', en: 'I read the letter that he wrote.', tag: '関係代名詞', level: 2 },
  { jp: 'これが私の人生を変えた本です。', en: 'This is the book that changed my life.', tag: '関係代名詞', level: 3 },

  // =====================
  // 接続詞・複文
  // =====================
  { jp: '仕事が終わったら、電話します。', en: 'I will call you when I finish work.', tag: '接続詞', level: 2 },
  { jp: '雨が降っても、私は走ります。', en: 'I will run even if it rains.', tag: '接続詞', level: 2 },
  { jp: '疲れていたので、早く寝ました。', en: 'I went to bed early because I was tired.', tag: '接続詞', level: 2 },
  { jp: '電車が遅れたので、会議に遅刻しました。', en: 'I was late for the meeting because the train was delayed.', tag: '接続詞', level: 2 },
  { jp: 'もっと練習すれば、上手になれます。', en: 'If you practice more, you will get better.', tag: '接続詞', level: 2 },
  { jp: '忙しいですが、毎日英語を勉強しています。', en: 'Although I am busy, I study English every day.', tag: '接続詞', level: 2 },
  { jp: '彼が到着するまで、ここで待ちましょう。', en: 'Let\'s wait here until he arrives.', tag: '接続詞', level: 2 },
  { jp: '試験に合格するために、毎日勉強しています。', en: 'I study every day so that I can pass the exam.', tag: '接続詞', level: 3 },
  { jp: '彼女が来るまで、ここで待ちます。', en: 'I will wait here until she comes.', tag: '接続詞', level: 2 },
  { jp: '遅刻しないように、早めに出発しました。', en: 'I left early so that I would not be late.', tag: '接続詞', level: 2 },

  // =====================
  // 間接疑問文
  // =====================
  { jp: '彼がいつ戻るか知っていますか？', en: 'Do you know when he will come back?', tag: '間接疑問文', level: 3 },
  { jp: '会議がどこで開かれるか教えてください。', en: 'Please tell me where the meeting will be held.', tag: '間接疑問文', level: 3 },
  { jp: '彼女がなぜ泣いているのかわかりません。', en: 'I do not understand why she is crying.', tag: '間接疑問文', level: 3 },
  { jp: '何が問題なのか教えていただけますか？', en: 'Could you tell me what the problem is?', tag: '間接疑問文', level: 3 },
  { jp: '彼がいくら稼いでいるか知りません。', en: 'I do not know how much he earns.', tag: '間接疑問文', level: 3 },
  { jp: 'どうすればもっと上手くなれるか教えてください。', en: 'Please tell me how I can get better.', tag: '間接疑問文', level: 3 },
  { jp: '彼がどこに住んでいるか知っていますか？', en: 'Do you know where he lives?', tag: '間接疑問文', level: 2 },

  // =====================
  // 仮定法
  // =====================
  { jp: 'もし時間があれば、旅行に行くのに。', en: 'If I had time, I would go on a trip.', tag: '仮定法', level: 3 },
  { jp: 'もっと早く起きればよかった。', en: 'I wish I had gotten up earlier.', tag: '仮定法', level: 4 },
  { jp: 'もし彼が来ていたら、会えたのに。', en: 'If he had come, I could have met him.', tag: '仮定法', level: 4 },
  { jp: 'もしお金があれば、新しい車を買うのに。', en: 'If I had money, I would buy a new car.', tag: '仮定法', level: 3 },
  { jp: 'もっと若かったらよかったのに。', en: 'I wish I were younger.', tag: '仮定法', level: 3 },
  { jp: 'もし彼女の立場だったら、どうしますか？', en: 'What would you do if you were in her position?', tag: '仮定法', level: 4 },
  { jp: 'あのとき諦めなければよかった。', en: 'I wish I had not given up at that time.', tag: '仮定法', level: 4 },
  { jp: 'もし飛べたら、どこへ行きますか？', en: 'If you could fly, where would you go?', tag: '仮定法', level: 3 },
  { jp: '彼女の言うとおりにしていればよかった。', en: 'I wish I had followed her advice.', tag: '仮定法', level: 4 },

  // =====================
  // ビジネス英語
  // =====================
  { jp: '会議の日程を確認させてください。', en: 'Let me confirm the meeting schedule.', tag: 'ビジネス', level: 3 },
  { jp: 'ご連絡をお待ちしております。', en: 'I look forward to hearing from you.', tag: 'ビジネス', level: 3 },
  { jp: 'ご不明な点がございましたらお知らせください。', en: 'Please let me know if you have any questions.', tag: 'ビジネス', level: 3 },
  { jp: '提案書を添付いたします。', en: 'I am attaching the proposal.', tag: 'ビジネス', level: 3 },
  { jp: 'ご検討のほどよろしくお願いいたします。', en: 'Thank you for your consideration.', tag: 'ビジネス', level: 3 },
  { jp: '来週の月曜日にご都合はいかがですか？', en: 'Would Monday next week work for you?', tag: 'ビジネス', level: 3 },
  { jp: '締め切りを延ばすことは可能でしょうか？', en: 'Would it be possible to extend the deadline?', tag: 'ビジネス', level: 3 },
  { jp: '先ほどのご説明について確認させてください。', en: 'Let me clarify what you explained earlier.', tag: 'ビジネス', level: 3 },
  { jp: 'お手数をおかけして申し訳ございません。', en: 'I am sorry for the inconvenience.', tag: 'ビジネス', level: 3 },
  { jp: '詳細については追ってご連絡いたします。', en: 'I will follow up with the details later.', tag: 'ビジネス', level: 3 },
  { jp: '次回の会議は来週木曜日を予定しています。', en: 'The next meeting is scheduled for Thursday next week.', tag: 'ビジネス', level: 3 },
  { jp: 'このプロジェクトの進捗状況をご報告します。', en: 'I would like to report on the progress of this project.', tag: 'ビジネス', level: 4 },
  { jp: 'ご承認をお願いできますでしょうか？', en: 'Could I ask for your approval?', tag: 'ビジネス', level: 3 },
  { jp: '資料を事前にお送りします。', en: 'I will send you the materials in advance.', tag: 'ビジネス', level: 3 },
  { jp: 'この件についてご相談したいのですが。', en: 'I would like to discuss this matter with you.', tag: 'ビジネス', level: 3 },
  { jp: '進捗報告をいただけますか？', en: 'Could you give me a progress update?', tag: 'ビジネス', level: 3 },
  { jp: 'ご多忙のところ恐れ入りますが。', en: 'I am sorry to bother you when you are busy.', tag: 'ビジネス', level: 3 },
  { jp: 'ご返信をお待ちしております。', en: 'I look forward to your reply.', tag: 'ビジネス', level: 3 },
  { jp: 'ミーティングの場所を変更していただけますか？', en: 'Would it be possible to change the meeting location?', tag: 'ビジネス', level: 3 },
  { jp: 'この見積もりをご確認いただけますか？', en: 'Could you review this estimate?', tag: 'ビジネス', level: 3 },

  // =====================
  // 日常会話
  // =====================
  { jp: 'お腹が空いたので、何か食べましょう。', en: 'I am hungry, so let\'s eat something.', tag: '日常会話', level: 1 },
  { jp: '今日はどこかに行きたいですか？', en: 'Do you want to go somewhere today?', tag: '日常会話', level: 1 },
  { jp: 'この近くにコンビニはありますか？', en: 'Is there a convenience store near here?', tag: '日常会話', level: 1 },
  { jp: '昨日の夜、よく眠れましたか？', en: 'Did you sleep well last night?', tag: '日常会話', level: 1 },
  { jp: '週末は何をするつもりですか？', en: 'What are you going to do on the weekend?', tag: '日常会話', level: 2 },
  { jp: 'この映画は面白そうですね。', en: 'This movie looks interesting.', tag: '日常会話', level: 1 },
  { jp: '最近、忙しくしていますか？', en: 'Have you been busy lately?', tag: '日常会話', level: 2 },
  { jp: '何か困っていることはありますか？', en: 'Is there anything bothering you?', tag: '日常会話', level: 2 },
  { jp: 'もっとゆっくり話してもらえますか？', en: 'Could you speak more slowly?', tag: '日常会話', level: 1 },
  { jp: 'すみません、道に迷ってしまいました。', en: 'Excuse me, I am lost.', tag: '日常会話', level: 1 },
  { jp: '電車は何番線から乗ればいいですか？', en: 'Which platform should I take the train from?', tag: '日常会話', level: 2 },
  { jp: 'ここから駅まで歩いてどのくらいかかりますか？', en: 'How long does it take to walk from here to the station?', tag: '日常会話', level: 2 },
  { jp: '正直に言うと、よく分かりません。', en: 'To be honest, I am not sure.', tag: '日常会話', level: 1 },
  { jp: '今夜、外食しませんか？', en: 'Why don\'t we eat out tonight?', tag: '日常会話', level: 1 },
  { jp: 'すぐに戻ります。', en: 'I will be right back.', tag: '日常会話', level: 1 },
  { jp: 'もう一度言っていただけますか？', en: 'Could you say that again?', tag: '日常会話', level: 1 },
  { jp: 'それは知りませんでした。', en: 'I did not know that.', tag: '日常会話', level: 1 },
  { jp: 'あなたのことをずっと心配していました。', en: 'I have been worried about you.', tag: '日常会話', level: 2 },

  // =====================
  // 旅行
  // =====================
  { jp: 'チェックインをお願いします。', en: 'I would like to check in, please.', tag: '旅行', level: 2 },
  { jp: '空港までタクシーで行きたいです。', en: 'I would like to go to the airport by taxi.', tag: '旅行', level: 2 },
  { jp: '観光スポットを教えてもらえますか？', en: 'Could you tell me about the tourist spots?', tag: '旅行', level: 2 },
  { jp: 'この電車はロンドン行きですか？', en: 'Is this train going to London?', tag: '旅行', level: 1 },
  { jp: '一人で世界を旅するのが夢です。', en: 'My dream is to travel around the world alone.', tag: '旅行', level: 2 },
  { jp: 'この辺でおすすめのレストランはありますか？', en: 'Is there any restaurant you recommend around here?', tag: '旅行', level: 2 },
  { jp: 'パスポートを忘れてしまいました。', en: 'I forgot my passport.', tag: '旅行', level: 2 },
  { jp: '荷物を預けることはできますか？', en: 'Can I leave my luggage here?', tag: '旅行', level: 2 },
  { jp: '一番近い地下鉄の駅はどこですか？', en: 'Where is the nearest subway station?', tag: '旅行', level: 1 },
  { jp: '禁煙の部屋をお願いします。', en: 'I would like a non-smoking room, please.', tag: '旅行', level: 2 },
  { jp: '朝食は料金に含まれていますか？', en: 'Is breakfast included in the price?', tag: '旅行', level: 2 },
  { jp: '帰りの航空券を予約したいです。', en: 'I would like to book a return flight.', tag: '旅行', level: 2 },

  // =====================
  // 健康・生活
  // =====================
  { jp: '最近、ストレスが多くてよく眠れません。', en: 'I have been stressed lately and cannot sleep well.', tag: '健康', level: 2 },
  { jp: '風邪を引いたようです。', en: 'It seems like I have caught a cold.', tag: '健康', level: 2 },
  { jp: '毎日30分歩くことを心がけています。', en: 'I try to walk for thirty minutes every day.', tag: '健康', level: 2 },
  { jp: '体調が悪いので、今日は休みます。', en: 'I am not feeling well, so I will take the day off today.', tag: '健康', level: 2 },
  { jp: 'もっと野菜を食べるべきだとわかっています。', en: 'I know I should eat more vegetables.', tag: '健康', level: 2 },
  { jp: '頭痛がします。', en: 'I have a headache.', tag: '健康', level: 1 },
  { jp: '少し熱があるようです。', en: 'It seems like I have a slight fever.', tag: '健康', level: 2 },
  { jp: '最近、疲れが取れません。', en: 'I have not been able to shake off my fatigue lately.', tag: '健康', level: 3 },
  { jp: '定期的に健康診断を受けることをお勧めします。', en: 'I recommend getting a regular health checkup.', tag: '健康', level: 3 },

  // =====================
  // 分詞・分詞構文
  // =====================
  { jp: '彼女が歌っている姿を見ました。', en: 'I saw her singing.', tag: '分詞', level: 3 },
  { jp: '駅の前に停まっているタクシーに乗りました。', en: 'I got into the taxi parked in front of the station.', tag: '分詞', level: 3 },
  { jp: '音楽を聴きながら、走りました。', en: 'I ran while listening to music.', tag: '分詞', level: 3 },
  { jp: '宿題を終えてから、テレビを見ました。', en: 'Having finished my homework, I watched TV.', tag: '分詞', level: 4 },
  { jp: '彼女は微笑みながら部屋に入ってきました。', en: 'She came into the room smiling.', tag: '分詞', level: 3 },

  // =====================
  // 社会・環境
  // =====================
  { jp: '環境問題は私たち全員に関係しています。', en: 'Environmental issues concern all of us.', tag: '社会', level: 3 },
  { jp: 'リモートワークが普及してきています。', en: 'Remote work is becoming more common.', tag: '社会', level: 3 },
  { jp: 'プラスチックゴミを減らすことが重要です。', en: 'It is important to reduce plastic waste.', tag: '社会', level: 3 },
  { jp: 'AIは私たちの働き方を変えるでしょう。', en: 'AI will change the way we work.', tag: '社会', level: 3 },
  { jp: '多様性を認め合うことが大切です。', en: 'It is important to accept and respect diversity.', tag: '社会', level: 3 },
  { jp: '再生可能エネルギーへの移行が求められています。', en: 'A shift to renewable energy is required.', tag: '社会', level: 4 },

  // =====================
  // 感情・意見
  // =====================
  { jp: 'その映画には感動しました。', en: 'I was moved by the movie.', tag: '感情', level: 2 },
  { jp: 'そのニュースを聞いてがっかりしました。', en: 'I was disappointed to hear the news.', tag: '感情', level: 2 },
  { jp: 'あなたがそう言ってくれて嬉しいです。', en: 'I am glad you said that.', tag: '感情', level: 1 },
  { jp: 'それは思ったよりずっと難しかったです。', en: 'It was much harder than I expected.', tag: '感情', level: 2 },
  { jp: '正直、その提案には賛成できません。', en: 'Honestly, I cannot agree with that proposal.', tag: '感情', level: 3 },
  { jp: '彼の話を聞いて心が動かされました。', en: 'I was touched by his story.', tag: '感情', level: 3 },
  { jp: 'この状況に少しイライラしています。', en: 'I am a little frustrated with this situation.', tag: '感情', level: 2 },
  { jp: 'もっと早く気づけばよかったと思います。', en: 'I wish I had noticed it sooner.', tag: '感情', level: 3 },

  // =====================
  // IT・テクノロジー
  // =====================
  { jp: 'Wi-Fiのパスワードを教えていただけますか？', en: 'Could you tell me the Wi-Fi password?', tag: 'IT', level: 1 },
  { jp: 'このアプリの使い方を教えてください。', en: 'Please show me how to use this app.', tag: 'IT', level: 2 },
  { jp: 'データのバックアップを取りましたか？', en: 'Have you backed up the data?', tag: 'IT', level: 2 },
  { jp: 'システムのアップデートが必要です。', en: 'The system needs to be updated.', tag: 'IT', level: 2 },
  { jp: 'そのファイルを共有していただけますか？', en: 'Could you share that file with me?', tag: 'IT', level: 2 },
  { jp: 'ビデオ通話をセットアップしましょう。', en: 'Let\'s set up a video call.', tag: 'IT', level: 2 },

  // =====================
  // 食事・レストラン
  // =====================
  { jp: '2名で席を予約したいのですが。', en: 'I would like to make a reservation for two.', tag: 'レストラン', level: 2 },
  { jp: 'おすすめは何ですか？', en: 'What do you recommend?', tag: 'レストラン', level: 1 },
  { jp: 'お会計をお願いします。', en: 'Could I have the check, please?', tag: 'レストラン', level: 1 },
  { jp: 'お水をもう一杯いただけますか？', en: 'Could I have another glass of water?', tag: 'レストラン', level: 1 },
  { jp: '辛い料理は苦手です。', en: 'I am not good with spicy food.', tag: 'レストラン', level: 1 },
  { jp: 'テイクアウトにしていただけますか？', en: 'Could I get this to go?', tag: 'レストラン', level: 1 },
]
