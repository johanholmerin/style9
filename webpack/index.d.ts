declare class Style9Plugin {
  constructor(config?: { test: string | RegExp });

  apply(compiler: typeof import("webpack")["Compiler"]): void;

  static loader: typeof import("./loader");
}

export default Style9Plugin;
