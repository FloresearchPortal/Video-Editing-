"""Caption chunks for motion/projects/what-is-psx from the Whisper word times, spelled as in the
script (Roman Urdu). Writes captions.js (window.CAPTIONS = [[start, end, html], ...])."""
import json, re
from pathlib import Path

HERE = Path(__file__).parent
segs = json.load(open(HERE / "edit/vo.words.json"))
# per-segment corrected text: same order as the spoken words, one token per Whisper word
# ("" merges a word into the previous token, "a b" splits one word into two tokens)
FIX = {
    0: "Aap|ne aajkal har taraf PSX ka naam tou suna hi hoga. Market upar, market neeche!",
    1: "Lekin akhir ye sab hai kia? Main samjhata hoon!",
    2: "Sochiye, _ aapki gali mein Ahmed ka ek chai ka dhaaba hai.",
    3: "Aur chai itni zabardast hai ke rozana line lag jati hai.",
    4: "Ab Ahmed chahta hai ke wo shehar mein 5 dhaabe aur kholay — lekin uske|paas paisay bilkul bhi nahi hain.",
    5: "Toh Ahmed decide karta hai apna dhaaba ko public mein thora thora bech de.",
    6: "Woh PSX par apni company list karta hai aur 1,000 shares nikalta hai jahan har share ki qeemat hoti hai 100 rupay.",
    7: "Is tarah Ahmed ko market se mil jaate hain 1 lakh rupay bina kisi bank ke.",
    8: "Aur hum jaise logon ko milte hain Ahmed ke dhaabe mein hissay — yani ke shares.",
    9: "Aap sochte ho, 'Yaar Ahmed ki chai toh kamaal hai!'",
    10: "Toh aap 5 shares khareed lete ho 500 rupay mein.",
    11: "6 mahine baad Ahmed ke 5 dhaabe chal rahe hote hain aur us share ki qeemat ho jati hai 200 rupay.",
    12: "Aur aapka 500 ghar baithe baithe ban jata hai 1,000 rupay!",
    13: "Lekin sawal ye hai ke share ki qeemat kyun badhi?",
    14: "Kyunke jab logon ko pata chala ke Ahmed ka business achi taraf ja|raha hai, sab uske shares khareedne lage.",
    15: "Yani ke demand badh gayi.",
    16: "Lekin shares toh sirf market mein 1,000 thay, toh supply limited thi.",
    17: "Jab market mein demand zyada aur supply kam ho toh qeemat apne aap upar aajati hai.",
    18: "Ab agar logon ko lage ke Ahmed ka dhaaba doob raha hai, sab bechne lagenge.",
    19: "Supply zyada ho jayegi, demand kam ho jayegi, jis|ki wajah se qeemat bhi girna shuru ho jayegi.",
    20: "Is market ke upar aur neeche jaane ko kehte hain Market Volatility.",
    21: "Ye sirf numbers nahi hain.",
    22: "Ye laakhon logon ki soch — unka darr, unki umeed aur unka bharosa hai.",
    23: "PSX asal mein ek regulated marketplace hai jahan Pakistan ki companies ke shares trade hote hain.",
    24: "Aur agar aap isi tarah PSX ko aasaan zubaan mein samajhna|chahte hain, toh FloStocks _ ko follow karein.",
    25: "Kyunke hum stock market ko mushkil nahi, simple bana ke samjhate hain.",
}
KEY = re.compile(r"^(psx|shares?|1,000|100|lakh|500|200|demand|supply|qeemat|volatility|regulated|marketplace|"
                 r"flostocks|simple|darr|umeed|bharosa|bank|dhaaba|dhaabe|hissay|upar|neeche|follow)$", re.I)

chunks = []
for i, seg in enumerate(segs):
    words = [w for w in seg["words"] if w["w"].strip() not in ("—", "-")]
    toks = [t for t in re.sub(r"\s+—\s+", " — ", FIX[i]).split(" ") if t != "—"]
    toks = [t.replace("|", " ") for t in toks]
    if len(toks) != len(words):
        raise SystemExit(f"segment {i}: {len(toks)} tokens vs {len(words)} words\n{toks}\n{[w['w'] for w in words]}")
    cur = []
    for k, (tok, w) in enumerate(zip(toks, words)):
        if tok == "_":
            continue
        cur.append((tok, w["s"], w["e"]))
        brk = re.search(r"[,.!?]$|—$", tok) or len(cur) >= 4 or k == len(toks) - 1
        if brk:
            chunks.append(cur); cur = []
out = []
for j, c in enumerate(chunks):
    start = c[0][1] - 0.08
    nxt = chunks[j + 1][0][1] - 0.08 if j + 1 < len(chunks) else c[-1][2] + 0.5
    end = min(nxt, c[-1][2] + 0.6)
    html = " ".join(f'<b>{t}</b>' if KEY.match(re.sub(r"[^\w,]", "", t)) else t for t, _, _ in c)
    out.append([round(start, 2), round(end, 2), html])
dst = Path("/home/user/Video-Editing-/motion/projects/what-is-psx/captions.js")
dst.write_text("window.CAPTIONS = " + json.dumps(out, ensure_ascii=False, indent=0) + ";\n")
print(len(out), "chunks; last ends", out[-1][1])
for o in out[:6]: print(o)
