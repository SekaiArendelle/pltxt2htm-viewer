declare module './vendor/pltxt2htm.js' {
  type Module = {
    cwrap: (
      ident: string,
      returnType: 'string' | null,
      argTypes: Array<'string' | 'number' | 'array' | null>,
    ) => (...args: unknown[]) => unknown;
  };

  export default function createModule(moduleArg?: Record<string, unknown>): Promise<Module>;
}
