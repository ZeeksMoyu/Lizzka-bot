import { MyContext } from '../types';
import { commands } from '../locales/commands';

export async function setLocalizedCommands(ctx: MyContext, lang: keyof typeof commands) {
    if (commands[lang]) {
        await ctx.api.setMyCommands(commands[lang]);
    } else {
        await ctx.api.setMyCommands(commands['pl']); // fallback
    }
}