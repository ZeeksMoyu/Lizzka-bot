import { Context, SessionFlavor } from 'grammy';

export interface SessionData {
    waitingForContact: boolean;
    lang: 'pl' | 'ua';
    service?: 'tattoo' | 'manicure'; // Сделали свойство опциональным
    adminMode: boolean;
}

export type MyContext = Context & SessionFlavor<SessionData> & {
    message: {
        text: string;
    };
};