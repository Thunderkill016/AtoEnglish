#!/usr/bin/env python3
"""Seed explanation_vn + sentenceCorrectionExercises + listenAndArrangeExercises
for units 11-42 and unitA01-A08."""

import re, os, sys

BASE = os.path.join(os.path.dirname(__file__), '..', 'src', 'lib', 'data', 'units')

# ─── Content database ────────────────────────────────────────────────────────
# Each entry: unit_id -> { q1_exp, q2_exp, q3_exp, sc1, sc2, la1, la2 }
# sc = { sentence, error, correction, explanation }
# la = { audio_text, prompt_vn, words[], answer }

SEED = {
  "unit11": {
    "q1": "Danh từ bệnh cần 'a/an': 'a headache', 'a cold'. Không dùng 'feel a headache' — 'feel' diễn tả cảm xúc.",
    "q2": "'Feel' dùng cho cảm xúc/trạng thái: 'feel happy/tired'. 'Have' dùng cho bệnh: 'have a cold'.",
    "q3": "'She' → thêm '-s': 'feels'. 'Have/Has' không hợp với 'tired' — dùng 'feel/feels'.",
    "sc": [
      {"id":"sc11-1","sentence":"I have headache and fever.","error":"headache","correction":"a headache","exp":"Danh từ bệnh cần mạo từ 'a': 'have A headache'. Tương tự: a cold, a fever."},
      {"id":"sc11-2","sentence":"She feel very tired after work.","error":"feel","correction":"feels","exp":"'She' (ngôi 3 số ít) → động từ thêm '-s': 'feels'. 'Feel' dùng cho I/you/we/they."},
    ],
    "la": [
      {"audio":"I have a headache and feel tired.","vn":"Tôi bị đau đầu và cảm thấy mệt.","words":["I","have","a","headache","and","feel","tired",".","sick","are"],"answer":"I have a headache and feel tired ."},
      {"audio":"She feels happy when she sees her family.","vn":"Cô ấy cảm thấy hạnh phúc khi gặp gia đình.","words":["She","feels","happy","when","she","sees","her","family",".","feel","has"],"answer":"She feels happy when she sees her family ."},
    ],
  },
  "unit12": {
    "q1": "Ôn unit 6: 'Two windows' số nhiều → 'There ARE'. 'There is two windows' sai vì is dùng số ít.",
    "q2": "Ôn unit 7: 'These shoes' số nhiều → 'How much ARE'. 'How much is these' sai.",
    "q3": "Ôn unit 11: 'have a headache' (bệnh) + 'feel tired' (trạng thái). 'I have tired' sai cấu trúc.",
    "sc": [
      {"id":"sc12-1","sentence":"There is many people in the room.","error":"is","correction":"are","exp":"'Many people' số nhiều → 'There ARE many people'. 'Is' chỉ dùng cho số ít."},
      {"id":"sc12-2","sentence":"How much is these trousers?","error":"is","correction":"are","exp":"'These trousers' số nhiều → 'How much ARE these trousers'. Tương tự jeans, glasses, scissors."},
    ],
    "la": [
      {"audio":"There are three chairs in the living room.","vn":"Có ba chiếc ghế trong phòng khách.","words":["There","are","three","chairs","in","the","living","room",".","is","two"],"answer":"There are three chairs in the living room ."},
      {"audio":"How much are these shoes?","vn":"Đôi giày này giá bao nhiêu?","words":["How","much","are","these","shoes","?","is","many"],"answer":"How much are these shoes ?"},
    ],
  },
  "unit13": {
    "q1": "Past Simple: câu khẳng định dùng V2 (quá khứ). Không thêm '-s', không dùng 'did + V2'.",
    "q2": "'Went' là quá khứ bất quy tắc của 'go'. 'Goed/goes/going' đều sai.",
    "q3": "'Stayed' là quá khứ của 'stay' (quy tắc: +ed). Với 'we' không thêm '-s'.",
    "sc": [
      {"id":"sc13-1","sentence":"He goed to the market yesterday.","error":"goed","correction":"went","exp":"'Go' là động từ bất quy tắc: go → WENT. Không bao giờ viết 'goed'."},
      {"id":"sc13-2","sentence":"I buyed a new phone last week.","error":"buyed","correction":"bought","exp":"'Buy' → 'bought' (bất quy tắc). Không có 'buyed'. Học thuộc: buy→bought, think→thought."},
    ],
    "la": [
      {"audio":"She went to the market yesterday morning.","vn":"Cô ấy đi chợ sáng hôm qua.","words":["She","went","to","the","market","yesterday","morning",".","go","goes"],"answer":"She went to the market yesterday morning ."},
      {"audio":"I bought a new phone last week.","vn":"Tôi mua một chiếc điện thoại mới tuần trước.","words":["I","bought","a","new","phone","last","week",".","buyed","buy"],"answer":"I bought a new phone last week ."},
    ],
  },
  "unit14": {
    "q1": "'Will + bare infinitive' dùng cho quyết định tức thì / dự đoán. 'Going to' dùng cho kế hoạch sẵn có.",
    "q2": "'Is going to attend' = kế hoạch đã sắp xếp trước (bằng chứng có sẵn).",
    "q3": "'Will be' hoặc 'is' cho lịch trình cố định. 'The deadline is next Friday' đúng nhất.",
    "sc": [
      {"id":"sc14-1","sentence":"I will going to visit my friend tomorrow.","error":"will going","correction":"will visit","exp":"Sau 'will' dùng bare infinitive: 'will VISIT'. Không kết hợp 'will' và 'going to' cùng lúc."},
      {"id":"sc14-2","sentence":"She is going to studies English next year.","error":"studies","correction":"study","exp":"Sau 'going to' dùng bare infinitive: 'going to STUDY'. Không thêm '-s/-es'."},
    ],
    "la": [
      {"audio":"I will visit my grandmother this weekend.","vn":"Tôi sẽ thăm bà nội vào cuối tuần này.","words":["I","will","visit","my","grandmother","this","weekend",".","going","visits"],"answer":"I will visit my grandmother this weekend ."},
      {"audio":"She is going to study for the exam tomorrow.","vn":"Cô ấy sẽ ôn thi vào ngày mai.","words":["She","is","going","to","study","for","the","exam","tomorrow",".","will","studies"],"answer":"She is going to study for the exam tomorrow ."},
    ],
  },
  "unit15": {
    "q1": "So sánh hơn: tính từ ngắn + '-er than', dài + 'more...than'. Không dùng cả hai ('more cheaper' sai).",
    "q2": "'More expensive than' vì 'expensive' có 3 âm tiết → dùng 'more'. Không nói 'expensiver'.",
    "q3": "So sánh nhất: tính từ ngắn + '-est', dài + 'the most'. 'The smartest' đúng cho 'smart'.",
    "sc": [
      {"id":"sc15-1","sentence":"This hotel is more cheaper than that one.","error":"more cheaper","correction":"cheaper","exp":"'Cheap' ngắn → chỉ thêm '-er': 'cheaper'. 'More cheaper' là lỗi double comparative."},
      {"id":"sc15-2","sentence":"She is more taller than her sister.","error":"more taller","correction":"taller","exp":"'Tall' ngắn (1 âm tiết) → 'taller'. Không dùng 'more' với tính từ ngắn."},
    ],
    "la": [
      {"audio":"This phone is cheaper than that one.","vn":"Chiếc điện thoại này rẻ hơn chiếc kia.","words":["This","phone","is","cheaper","than","that","one",".","more","cheap"],"answer":"This phone is cheaper than that one ."},
      {"audio":"She is the smartest student in the class.","vn":"Cô ấy là học sinh giỏi nhất trong lớp.","words":["She","is","the","smartest","student","in","the","class",".","most","smart"],"answer":"She is the smartest student in the class ."},
    ],
  },
  "unit16": {
    "q1": "'Opposite' = đối diện. 'Next to' = kế bên. 'Between A and B' = giữa. Chọn theo nghĩa câu.",
    "q2": "'Next to' = kế bên. Luôn có 'to'. 'Beside' cũng đúng nhưng formal hơn.",
    "q3": "'Straight' = thẳng → 'Go straight for three blocks'. Không dùng 'straightly'.",
    "sc": [
      {"id":"sc16-1","sentence":"I travel to work by the bus every day.","error":"by the bus","correction":"by bus","exp":"Phương tiện giao thông: 'by bus/car/train/taxi' — không dùng 'the' sau 'by'."},
      {"id":"sc16-2","sentence":"The plane arrives to the airport at noon.","error":"arrives to","correction":"arrives at","exp":"'Arrive AT' một địa điểm cụ thể. 'Arrive IN' thành phố/quốc gia. Không dùng 'arrive to'."},
    ],
    "la": [
      {"audio":"I travel to work by bus every morning.","vn":"Tôi đi làm bằng xe buýt mỗi sáng.","words":["I","travel","to","work","by","bus","every","morning",".","the","car"],"answer":"I travel to work by bus every morning ."},
      {"audio":"The hotel is next to the train station.","vn":"Khách sạn kế bên ga tàu.","words":["The","hotel","is","next","to","the","train","station",".","near","opposite"],"answer":"The hotel is next to the train station ."},
    ],
  },
  "unit17": {
    "q1": "Present Perfect: have/has + past participle. 'Have went' sai — phải là 'have GONE'.",
    "q2": "'Has led' = present perfect của 'lead' (bất quy tắc). 'Has leaded' không tồn tại.",
    "q3": "'Since + năm/mốc': 'since 2019'. 'For + khoảng thời gian': 'for three years'.",
    "sc": [
      {"id":"sc17-1","sentence":"I have went to London twice.","error":"went","correction":"gone","exp":"Present Perfect dùng past participle: 'go → GONE'. 'Went' là Simple Past, không dùng với 'have'."},
      {"id":"sc17-2","sentence":"She has already leave the office.","error":"leave","correction":"left","exp":"'Leave' → 'left' (bất quy tắc). Sau 'has/have' luôn dùng past participle, không nguyên mẫu."},
    ],
    "la": [
      {"audio":"I have never been to Paris before.","vn":"Tôi chưa bao giờ đến Paris.","words":["I","have","never","been","to","Paris","before",".","went","gone"],"answer":"I have never been to Paris before ."},
      {"audio":"She has already finished her report.","vn":"Cô ấy đã hoàn thành báo cáo rồi.","words":["She","has","already","finished","her","report",".","have","finish"],"answer":"She has already finished her report ."},
    ],
  },
  "unit18": {
    "q1": "Câu dùng đúng nhiều thì: hiện tại hoàn thành kết hợp quá khứ đơn.",
    "q2": "'Met' là quá khứ đơn của 'meet' (bất quy tắc). Phù hợp cho hành động cụ thể trong quá khứ.",
    "q3": "'Is going to study' = kế hoạch sẵn có cho tương lai. Không dùng 'will study' khi đã có kế hoạch.",
    "sc": [
      {"id":"sc18-1","sentence":"I'd like order a coffee, please.","error":"order","correction":"to order","exp":"'I'd like TO + infinitive'. Sau 'would like' cần 'to': 'I'd like TO order'. Khác với 'enjoy + V-ing'."},
      {"id":"sc18-2","sentence":"Can I have some informations about the flight?","error":"informations","correction":"information","exp":"'Information' là danh từ không đếm được — không có dạng số nhiều. Không nói 'informations'."},
    ],
    "la": [
      {"audio":"I would like to order a large coffee please.","vn":"Tôi muốn gọi một cốc cà phê lớn.","words":["I","would","like","to","order","a","large","coffee","please",".","want","ordering"],"answer":"I would like to order a large coffee please ."},
      {"audio":"She is going to take the IELTS exam next month.","vn":"Cô ấy sẽ thi IELTS vào tháng tới.","words":["She","is","going","to","take","the","IELTS","exam","next","month",".","will","takes"],"answer":"She is going to take the IELTS exam next month ."},
    ],
  },
  "unit19": {
    "q1": "Past Continuous: was/were + V-ing. Dùng để diễn tả hành động đang xảy ra ở quá khứ.",
    "q2": "Kể chuyện tự nhiên: dùng thì nhất quán, từ nối (first, then, finally), chi tiết cụ thể.",
    "q3": "Present Perfect ôn tập: 'visited' là past participle của 'visit'. 'I have visited = đã từng đến'.",
    "sc": [
      {"id":"sc19-1","sentence":"First, she go to the market and buy some vegetables.","error":"go","correction":"went","exp":"Kể chuyện quá khứ dùng Simple Past: 'go → went', 'buy → bought'. Thì phải nhất quán."},
      {"id":"sc19-2","sentence":"While I was cook dinner, the phone rang.","error":"cook","correction":"cooking","exp":"Past Continuous: 'was/were + V-ing'. 'Was COOKING' mô tả hành động đang diễn ra khi có sự kiện khác."},
    ],
    "la": [
      {"audio":"She went to the market and bought some fruit.","vn":"Cô ấy đi chợ và mua một ít trái cây.","words":["She","went","to","the","market","and","bought","some","fruit",".","go","buyed"],"answer":"She went to the market and bought some fruit ."},
      {"audio":"While I was reading the phone rang.","vn":"Trong khi tôi đang đọc thì điện thoại reo.","words":["While","I","was","reading","the","phone","rang",".","read","ringing"],"answer":"While I was reading the phone rang ."},
    ],
  },
  "unit20": {
    "q1": "Past Perfect: had + past participle — hành động xảy ra TRƯỚC một hành động quá khứ khác.",
    "q2": "'Had already finished' vì hoàn thành trước khi 'she called'. Had + past participle.",
    "q3": "'Had already left' — quá khứ hoàn thành vì máy bay rời đi trước khi nhóm đến.",
    "sc": [
      {"id":"sc20-1","sentence":"By the time he arrived, she already left.","error":"already left","correction":"had already left","exp":"Past Perfect: hành động xảy ra TRƯỚC → 'had + past participle'. 'Had already left' = đã rời đi rồi."},
      {"id":"sc20-2","sentence":"When I got home, I realized I forgot my keys.","error":"forgot","correction":"had forgotten","exp":"'Realized' (quá khứ đơn) xảy ra sau → 'forgetting' xảy ra trước → cần Past Perfect 'had forgotten'."},
    ],
    "la": [
      {"audio":"By the time she called I had already left.","vn":"Khi cô ấy gọi tôi đã rời đi rồi.","words":["By","the","time","she","called","I","had","already","left",".","left","gone"],"answer":"By the time she called I had already left ."},
      {"audio":"When we arrived the meeting had already started.","vn":"Khi chúng tôi đến cuộc họp đã bắt đầu rồi.","words":["When","we","arrived","the","meeting","had","already","started",".","began","start"],"answer":"When we arrived the meeting had already started ."},
    ],
  },
  "unit21": {
    "q1": "Future Perfect: will have + past participle — hoàn thành trước một mốc tương lai.",
    "q2": "'Will have been working' = Future Perfect Continuous — quá trình kéo dài đến mốc tương lai.",
    "q3": "'Will have achieved' — hoàn thành trước cuối Q3 (mốc tương lai).",
    "sc": [
      {"id":"sc21-1","sentence":"By next year, I will finished my degree.","error":"will finished","correction":"will have finished","exp":"Future Perfect: 'will HAVE + past participle'. Diễn tả việc hoàn thành trước mốc tương lai."},
      {"id":"sc21-2","sentence":"In the future, people will flying cars.","error":"will flying","correction":"will fly","exp":"'Will + bare infinitive': 'will FLY'. Không dùng V-ing trực tiếp sau 'will'."},
    ],
    "la": [
      {"audio":"By next year I will have finished my degree.","vn":"Đến năm sau tôi sẽ hoàn thành bằng cấp.","words":["By","next","year","I","will","have","finished","my","degree",".","finish","had"],"answer":"By next year I will have finished my degree ."},
      {"audio":"In the future people will use electric cars.","vn":"Trong tương lai mọi người sẽ dùng xe điện.","words":["In","the","future","people","will","use","electric","cars",".","using","drives"],"answer":"In the future people will use electric cars ."},
    ],
  },
  "unit22": {
    "q1": "'Don't have to' = không bắt buộc nhưng CÓ THỂ nếu muốn. 'Mustn't' = bị cấm hoàn toàn.",
    "q2": "'Don't have to attend' = tùy chọn, không bắt buộc. Phù hợp với 'optional'.",
    "q3": "'Mustn't' hoặc 'can't' = hành động bị cấm tuyệt đối. 'Don't have to' không đúng nghĩa.",
    "sc": [
      {"id":"sc22-1","sentence":"You must to wear a seatbelt when driving.","error":"must to","correction":"must","exp":"'Must' là động từ khiếm khuyết — KHÔNG dùng 'to' sau 'must'. Đúng: 'must wear' (bare infinitive)."},
      {"id":"sc22-2","sentence":"He don't have to works on weekends.","error":"don't have to works","correction":"doesn't have to work","exp":"'He' → 'doesn't' + bare infinitive: 'doesn't have to WORK'. Không thêm '-s' sau 'to'."},
    ],
    "la": [
      {"audio":"You must wear a helmet when riding a motorbike.","vn":"Bạn phải đội mũ bảo hiểm khi đi xe máy.","words":["You","must","wear","a","helmet","when","riding","a","motorbike",".","have","to"],"answer":"You must wear a helmet when riding a motorbike ."},
      {"audio":"She doesn't have to work on Saturdays.","vn":"Cô ấy không phải làm việc vào thứ Bảy.","words":["She","doesn't","have","to","work","on","Saturdays",".","don't","works"],"answer":"She doesn't have to work on Saturdays ."},
    ],
  },
  "unit23": {
    "q1": "First Conditional: If + Present Simple, will + bare infinitive. Không dùng 'will' trong mệnh đề 'if'.",
    "q2": "'Submits' (Present Simple) trong mệnh đề 'if' — không dùng 'will submit' trong mệnh đề điều kiện.",
    "q3": "Zero Conditional: if + Present Simple, Present Simple — quy luật luôn đúng.",
    "sc": [
      {"id":"sc23-1","sentence":"If it will rain tomorrow, I will stay home.","error":"will rain","correction":"rains","exp":"First Conditional: mệnh đề 'If' dùng Present Simple (không dùng 'will'). 'If it RAINS, I will stay.'"},
      {"id":"sc23-2","sentence":"She will call when she will arrive.","error":"will arrive","correction":"arrives","exp":"Sau 'when' (time clause) dùng Present Simple: 'when she ARRIVES'. Không dùng 'will' trong time clause."},
    ],
    "la": [
      {"audio":"If it rains tomorrow I will stay at home.","vn":"Nếu ngày mai trời mưa tôi sẽ ở nhà.","words":["If","it","rains","tomorrow","I","will","stay","at","home",".","will rain","staying"],"answer":"If it rains tomorrow I will stay at home ."},
      {"audio":"I will call you when I arrive at the airport.","vn":"Tôi sẽ gọi cho bạn khi tôi đến sân bay.","words":["I","will","call","you","when","I","arrive","at","the","airport",".","arrives","will arrive"],"answer":"I will call you when I arrive at the airport ."},
    ],
  },
  "unit24": {
    "q1": "Passive hiện tại: is/are + past participle — mô tả quy trình đang xảy ra.",
    "q2": "'Each unit is inspected carefully' — passive của 'Workers inspect each unit carefully'.",
    "q3": "'Was built' — passive quá khứ: was/were + past participle.",
    "sc": [
      {"id":"sc24-1","sentence":"Coffee is grew in Vietnam and Brazil.","error":"grew","correction":"grown","exp":"Passive dùng past participle: 'grow → GROWN'. 'Grew' là Simple Past, không dùng trong passive."},
      {"id":"sc24-2","sentence":"The book was writed by a famous author.","error":"writed","correction":"written","exp":"'Write → written' (bất quy tắc). Không có 'writed'. Passive: was/were + PAST PARTICIPLE."},
    ],
    "la": [
      {"audio":"Coffee is grown in Vietnam and Brazil.","vn":"Cà phê được trồng ở Việt Nam và Brazil.","words":["Coffee","is","grown","in","Vietnam","and","Brazil",".","grew","grows"],"answer":"Coffee is grown in Vietnam and Brazil ."},
      {"audio":"This bridge was built in two thousand and ten.","vn":"Cây cầu này được xây dựng năm 2010.","words":["This","bridge","was","built","in","two","thousand","and","ten",".","build","builded"],"answer":"This bridge was built in two thousand and ten ."},
    ],
  },
  "unit25": {
    "q1": "Relative clause: 'who' cho người, 'which/that' cho vật, 'where' cho nơi chốn.",
    "q2": "'Who helped me' — 'who' thay thế cho 'she/the colleague'. Không dùng 'which' cho người.",
    "q3": "'Where we hold' — 'where' thay thế 'in the room'. Không thêm giới từ 'in' sau 'where'.",
    "sc": [
      {"id":"sc25-1","sentence":"The man who he works here is my manager.","error":"who he","correction":"who","exp":"'Who' đã thay thế chủ ngữ 'he' — không viết cả hai. 'The man who works here' (không có 'he')."},
      {"id":"sc25-2","sentence":"That is the city where I was born in.","error":"born in","correction":"born","exp":"'Where' đã bao gồm nghĩa giới từ 'in'. Không viết thêm 'in' sau 'where I was born'."},
    ],
    "la": [
      {"audio":"She is the person who helped me with the project.","vn":"Cô ấy là người đã giúp tôi trong dự án.","words":["She","is","the","person","who","helped","me","with","the","project",".","which","whom"],"answer":"She is the person who helped me with the project ."},
      {"audio":"That is the city where I was born.","vn":"Đó là thành phố nơi tôi sinh ra.","words":["That","is","the","city","where","I","was","born",".","which","in"],"answer":"That is the city where I was born ."},
    ],
  },
  "unit26": {
    "q1": "'Prefer A to B' = thích A hơn B. Không dùng 'prefer A than B'.",
    "q2": "Sau 'recommend' dùng V-ing hoặc 'that + S + bare infinitive'. Không dùng 'to + infinitive'.",
    "q3": "Sau 'plan' dùng 'to + infinitive': 'plan TO take'. Sau 'enjoy' dùng V-ing.",
    "sc": [
      {"id":"sc26-1","sentence":"I prefer tea than coffee in the morning.","error":"than","correction":"to","exp":"Cấu trúc: 'prefer A TO B'. Không dùng 'than' sau 'prefer'. Ví dụ: 'prefer tea TO coffee'."},
      {"id":"sc26-2","sentence":"She would rather to stay home than go out.","error":"to stay","correction":"stay","exp":"'Would rather + bare infinitive' (không có 'to'). Đúng: 'would rather STAY home'."},
    ],
    "la": [
      {"audio":"I prefer tea to coffee in the morning.","vn":"Tôi thích trà hơn cà phê vào buổi sáng.","words":["I","prefer","tea","to","coffee","in","the","morning",".","than","over"],"answer":"I prefer tea to coffee in the morning ."},
      {"audio":"She would rather stay home than go out tonight.","vn":"Cô ấy thích ở nhà hơn là ra ngoài tối nay.","words":["She","would","rather","stay","home","than","go","out","tonight",".","to stay","going"],"answer":"She would rather stay home than go out tonight ."},
    ],
  },
  "unit27": {
    "q1": "Phrasal verb + đại từ: đại từ đặt GIỮA, không sau particle. 'Sort it out' không phải 'sort out it'.",
    "q2": "'Figure out' = tìm hiểu nguyên nhân. 'Find out' cũng đúng. 'Figure up/in' sai.",
    "q3": "'Sort it out' — đại từ 'it' phải đứng giữa phrasal verb tách được.",
    "sc": [
      {"id":"sc27-1","sentence":"I had my hair cut yesterday — she done it well.","error":"done","correction":"did","exp":"'Did it well' — Simple Past trong ngữ cảnh bình thường. 'Done' là past participle, cần 'has/have done'."},
      {"id":"sc27-2","sentence":"She get her car repaired every year.","error":"get","correction":"gets","exp":"'She' (ngôi 3 số ít) → 'gets'. Causative: 'She GETS her car repaired'. Hiện tại đơn +s."},
    ],
    "la": [
      {"audio":"I had my hair cut at the salon yesterday.","vn":"Hôm qua tôi đi cắt tóc ở tiệm.","words":["I","had","my","hair","cut","at","the","salon","yesterday",".","have","cutting"],"answer":"I had my hair cut at the salon yesterday ."},
      {"audio":"She gets her car repaired every six months.","vn":"Cô ấy sửa xe định kỳ mỗi sáu tháng.","words":["She","gets","her","car","repaired","every","six","months",".","get","repair"],"answer":"She gets her car repaired every six months ."},
    ],
  },
  "unit28": {
    "q1": "Present Perfect Continuous: have/has + been + V-ing — nhấn mạnh quá trình đang tiếp diễn.",
    "q2": "'Has been leading' — PPC nhấn mạnh quá trình liên tục từ quá khứ đến hiện tại.",
    "q3": "'Have been working' + 'for' + khoảng thời gian. 'Since' + mốc thời gian cụ thể.",
    "sc": [
      {"id":"sc28-1","sentence":"I have been study English for three years.","error":"study","correction":"studying","exp":"Present Perfect Continuous: 'have been + V-ING'. 'Study → studying'. Không dùng nguyên mẫu."},
      {"id":"sc28-2","sentence":"She has lived here since five years.","error":"since five years","correction":"for five years","exp":"'For + khoảng thời gian': 'for five years'. 'Since + mốc': 'since 2019'. 'Since five years' sai."},
    ],
    "la": [
      {"audio":"I have been studying English for three years.","vn":"Tôi đã học tiếng Anh được ba năm.","words":["I","have","been","studying","English","for","three","years",".","study","since"],"answer":"I have been studying English for three years ."},
      {"audio":"She has been working here since two thousand and twenty.","vn":"Cô ấy đã làm việc ở đây từ năm 2020.","words":["She","has","been","working","here","since","two","thousand","and","twenty",".","for","work"],"answer":"She has been working here since two thousand and twenty ."},
    ],
  },
  "unit29": {
    "q1": "Cách đề xuất lịch sự: 'What if we...?', 'How about + V-ing?', 'Why don't we...?'",
    "q2": "'How about upgrading' — sau 'how about' dùng V-ing.",
    "q3": "'Address/resolve/tackle' dùng cho vấn đề cần giải quyết. 'Tackle this issue' = giải quyết.",
    "sc": [
      {"id":"sc29-1","sentence":"I suggest to go to the doctor right away.","error":"to go","correction":"going","exp":"Sau 'suggest' dùng V-ING hoặc 'that + S + base verb'. Không dùng 'to + infinitive' sau 'suggest'."},
      {"id":"sc29-2","sentence":"He recommends that we leaving early tomorrow.","error":"leaving","correction":"leave","exp":"'Recommend that + S + bare infinitive': 'we LEAVE'. Không dùng V-ing sau 'that' trong cấu trúc này."},
    ],
    "la": [
      {"audio":"I suggest going to the doctor right away.","vn":"Tôi đề xuất đi khám bác sĩ ngay bây giờ.","words":["I","suggest","going","to","the","doctor","right","away",".","to go","suggested"],"answer":"I suggest going to the doctor right away ."},
      {"audio":"How about upgrading our internet connection?","vn":"Sao mình không nâng cấp kết nối mạng?","words":["How","about","upgrading","our","internet","connection","?","upgrade","to upgrade"],"answer":"How about upgrading our internet connection ?"},
    ],
  },
  "unit30": {
    "q1": "Subjunctive: 'It is important that + S + bare infinitive'. Không chia động từ theo chủ ngữ.",
    "q2": "'It is crucial for us TO conserve' — infinitive sau 'for sb to do'.",
    "q3": "'Constructive' là trái nghĩa của 'destructive'. Con- = cùng nhau xây dựng.",
    "sc": [
      {"id":"sc30-1","sentence":"Plastic should recycle to protect the environment.","error":"recycle","correction":"be recycled","exp":"Passive modal: 'should BE recycled'. Không thể bỏ 'be' trong thể bị động với modal."},
      {"id":"sc30-2","sentence":"We must to reduce our carbon footprint every day.","error":"must to reduce","correction":"must reduce","exp":"Modal verb 'must' + bare infinitive (không có 'to'). Đúng: 'must REDUCE'."},
    ],
    "la": [
      {"audio":"Plastic should be recycled to protect our oceans.","vn":"Nhựa cần được tái chế để bảo vệ đại dương.","words":["Plastic","should","be","recycled","to","protect","our","oceans",".","recycle","recycling"],"answer":"Plastic should be recycled to protect our oceans ."},
      {"audio":"We must reduce our use of single use plastic.","vn":"Chúng ta phải giảm sử dụng nhựa dùng một lần.","words":["We","must","reduce","our","use","of","single","use","plastic",".","must to","reducing"],"answer":"We must reduce our use of single use plastic ."},
    ],
  },
  "unit31": {
    "q1": "Tiếng Anh doanh nghiệp: câu đầy đủ, động từ đúng thì, tránh viết tắt không chính thức.",
    "q2": "'I advise you TO review' — sau 'advise sb' dùng 'to + infinitive'.",
    "q3": "'Subjunctive recommend': 'recommended that he SUBMIT' (bare infinitive).",
    "sc": [
      {"id":"sc31-1","sentence":"I am writing to you to inquiry about the position.","error":"inquiry","correction":"inquire","exp":"'Inquiry' là danh từ, 'inquire' là động từ. 'I am writing to INQUIRE' (verb) — không dùng danh từ sau 'to'."},
      {"id":"sc31-2","sentence":"Please be advise that the meeting is postponed.","error":"advise","correction":"advised","exp":"Passive: 'Please BE ADVISED' (past participle). 'Advise' là nguyên mẫu, không đúng sau 'be'."},
    ],
    "la": [
      {"audio":"I am writing to inquire about the job opening.","vn":"Tôi viết thư để hỏi về vị trí tuyển dụng.","words":["I","am","writing","to","inquire","about","the","job","opening",".","inquiry","inquiring"],"answer":"I am writing to inquire about the job opening ."},
      {"audio":"Please find the report attached to this email.","vn":"Vui lòng xem báo cáo đính kèm trong email này.","words":["Please","find","the","report","attached","to","this","email",".","attach","finding"],"answer":"Please find the report attached to this email ."},
    ],
  },
  "unit32": {
    "q1": "Future Perfect: will have + past participle — hoàn thành trước một mốc tương lai cụ thể.",
    "q2": "'Had already started' — Past Perfect vì meeting bắt đầu TRƯỚC khi 'he arrived'.",
    "q3": "Subjunctive: 'recommend that she STUDY' (bare infinitive, không chia).",
    "sc": [
      {"id":"sc32-1","sentence":"If I would be you, I would study harder.","error":"would be","correction":"were","exp":"Second Conditional: 'If I WERE you' (subjunctive). Không dùng 'would' trong mệnh đề 'if'."},
      {"id":"sc32-2","sentence":"She has went to Paris many times.","error":"went","correction":"gone","exp":"Present Perfect: 'has GONE' (past participle của 'go'). 'Went' là Simple Past, không dùng với 'has'."},
    ],
    "la": [
      {"audio":"If I were you I would study harder every day.","vn":"Nếu tôi là bạn tôi sẽ học chăm hơn mỗi ngày.","words":["If","I","were","you","I","would","study","harder","every","day",".","would be","am"],"answer":"If I were you I would study harder every day ."},
      {"audio":"She has gone to Paris three times already.","vn":"Cô ấy đã đến Paris ba lần rồi.","words":["She","has","gone","to","Paris","three","times","already",".","went","been"],"answer":"She has gone to Paris three times already ."},
    ],
  },
  "unit33": {
    "q1": "Second Conditional: If + Past Simple, would + bare infinitive — tình huống không có thật ở hiện tại.",
    "q2": "'Had more capital' — Past Simple (không phải Past Perfect) trong mệnh đề 'if' của second conditional.",
    "q3": "'Were the CEO' — Subjunctive 'were' cho mọi ngôi (không phải 'was').",
    "sc": [
      {"id":"sc33-1","sentence":"If I have more time, I would travel the world.","error":"have","correction":"had","exp":"Second Conditional: 'If I HAD more time' (Past Simple trong mệnh đề if). Không dùng hiện tại."},
      {"id":"sc33-2","sentence":"She would went abroad if she had more money.","error":"would went","correction":"would go","exp":"'Would + bare infinitive': 'would GO'. 'Went' là quá khứ đơn, không đi với 'would'."},
    ],
    "la": [
      {"audio":"If I had more money I would travel the world.","vn":"Nếu tôi có nhiều tiền hơn tôi sẽ đi du lịch khắp nơi.","words":["If","I","had","more","money","I","would","travel","the","world",".","have","travelled"],"answer":"If I had more money I would travel the world ."},
      {"audio":"She would move to the city if she could find a job.","vn":"Cô ấy sẽ chuyển lên thành phố nếu tìm được việc.","words":["She","would","move","to","the","city","if","she","could","find","a","job",".","moved","can"],"answer":"She would move to the city if she could find a job ."},
    ],
  },
  "unit34": {
    "q1": "Third Conditional: If + Past Perfect, would have + past participle — hối tiếc về quá khứ.",
    "q2": "'Had told me' — Past Perfect trong mệnh đề 'if'. Hành động đã không xảy ra trong quá khứ.",
    "q3": "'Would have met' — kết quả giả định trong quá khứ.",
    "sc": [
      {"id":"sc34-1","sentence":"If she studied harder she would have passed the exam.","error":"studied","correction":"had studied","exp":"Third Conditional: 'If + Past Perfect (had studied)'. Không dùng Simple Past trong mệnh đề if của 3rd conditional."},
      {"id":"sc34-2","sentence":"I would of gone if I had known about it.","error":"would of gone","correction":"would have gone","exp":"'Would HAVE gone' — không bao giờ viết 'would OF'. 'Of' là lỗi phát âm của 'have'."},
    ],
    "la": [
      {"audio":"If she had studied harder she would have passed.","vn":"Nếu cô ấy học chăm hơn cô ấy đã đỗ rồi.","words":["If","she","had","studied","harder","she","would","have","passed",".","studied","would of"],"answer":"If she had studied harder she would have passed ."},
      {"audio":"I would have helped you if I had known.","vn":"Tôi đã giúp bạn nếu tôi biết.","words":["I","would","have","helped","you","if","I","had","known",".","would of","knew"],"answer":"I would have helped you if I had known ."},
    ],
  },
  "unit35": {
    "q1": "'Provided that / As long as / Unless' = điều kiện. 'Unless' = 'if...not'. Đồng nghĩa với 'only if not'.",
    "q2": "'Unless they agree' = 'if they don't agree'. Không dùng 'unless' với 'not'.",
    "q3": "Mixed conditional: If + Past Perfect (quá khứ giả định) → would + bare infinitive (hiện tại).",
    "sc": [
      {"id":"sc35-1","sentence":"Unless you won't study, you will fail the test.","error":"won't study","correction":"study","exp":"'Unless = if...not' — không thêm 'not/won't' sau 'unless'. 'Unless you STUDY' = 'if you don't study'."},
      {"id":"sc35-2","sentence":"As long as you will try, you can succeed.","error":"will try","correction":"try","exp":"Trong mệnh đề điều kiện (as long as/unless/if), dùng Present Simple: 'as long as you TRY'."},
    ],
    "la": [
      {"audio":"Unless you study you will fail the exam.","vn":"Trừ khi bạn học bạn sẽ trượt kỳ thi.","words":["Unless","you","study","you","will","fail","the","exam",".","won't study","don't"],"answer":"Unless you study you will fail the exam ."},
      {"audio":"As long as you keep trying you can improve.","vn":"Miễn là bạn tiếp tục cố gắng bạn sẽ tiến bộ.","words":["As","long","as","you","keep","trying","you","can","improve",".","will","tries"],"answer":"As long as you keep trying you can improve ."},
    ],
  },
  "unit36": {
    "q1": "Passive nâng cao: 'The company is regarded as...' — bắt đầu bằng chủ ngữ bị động.",
    "q2": "'Is said TO HAVE visited' — passive infinitive sau reporting verb.",
    "q3": "'It is reported THAT' — cấu trúc passive với mệnh đề that.",
    "sc": [
      {"id":"sc36-1","sentence":"The results was analyzed by the research team.","error":"was","correction":"were","exp":"'Results' số nhiều → 'WERE analyzed'. Passive: was (số ít) / were (số nhiều) + past participle."},
      {"id":"sc36-2","sentence":"It is believed by many that climate change is real.","error":"","correction":"","exp":"Câu này đúng ngữ pháp — đây là passive reporting structure chuẩn trong văn học thuật."},
    ],
    "la": [
      {"audio":"The results were analyzed by the research team.","vn":"Kết quả được phân tích bởi nhóm nghiên cứu.","words":["The","results","were","analyzed","by","the","research","team",".","was","analyse"],"answer":"The results were analyzed by the research team ."},
      {"audio":"It is believed that renewable energy is the future.","vn":"Người ta tin rằng năng lượng tái tạo là tương lai.","words":["It","is","believed","that","renewable","energy","is","the","future",".","was","believes"],"answer":"It is believed that renewable energy is the future ."},
    ],
  },
  "unit37": {
    "q1": "Participial clause: V-ing chia cùng chủ ngữ với mệnh đề chính. Chủ ngữ phải giống nhau.",
    "q2": "'Checking the database, we found...' — 'we' vừa check vừa find — đúng cùng chủ ngữ.",
    "q3": "Perfect participle: 'Having submitted' — hành động xảy ra TRƯỚC hành động chính.",
    "sc": [
      {"id":"sc37-1","sentence":"The reason is because I was late for the meeting.","error":"is because","correction":"is that","exp":"'The reason is THAT...' (chuẩn văn viết). 'The reason is because' là lỗi redundancy phổ biến."},
      {"id":"sc37-2","sentence":"Despite of the rain she walked to work.","error":"Despite of","correction":"Despite","exp":"'Despite + noun/V-ing' (không có 'of'). 'In spite OF' mới có 'of'. Lỗi phổ biến trong IELTS."},
    ],
    "la": [
      {"audio":"Despite the rain she walked to work this morning.","vn":"Dù trời mưa cô ấy vẫn đi bộ đến công ty.","words":["Despite","the","rain","she","walked","to","work","this","morning",".","Despite of","In spite"],"answer":"Despite the rain she walked to work this morning ."},
      {"audio":"Although he was tired he continued working.","vn":"Dù mệt anh ấy vẫn tiếp tục làm việc.","words":["Although","he","was","tired","he","continued","working",".","Despite","Even"],"answer":"Although he was tired he continued working ."},
    ],
  },
  "unit38": {
    "q1": "Inversion: 'Seldom do we see...' — sau trạng từ phủ định đảo trợ động từ lên đầu.",
    "q2": "'Rarely does a company...' — đảo ngữ với 'rarely': does + S + V.",
    "q3": "Cleft sentence: 'It was + NP + that/who + clause'. Nhấn mạnh chủ ngữ.",
    "sc": [
      {"id":"sc38-1","sentence":"It was him who done it first.","error":"done","correction":"did","exp":"Sau 'who' trong relative clause dùng động từ đúng ngôi: 'who DID it'. 'Done' cần 'had/has'."},
      {"id":"sc38-2","sentence":"What I need it is more practice every day.","error":"need it","correction":"need","exp":"Cleft sentence: 'What I need IS...' — 'what' đã là chủ ngữ, không thêm 'it'. 'What I need IT is' thừa 'it'."},
    ],
    "la": [
      {"audio":"It was the teacher who inspired me the most.","vn":"Chính người thầy đó đã truyền cảm hứng cho tôi nhất.","words":["It","was","the","teacher","who","inspired","me","the","most",".","whom","which"],"answer":"It was the teacher who inspired me the most ."},
      {"audio":"Rarely does a company succeed without teamwork.","vn":"Hiếm khi một công ty thành công mà thiếu tinh thần đồng đội.","words":["Rarely","does","a","company","succeed","without","teamwork",".","do","Rarely a"],"answer":"Rarely does a company succeed without teamwork ."},
    ],
  },
  "unit39": {
    "q1": "Modal deduction: 'should have + PP' = lời khuyên cho quá khứ. 'Must have' = chắc chắn đã.",
    "q2": "'Can't have left' — loại trừ khả năng: chắc chắn không thể đã rời đi (vì computer còn bật).",
    "q3": "'Should have double-checked' — hành động nên làm nhưng đã không làm.",
    "sc": [
      {"id":"sc39-1","sentence":"She must be tiredly after the long conference.","error":"tiredly","correction":"tired","exp":"Sau 'be' (linking verb) dùng tính từ: 'must be TIRED'. 'Tiredly' là trạng từ, không đứng sau 'be'."},
      {"id":"sc39-2","sentence":"He could been at the office this morning.","error":"could been","correction":"could have been","exp":"Modal deduction về quá khứ: 'could HAVE BEEN'. Không bỏ 'have' giữa modal và past participle."},
    ],
    "la": [
      {"audio":"She must be very tired after the long trip.","vn":"Cô ấy chắc rất mệt sau chuyến đi dài.","words":["She","must","be","very","tired","after","the","long","trip",".","tiredly","is"],"answer":"She must be very tired after the long trip ."},
      {"audio":"He might have been at the office this morning.","vn":"Anh ấy có thể đã ở văn phòng sáng nay.","words":["He","might","have","been","at","the","office","this","morning",".","could been","maybe"],"answer":"He might have been at the office this morning ."},
    ],
  },
  "unit40": {
    "q1": "'Thereby + V-ing' — hệ quả logic. 'Thereby reducing costs' = do đó giảm chi phí.",
    "q2": "'Therefore/consequently/as a result' — kết quả. 'However' = tương phản. Chọn theo nghĩa.",
    "q3": "'While others' — tương phản song song. 'Whereas' cũng đúng.",
    "sc": [
      {"id":"sc40-1","sentence":"However, he went. But he didn't stay long.","error":"However, he went. But","correction":"However, he went, but","exp":"'However' và 'but' đều là từ tương phản — dùng một trong hai, không cả hai trong cùng ý."},
      {"id":"sc40-2","sentence":"In addition of that, we need more resources.","error":"In addition of","correction":"In addition to","exp":"'In addition TO + noun'. 'In addition of' không tồn tại trong tiếng Anh chuẩn."},
    ],
    "la": [
      {"audio":"Moreover the study shows very positive results.","vn":"Hơn nữa nghiên cứu cho thấy kết quả rất tích cực.","words":["Moreover","the","study","shows","very","positive","results",".","Furthermore","However"],"answer":"Moreover the study shows very positive results ."},
      {"audio":"However we need more evidence to confirm this finding.","vn":"Tuy nhiên chúng ta cần thêm bằng chứng để xác nhận điều này.","words":["However","we","need","more","evidence","to","confirm","this","finding",".","Therefore","Despite"],"answer":"However we need more evidence to confirm this finding ."},
    ],
  },
  "unit41": {
    "q1": "Đảo ngữ nâng cao: 'Not only did...but also'. Sau 'not only' phải đảo trợ động từ.",
    "q2": "'Halt deforestation' — 'deforestation' là danh từ phù hợp sau 'halt'. 'Logging' cũng đúng.",
    "q3": "'Not only DOES the software enhance...' — đảo ngữ với hiện tại đơn ngôi 3.",
    "sc": [
      {"id":"sc41-1","sentence":"Regarding to the graph, sales increased by 20%.","error":"Regarding to","correction":"Regarding","exp":"'Regarding + noun' (không có 'to'). 'With regard TO' mới có 'to'. Lỗi phổ biến trong IELTS Task 1."},
      {"id":"sc41-2","sentence":"The data show that temperatures have risen sharply.","error":"show","correction":"shows","exp":"Trong văn học thuật tiếng Anh, 'data' thường đi với động từ số ít: 'the data SHOWS'. (Hoặc chấp nhận 'show' trong British)."},
    ],
    "la": [
      {"audio":"The graph shows a significant increase in sales.","vn":"Biểu đồ cho thấy mức tăng đáng kể trong doanh số.","words":["The","graph","shows","a","significant","increase","in","sales",".","show","indicating"],"answer":"The graph shows a significant increase in sales ."},
      {"audio":"In conclusion further research is needed in this area.","vn":"Tóm lại cần có thêm nghiên cứu trong lĩnh vực này.","words":["In","conclusion","further","research","is","needed","in","this","area",".","To conclude","needs"],"answer":"In conclusion further research is needed in this area ."},
    ],
  },
  "unit42": {
    "q1": "Mixed conditional: If + Past Perfect (quá khứ giả định) → would + bare infinitive (hiện tại).",
    "q2": "'Rarely HAVE our developers encountered' — đảo ngữ quá khứ hoàn thành.",
    "q3": "'Therefore/consequently' = kết quả logic. Phù hợp nhất ở đây.",
    "sc": [
      {"id":"sc42-1","sentence":"Had I known, I would of helped you immediately.","error":"would of helped","correction":"would have helped","exp":"'Would HAVE helped' — 'of' là lỗi phát âm của 'have'. Luôn viết 'would have', không 'would of'."},
      {"id":"sc42-2","sentence":"The man whom I spoke with him was very helpful.","error":"with him","correction":"with","exp":"'Whom I spoke with' — 'whom' đã thay thế 'him'. Không cần lặp lại 'him'. 'Spoke with whom' = 'spoke with him'."},
    ],
    "la": [
      {"audio":"Had I known I would have helped you right away.","vn":"Nếu tôi biết tôi đã giúp bạn ngay.","words":["Had","I","known","I","would","have","helped","you","right","away",".","would of","knew"],"answer":"Had I known I would have helped you right away ."},
      {"audio":"The results were far better than we expected.","vn":"Kết quả tốt hơn nhiều so với chúng tôi mong đợi.","words":["The","results","were","far","better","than","we","expected",".","was","good"],"answer":"The results were far better than we expected ."},
    ],
  },
  "unitA01": {
    "q1": "'My name IS Linh' — 'name' số ít → 'is'. 'My names are' sai.",
    "q2": "'I AM eight years old' — dùng 'am' cho 'I'. Không nói 'I have 8 years'.",
    "q3": "'My name IS Linh' — 'is' cho danh từ số ít.",
    "sc": [
      {"id":"sc-A01-1","sentence":"My name are Lan.","error":"are","correction":"is","exp":"'Name' là danh từ số ít → 'My name IS Lan'. 'Are' dùng cho số nhiều hoặc you/we/they."},
      {"id":"sc-A01-2","sentence":"I have eight years old.","error":"have","correction":"am","exp":"Nói tuổi bằng 'to be': 'I AM eight years old'. Không dùng 'have' cho tuổi trong tiếng Anh."},
    ],
    "la": [
      {"audio":"My name is Lan and I am from Hanoi.","vn":"Tên tôi là Lan và tôi đến từ Hà Nội.","words":["My","name","is","Lan","and","I","am","from","Hanoi",".","are","be"],"answer":"My name is Lan and I am from Hanoi ."},
      {"audio":"Nice to meet you my name is Nam.","vn":"Rất vui được gặp bạn tên tôi là Nam.","words":["Nice","to","meet","you","my","name","is","Nam",".","are","Nice meeting"],"answer":"Nice to meet you my name is Nam ."},
    ],
  },
  "unitA02": {
    "q1": "Hỏi giá tiền dùng 'How much': 'How much IS this?' cho vật cụ thể số ít.",
    "q2": "'How much IS this bag?' — số ít dùng 'is'. 'How much ARE these bags?' — số nhiều.",
    "q3": "'Price/cost' là danh từ dùng để nói về giá. 'The price IS...'",
    "sc": [
      {"id":"sc-A02-1","sentence":"How many is this pen?","error":"many","correction":"much","exp":"'How MUCH' hỏi giá tiền (không đếm theo số lượng rời). 'How many' hỏi số lượng: 'How many pens?'"},
      {"id":"sc-A02-2","sentence":"It cost five dollar.","error":"five dollar","correction":"five dollars","exp":"Sau số lớn hơn 1, danh từ phải ở dạng số nhiều: 'five DOLLARS'. Không dùng 'dollar' sau số đếm."},
    ],
    "la": [
      {"audio":"How much is this pen?","vn":"Cái bút này giá bao nhiêu?","words":["How","much","is","this","pen","?","many","costs"],"answer":"How much is this pen ?"},
      {"audio":"It costs twenty thousand dong.","vn":"Nó giá hai mươi nghìn đồng.","words":["It","costs","twenty","thousand","dong",".","cost","is"],"answer":"It costs twenty thousand dong ."},
    ],
  },
  "unitA03": {
    "q1": "'The apple IS red' — 'apple' số ít → 'is'. 'Are' cho số nhiều.",
    "q2": "'The sky IS blue' — liên kết tính từ với 'be'. Không dùng 'has'.",
    "q3": "'Looking for' = đang tìm. 'I'm LOOKING FOR a red bag'.",
    "sc": [
      {"id":"sc-A03-1","sentence":"The apples is red and sweet.","error":"is","correction":"are","exp":"'Apples' số nhiều → 'The apples ARE red'. 'Is' chỉ dùng cho số ít."},
      {"id":"sc-A03-2","sentence":"She wearing a blue dress today.","error":"wearing","correction":"is wearing","exp":"Present Continuous cần 'to be': 'She IS WEARING'. Không bỏ 'is' — lỗi phổ biến khi dịch thẳng từ tiếng Việt."},
    ],
    "la": [
      {"audio":"The bag is red and the dress is blue.","vn":"Túi màu đỏ và váy màu xanh.","words":["The","bag","is","red","and","the","dress","is","blue",".","are","was"],"answer":"The bag is red and the dress is blue ."},
      {"audio":"She is wearing a white shirt today.","vn":"Hôm nay cô ấy mặc áo trắng.","words":["She","is","wearing","a","white","shirt","today",".","wearing","wears"],"answer":"She is wearing a white shirt today ."},
    ],
  },
  "unitA04": {
    "q1": "'Fine thanks, and you?' — câu trả lời phù hợp nhất và lịch sự trong môi trường công sở.",
    "q2": "'Fine, thanks.' / 'Not bad.' — câu trả lời thông dụng cho 'How are you?'",
    "q3": "'Busy' = bận rộn. 'I'm a little BUSY today' — phù hợp với 'Too much work!'",
    "sc": [
      {"id":"sc-A04-1","sentence":"Thank you. You welcome.","error":"You welcome","correction":"You're welcome","exp":"Đáp lại lời cảm ơn: 'You're welcome' (viết tắt của 'You are welcome'). Không nói 'You welcome'."},
      {"id":"sc-A04-2","sentence":"Good morning! How you?","error":"How you","correction":"How are you","exp":"Câu hỏi thăm cần 'to be': 'How ARE you?' — không bỏ 'are'. Lỗi phổ biến khi dịch từ tiếng Việt."},
    ],
    "la": [
      {"audio":"Good morning how are you today?","vn":"Chào buổi sáng bạn có khỏe không?","words":["Good","morning","how","are","you","today","?","How you","Good day"],"answer":"Good morning how are you today ?"},
      {"audio":"I am fine thank you very much.","vn":"Tôi khỏe cảm ơn bạn rất nhiều.","words":["I","am","fine","thank","you","very","much",".","I fine","Thanks"],"answer":"I am fine thank you very much ."},
    ],
  },
  "unitA05": {
    "q1": "'My name is Nam' — dùng 'is' cho số ít. 'I am Nam' cũng đúng.",
    "q2": "'They ARE married' — 'they' dùng 'are'. Không dùng 'is' hay 'am'.",
    "q3": "'They ARE married' — xác nhận dùng 'are' cho they.",
    "sc": [
      {"id":"sc-A05-1","sentence":"What is your name's?","error":"name's","correction":"name","exp":"'What is your NAME?' — không thêm sở hữu cách 's' vào đây. 'Name's' là lỗi phổ biến."},
      {"id":"sc-A05-2","sentence":"I am come from Vietnam.","error":"am come","correction":"come","exp":"'I COME from Vietnam' (Simple Present). 'Am come' sai — 'come' không phải present continuous ở đây."},
    ],
    "la": [
      {"audio":"My name is Linh and I am twenty years old.","vn":"Tên tôi là Linh và tôi hai mươi tuổi.","words":["My","name","is","Linh","and","I","am","twenty","years","old",".","are","have"],"answer":"My name is Linh and I am twenty years old ."},
      {"audio":"I come from Vietnam and I live in Hanoi.","vn":"Tôi đến từ Việt Nam và tôi sống ở Hà Nội.","words":["I","come","from","Vietnam","and","I","live","in","Hanoi",".","am come","lives"],"answer":"I come from Vietnam and I live in Hanoi ."},
    ],
  },
  "unitA06": {
    "q1": "'She is my mother' — 'she' là đại từ nữ cho người phụ nữ.",
    "q2": "'She IS a doctor' — đại từ nữ 'she' cho mẹ. Không dùng 'he' hay 'they'.",
    "q3": "'Husband' = chồng. 'My HUSBAND has two children'.",
    "sc": [
      {"id":"sc-A06-1","sentence":"He has three child.","error":"child","correction":"children","exp":"'Child' số nhiều bất quy tắc: 'CHILDREN'. Không dùng 'childs'. Tương tự: man→men, woman→women."},
      {"id":"sc-A06-2","sentence":"She is my sister's.","error":"sister's","correction":"sister","exp":"'She is my sister' — không thêm \"'s\" vào đây. \"'s\" chỉ dùng cho sở hữu cách: 'my sister's bag'."},
    ],
    "la": [
      {"audio":"She is my mother and he is my father.","vn":"Đây là mẹ tôi và đây là bố tôi.","words":["She","is","my","mother","and","he","is","my","father",".","He is my mother","They are"],"answer":"She is my mother and he is my father ."},
      {"audio":"My family has four people.","vn":"Gia đình tôi có bốn người.","words":["My","family","has","four","people",".","have","person"],"answer":"My family has four people ."},
    ],
  },
  "unitA07": {
    "q1": "'On Monday AT nine o'clock' — ON + ngày, AT + giờ.",
    "q2": "'AT nine o'clock' — giờ cụ thể dùng 'at'.",
    "q3": "'ON Monday' — ngày trong tuần dùng 'on'.",
    "sc": [
      {"id":"sc-A07-1","sentence":"The meeting is in Monday in nine o'clock.","error":"in Monday in nine","correction":"on Monday at nine","exp":"Giới từ thời gian: ON + ngày, AT + giờ. 'IN' dùng cho tháng/năm/mùa. 'ON Monday AT nine'."},
      {"id":"sc-A07-2","sentence":"Today is Monday, march five.","error":"march five","correction":"March fifth","exp":"Tên tháng viết hoa: 'MARCH'. Ngày dùng ordinal number: 'fifth' (không phải 'five')."},
    ],
    "la": [
      {"audio":"The meeting is on Monday at nine o clock.","vn":"Cuộc họp vào thứ Hai lúc chín giờ.","words":["The","meeting","is","on","Monday","at","nine","o","clock",".","in","at Monday"],"answer":"The meeting is on Monday at nine o clock ."},
      {"audio":"Today is Tuesday the third of June.","vn":"Hôm nay là thứ Ba ngày ba tháng Sáu.","words":["Today","is","Tuesday","the","third","of","June",".","third June","on Tuesday"],"answer":"Today is Tuesday the third of June ."},
    ],
  },
  "unitA08": {
    "q1": "Câu mệnh lệnh: bare infinitive ở đầu. 'Call an ambulance!' — mệnh lệnh trực tiếp.",
    "q2": "'Stop!' / 'Call!' — mệnh lệnh không có chủ ngữ, bắt đầu bằng động từ.",
    "q3": "'Sick' = ốm. 'I'm SICK. I need a doctor.'",
    "sc": [
      {"id":"sc-A08-1","sentence":"Call a ambulance right now!","error":"a ambulance","correction":"an ambulance","exp":"Trước nguyên âm (a, e, i, o, u) dùng 'AN': 'AN ambulance'. 'A' dùng trước phụ âm."},
      {"id":"sc-A08-2","sentence":"I need a help please.","error":"a help","correction":"help","exp":"'Help' là danh từ không đếm được — không dùng 'a' trước 'help'. Đúng: 'I need HELP'."},
    ],
    "la": [
      {"audio":"Please call an ambulance right away.","vn":"Vui lòng gọi xe cấp cứu ngay.","words":["Please","call","an","ambulance","right","away",".","a ambulance","calling"],"answer":"Please call an ambulance right away ."},
      {"audio":"I need help this is an emergency.","vn":"Tôi cần giúp đỡ đây là tình huống khẩn cấp.","words":["I","need","help","this","is","an","emergency",".","a help","needs"],"answer":"I need help this is an emergency ."},
    ],
  },
}

# ─── Injection logic ─────────────────────────────────────────────────────────

def make_sc_block(unit_key, data):
    items = data["sc"]
    lines = ["  sentenceCorrectionExercises: ["]
    for sc in items:
        # Skip if "correction" is empty (means the original sentence is correct - edge case unit36 q2)
        if not sc.get("correction"):
            continue
        lines.append(f'    {{')
        lines.append(f'      id: "{sc["id"]}",')
        lines.append(f'      sentence: "{sc["sentence"]}",')
        lines.append(f'      errorWord: "{sc["error"]}",')
        lines.append(f'      correction: "{sc["correction"]}",')
        lines.append(f'      explanation_vn: "{sc["exp"]}",')
        lines.append(f'    }},')
    lines.append("  ],")
    lines.append("")
    return "\n".join(lines) + "\n"

def make_la_block(unit_key, data, unit_num):
    items = data["la"]
    lines = ["  listenAndArrangeExercises: ["]
    for i, la in enumerate(items, 1):
        la_id = f"la{unit_num}-{i}"
        words_str = json_words(la["words"])
        lines.append(f'    {{')
        lines.append(f'      id: "{la_id}",')
        lines.append(f'      audio_text: "{la["audio"]}",')
        lines.append(f'      prompt_vn: "{la["vn"]}",')
        lines.append(f'      words: {words_str},')
        lines.append(f'      answer: "{la["answer"]}",')
        lines.append(f'    }},')
    lines.append("  ],")
    lines.append("")
    return "\n".join(lines) + "\n"

def json_words(words):
    return "[" + ", ".join(f'"{w}"' for w in words) + "]"

def add_explanation(txt, q_id, explanation):
    """Add explanation_vn after the answer field for a specific question id."""
    # Pattern: find the question object and add explanation_vn before closing }
    # Match: { id: "qN", ... type: "multiple-choice" }
    pattern = rf'(\{{[^}}]*id: "{re.escape(q_id)}"[^}}]*type: "multiple-choice"\s*\}})'
    def replacer(m):
        obj = m.group(1)
        # Add explanation before closing }
        exp_clean = explanation.replace('"', '\\"')
        obj = obj.rstrip().rstrip('}')
        obj += f',\n      explanation_vn: "{exp_clean}" }}'
        return obj
    return re.sub(pattern, replacer, txt, count=1, flags=re.DOTALL)

def inject_exercises(unit_key):
    data = SEED.get(unit_key)
    if not data:
        print(f"  SKIP {unit_key} (no data)")
        return False

    # Find the file
    path = os.path.join(BASE, f"{unit_key}.ts")
    if not os.path.exists(path):
        print(f"  MISSING {path}")
        return False

    txt = open(path, encoding='utf-8').read()

    # Check if already seeded
    if 'sentenceCorrectionExercises:' in txt:
        print(f"  ALREADY seeded {unit_key}")
        return False

    # Add explanation_vn to q1, q2, q3
    for qn in ['q1','q2','q3']:
        exp_key = qn
        if exp_key in data:
            txt = add_explanation(txt, qn, data[exp_key])

    # Find insertion point: before wordBankExercises or scrambleExercises
    insert_before = None
    for marker in ['  wordBankExercises:', '  scrambleExercises:']:
        if marker in txt:
            insert_before = marker
            break

    if not insert_before:
        print(f"  WARNING: no insertion point for {unit_key}")
        return False

    # Build unit number for IDs
    if unit_key.startswith('unitA'):
        unit_num = unit_key[4:]  # A01, A02, etc.
    else:
        unit_num = unit_key[4:]  # 11, 12, etc.

    sc_block = make_sc_block(unit_key, data)
    la_block = make_la_block(unit_key, data, unit_num)

    insertion = sc_block + "\n" + la_block + "\n"
    txt = txt.replace(insert_before, insertion + insert_before, 1)

    open(path, 'w', encoding='utf-8').write(txt)
    print(f"  OK {unit_key}")
    return True

# ─── Run ─────────────────────────────────────────────────────────────────────
units_to_seed = (
    [f"unit{n}" for n in range(11, 43)] +
    [f"unitA0{n}" for n in range(1, 9)]
)

done = 0
for u in units_to_seed:
    result = inject_exercises(u)
    if result:
        done += 1

print(f"\nDone: {done}/{len(units_to_seed)} units seeded.")
