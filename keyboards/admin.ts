import { Keyboard } from 'grammy';
import { getMainMenu } from './main';

export function getAdminKeyboard() {
    return new Keyboard()
        .text('Последние записи').text('Сегодняшние записи').row()
        .text('Все записи').text('Маникюр записи').row()
        .text('Тату записи').text('Назад')
        .resized();
}

export { getMainMenu };