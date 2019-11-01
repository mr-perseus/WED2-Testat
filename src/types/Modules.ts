declare module 'express-hbs' {
    import { registerHelper, TemplateDelegate } from 'handlebars';

    export function express4(param: {
        partialsDir: string;
    }): (
        path: string,
        options: object,
        callback: (e: Error, rendered: string) => void,
    ) => void;

    export { registerHelper, TemplateDelegate };
}
