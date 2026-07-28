import { Composition } from "remotion";
import { Aula, Roteiro, totalFrames } from "./Aula";
import { FPS } from "./lib";
import m00 from "./roteiros/00.json";
import m01 from "./roteiros/01.json";
import m02 from "./roteiros/02.json";
import m03 from "./roteiros/03.json";
import m04 from "./roteiros/04.json";
import m05 from "./roteiros/05.json";
import m06 from "./roteiros/06.json";
import m07 from "./roteiros/07.json";
import m08 from "./roteiros/08.json";
import m09 from "./roteiros/09.json";
import m10 from "./roteiros/10.json";
import m11 from "./roteiros/11.json";
import m12 from "./roteiros/12.json";

export const ROTEIROS = [
  m00, m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12,
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
