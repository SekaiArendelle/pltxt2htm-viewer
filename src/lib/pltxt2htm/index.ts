import createPltxt2htmModule from './vendor/pltxt2htm.js';

type AdvancedParser = (text: string) => string;

type Pltxt2htmModule = {
  cwrap: (
    ident: string,
    returnType: 'string' | null,
    argTypes: Array<'string' | 'number' | 'array' | null>,
  ) => (...args: unknown[]) => unknown;
};

let advancedParserPromise: Promise<AdvancedParser> | null = null;

export function getAdvancedParser(): Promise<AdvancedParser> {
  if (!advancedParserPromise) {
    advancedParserPromise = createPltxt2htmModule().then((module: Pltxt2htmModule) => {
      const parser = module.cwrap('advanced_parser', 'string', ['string']);
      return (text: string) => parser(text) as string;
    });
  }
  return advancedParserPromise;
}
