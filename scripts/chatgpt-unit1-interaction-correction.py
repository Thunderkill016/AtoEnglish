from pathlib import Path

path = Path("src/components/learn/sections/SpeakingSection.tsx")
source = path.read_text()

old_alex = '''                  <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-muted/60 border border-border/60 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-teal-400 mb-1">Alex</p>
                    <p className="text-sm text-foreground">{turn.alex}</p>
                  </div>
'''
new_alex = '''                  <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-muted/60 border border-border/60 px-4 py-3">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-teal-400">Alex</p>
                      <button
                        type="button"
                        onClick={() => playTTS(turn.alex)}
                        aria-label={`Nghe Alex: ${turn.alex}`}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-foreground"
                      >
                        <Volume2 size={12} /> Nghe Alex
                      </button>
                    </div>
                    <p className="text-sm text-foreground">{turn.alex}</p>
                  </div>
'''
if old_alex not in source:
    raise RuntimeError("Missing Alex bubble marker")
source = source.replace(old_alex, new_alex, 1)

old_continue = '''          {level2Transcript && (
            <button
              onClick={() => setLevel2Done(true)}
'''
new_continue = '''          {unit.unitId !== "unit-1" && level2Transcript && (
            <button
              onClick={() => setLevel2Done(true)}
'''
if old_continue not in source:
    raise RuntimeError("Missing legacy continue marker")
source = source.replace(old_continue, new_continue, 1)

path.write_text(source)
