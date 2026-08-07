import { Composition } from "remotion";
import { Aula, Roteiro, totalFrames } from "./Aula";
import { FPS } from "./lib";
import m00 from "./roteiros/00.json";
import m01 from "./roteiros/01.json";
import m03 from "./roteiros/03.json";
import m05 from "./roteiros/05.json";
import m06 from "./roteiros/06.json";
import m07 from "./roteiros/07.json";
import m08 from "./roteiros/08.json";
import m09 from "./roteiros/09.json";
import m10 from "./roteiros/10.json";
import m11 from "./roteiros/11.json";
import m12 from "./roteiros/12.json";
import a03 from "./roteiros/a03.json";
import a04 from "./roteiros/a04.json";
import a05 from "./roteiros/a05.json";
import a06 from "./roteiros/a06.json";

export const ROTEIROS = [
  m00, m01, m03, m05, m06, m07, m08, m09, m10, m11, m12,
  a03, a04, a05, a06,
] as Roteiro[];

export const RemotionRoot = () => (
  <>
    {ROTEIROS.map((v) => (
      <Composition
        key={v.id}
        id={v.id}
        component={Aula}
        durationInFrames={totalFrames(v)}
        defaultProps={{ video: v }}
        fps={FPS}
        width={1920}
        height={1080}
      />
    ))}
  </>
);
