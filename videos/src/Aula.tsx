import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CARD,
  CARDINAL,
  CODEBG,
  FPS,
  INK,
  LINE,
  MONO,
  MUT,
  PAPER,
  Crest,
  Kicker,
  Rise,
  Rule,
  SANS,
  SERIF,
  typed,
} from "./lib";
import { DUR } from "./durations";

type Scene = {
  tipo: "capa" | "conceito" | "topico" | "code" | "fim";
  fala: string;
  kicker?: string;
  titulo?: string;
  frase?: string;
  bullets?: string[];
  code?: string;
  proximo?: string;
};

export type Roteiro = {
  id: string;
  slug: string;
  modulo: number;
  titulo: string;
  periodo: string;
  carga: string;
  scenes: Scene[];
};

const PAD = 8; // respiro após a fala
const TAIL = 20; // segura o encerramento

export const sceneFrames = (slug: string, i: number) => {
  const d = DUR[`${slug}-${i}`];
  return (d ? Math.ceil(d * FPS) : FPS * 4) + PAD;
};

export const totalFrames = (v: Roteiro) =>
  v.scenes.reduce((a, _, i) => a + sceneFrames(v.slug, i), 0) + TAIL;

// ---------- chrome comum ----------

const Header: React.FC<{ v: Roteiro }> = ({ v }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      borderTop: `10px solid ${CARDINAL}`,
      display: "flex",
      alignItems: "center",
      gap: 24,
      padding: "26px 70px",
    }}
  >
    <Crest size={54} />
    <div style={{ fontFamily: SANS, fontSize: 26, fontWeight: 700, letterSpacing: 6, color: INK }}>
      ACADEMIA DE ENGENHARIA DE IA
    </div>
    <div style={{ flex: 1 }} />
    <div style={{ fontFamily: SANS, fontSize: 24, letterSpacing: 4, color: MUT }}>
      MÓDULO {v.modulo} · {v.periodo.toUpperCase()}
    </div>
  </div>
);

const Footer: React.FC<{ v: Roteiro; sceneStart: number; idx: number }> = ({
  v,
  sceneStart,
  idx,
}) => {
  const frame = useCurrentFrame();
  const total = totalFrames(v);
  const p = Math.min(1, (sceneStart + frame) / total);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 70px 18px",
          fontFamily: SANS,
          fontSize: 22,
          color: MUT,
          letterSpacing: 3,
        }}
      >
        <div>{v.titulo.toUpperCase()}</div>
        <div>
          § {idx + 1} / {v.scenes.length}
        </div>
      </div>
      <div style={{ height: 8, background: LINE }}>
        <div style={{ height: 8, width: `${p * 100}%`, background: CARDINAL }} />
      </div>
    </div>
  );
};

const Shell: React.FC<{
  v: Roteiro;
  sceneStart: number;
  idx: number;
  children: React.ReactNode;
}> = ({ v, sceneStart, idx, children }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: PAPER, opacity: fade }}>
      <div style={{ position: "absolute", right: -180, bottom: -180, opacity: 0.06 }}>
        <Crest size={700} faint />
      </div>
      <Header v={v} />
      {children}
      <Footer v={v} sceneStart={sceneStart} idx={idx} />
    </AbsoluteFill>
  );
};

// ---------- cenas ----------

const Capa: React.FC<{ v: Roteiro }> = ({ v }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 2, fps, config: { damping: 16, stiffness: 120 }, durationInFrames: 22 });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "0 180px",
      }}
    >
      <div style={{ transform: `scale(${0.6 + 0.4 * p})`, opacity: p, marginBottom: 44 }}>
        <Crest size={170} />
      </div>
      <Rise delay={10}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 12,
            color: CARDINAL,
            marginBottom: 30,
          }}
        >
          MÓDULO {v.modulo}
        </div>
      </Rise>
      <Rise delay={16}>
        <div style={{ fontFamily: SERIF, fontSize: 104, fontWeight: 700, color: INK, lineHeight: 1.08 }}>
          {v.titulo}
        </div>
      </Rise>
      <Rise delay={26}>
        <div style={{ display: "flex", gap: 22, marginTop: 54, justifyContent: "center" }}>
          {[v.periodo, `Carga: ${v.carga}`, "Academia de Engenharia de IA"].map((c) => (
            <div
              key={c}
              style={{
                fontFamily: SANS,
                fontSize: 27,
                color: MUT,
                border: `2px solid ${LINE}`,
                background: CARD,
                padding: "12px 28px",
                borderRadius: 999,
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

const Conceito: React.FC<{ s: Scene }> = ({ s }) => (
  <AbsoluteFill style={{ justifyContent: "center", padding: "0 200px" }}>
    <Kicker>{s.kicker}</Kicker>
    <Rise delay={8}>
      <div
        style={{
          borderLeft: `12px solid ${CARDINAL}`,
          paddingLeft: 56,
          fontFamily: SERIF,
          fontSize: 78,
          fontWeight: 600,
          color: INK,
          lineHeight: 1.25,
        }}
      >
        {s.frase}
      </div>
    </Rise>
    <Rule delay={20} width={160} />
  </AbsoluteFill>
);

const Topico: React.FC<{ s: Scene }> = ({ s }) => (
  <AbsoluteFill style={{ justifyContent: "center", padding: "0 170px" }}>
    <Kicker>{s.kicker}</Kicker>
    <Rise delay={6}>
      <div style={{ fontFamily: SERIF, fontSize: 84, fontWeight: 700, color: INK, lineHeight: 1.1 }}>
        {s.titulo}
      </div>
    </Rise>
    <Rule delay={12} />
    <div>
      {s.bullets?.map((b, i) => (
        <Rise key={i} delay={18 + i * 9}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              background: CARD,
              border: `1px solid ${LINE}`,
              borderRadius: 10,
              boxShadow: "0 6px 18px rgba(36,35,33,.05)",
              padding: "22px 34px",
              marginBottom: 18,
              width: "fit-content",
              minWidth: 900,
            }}
          >
            <div style={{ width: 16, height: 16, background: CARDINAL }} />
            <div style={{ fontFamily: SANS, fontSize: 42, color: INK }}>{b}</div>
          </div>
        </Rise>
      ))}
    </div>
  </AbsoluteFill>
);

const CodeScene: React.FC<{ s: Scene; dur: number }> = ({ s, dur }) => {
  const frame = useCurrentFrame();
  const code = s.code ?? "";
  // digitação termina em ~60% da cena
  const cps = Math.max(20, code.length / ((dur / FPS) * 0.6));
  const shown = typed(code, frame, 14, cps);
  const caret = Math.floor(frame / 12) % 2 === 0;
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 170px" }}>
      <Kicker>{s.kicker}</Kicker>
      <Rise delay={6}>
        <div style={{ fontFamily: SERIF, fontSize: 72, fontWeight: 700, color: INK, marginBottom: 40 }}>
          {s.titulo}
        </div>
      </Rise>
      <Rise delay={12}>
        <div
          style={{
            background: CODEBG,
            borderRadius: 14,
            boxShadow: "0 16px 42px rgba(36,35,33,.18)",
            overflow: "hidden",
            width: "fit-content",
            minWidth: 1100,
            maxWidth: 1580,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 26px",
              borderBottom: "1px solid rgba(255,255,255,.12)",
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 7, background: CARDINAL }} />
            <div style={{ fontFamily: SANS, fontSize: 22, color: "rgba(255,255,255,.55)", letterSpacing: 2 }}>
              terminal · módulo
            </div>
          </div>
          <pre
            style={{
              margin: 0,
              padding: "30px 40px 36px",
              fontFamily: MONO,
              fontSize: 33,
              lineHeight: 1.55,
              color: "#f2efe9",
            }}
          >
            {shown.split("\n").map((ln, i) => {
              const t = ln.trimStart();
              const isComment = t.startsWith("#") || t.startsWith("//");
              return (
                <div key={i} style={{ color: isComment ? "#9c968c" : undefined }}>
                  {ln || " "}
                </div>
              );
            })}
            {shown.length < code.length && caret && (
              <span style={{ background: CARDINAL, color: CARDINAL }}>▌</span>
            )}
          </pre>
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

const Check: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 200 }, durationInFrames: 14 });
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 8,
        background: CARDINAL,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 30,
        fontWeight: 700,
        transform: `scale(${p})`,
      }}
    >
      ✓
    </div>
  );
};

const Fim: React.FC<{ s: Scene; v: Roteiro }> = ({ s, v }) => (
  <AbsoluteFill style={{ justifyContent: "center", padding: "0 170px" }}>
    <Kicker>CHECKLIST DO MÓDULO {v.modulo}</Kicker>
    <div style={{ marginBottom: 40 }}>
      {s.bullets?.map((b, i) => (
        <Rise key={i} delay={8 + i * 8}>
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 20 }}>
            <Check delay={10 + i * 8} />
            <div style={{ fontFamily: SANS, fontSize: 42, color: INK }}>{b}</div>
          </div>
        </Rise>
      ))}
    </div>
    <Rise delay={14 + (s.bullets?.length ?? 0) * 8}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 34,
          background: CARDINAL,
          borderRadius: 14,
          padding: "34px 46px",
          width: "fit-content",
          boxShadow: "0 16px 42px rgba(140,21,21,.28)",
        }}
      >
        <Crest size={80} />
        <div>
          <div style={{ fontFamily: SANS, fontSize: 24, letterSpacing: 6, color: "#f4d5d5", marginBottom: 8 }}>
            A SEGUIR
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 700, color: "#fff" }}>
            {s.proximo}
          </div>
        </div>
      </div>
    </Rise>
  </AbsoluteFill>
);

// ---------- vídeo ----------

export const Aula: React.FC<{ video: Roteiro }> = ({ video }) => {
  let from = 0;
  const last = video.scenes.length - 1;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {video.scenes.map((s, i) => {
        const dur = sceneFrames(video.slug, i) + (i === last ? TAIL : 0);
        const start = from;
        const el = (
          <Sequence key={i} from={start} durationInFrames={dur}>
            <Audio src={staticFile(`audio/${video.slug}-${i}.mp3`)} />
            {s.tipo === "capa" ? (
              <AbsoluteFill style={{ background: PAPER }}>
                <div style={{ position: "absolute", right: -180, bottom: -180, opacity: 0.06 }}>
                  <Crest size={700} faint />
                </div>
                <Capa v={video} />
                <Footer v={video} sceneStart={start} idx={i} />
              </AbsoluteFill>
            ) : (
              <Shell v={video} sceneStart={start} idx={i}>
                {s.tipo === "conceito" && <Conceito s={s} />}
                {s.tipo === "topico" && <Topico s={s} />}
                {s.tipo === "code" && <CodeScene s={s} dur={dur} />}
                {s.tipo === "fim" && <Fim s={s} v={video} />}
              </Shell>
            )}
          </Sequence>
        );
        from += dur;
        return el;
      })}
    </AbsoluteFill>
  );
};
