import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";

import "./fonts/HelveticaNowDisplay-Medium.woff";
import "./fonts/HelveticaNowDisplay-Regular.woff";

import "./App.scss";

import { Header } from "./components";

function App() {
  // no idea what type to use for lenisRef

  return (
    <ReactLenis root>
      <div className="App">
        <Header />
        test
      </div>
    </ReactLenis>
  );
}

export default App;
