(function (e) {
  const t = (e['uk'] = e['uk'] || {});
  t.dictionary = Object.assign(t.dictionary || {}, {
    '%0 of %1': '%0 із %1',
    Accept: 'Прийняти',
    Aquamarine: 'Аквамариновий',
    Black: 'Чорний',
    Blue: 'Синій',
    Cancel: 'Відміна',
    Clear: 'Очистити',
    'Click to edit block': 'Клацніть, щоб редагувати блок',
    'Dim grey': 'Темно-сірий',
    'Drag to move': 'Потягніть, щоб перемістити',
    'Dropdown toolbar': 'Випадаюча панель інструментів',
    'Edit block': 'Редагувати блок',
    'Editor block content toolbar':
      'Панель інструментів вмісту блоку редактора',
    'Editor contextual toolbar': 'Контекстна панель інструментів редактора',
    'Editor editing area: %0': 'Область редагування редактора: %0',
    'Editor toolbar': 'Панель інструментів редактора',
    Green: 'Зелений',
    Grey: 'Сірий',
    HEX: 'Шістнадцятковий',
    'Insert paragraph after block': 'Додати абзац після блока',
    'Insert paragraph before block': 'Додати абзац перед блоком',
    'Light blue': 'Світло-синій',
    'Light green': 'Світло-зелений',
    'Light grey': 'Світло-сірий',
    Next: 'Наступний',
    'No results found': 'Нічого не знайдено',
    'No searchable items': "Немає шуканих об'єктів",
    Orange: 'Помаранчевий',
    'Press Enter to type after or press Shift + Enter to type before the widget':
      'Натисніть Enter, щоб друкувати після або натисніть Shift + Enter, щоб друкувати перед віджетом',
    Previous: 'Попередній',
    Purple: 'Фіолетовий',
    Red: 'Червоний',
    Redo: 'Повтор',
    'Rich Text Editor': 'Розширений текстовий редактор',
    'Select all': 'Вибрати все',
    'Show more items': 'Показати більше',
    Turquoise: 'Бірюзовий',
    Undo: 'Відміна',
    White: 'Білий',
    'Widget toolbar': 'Панель інструментів віджетів',
    Yellow: 'Жовтий',
  });
  t.getPluralForm = function (e) {
    return e % 1 == 0 && e % 10 == 1 && e % 100 != 11
      ? 0
      : e % 1 == 0 &&
        e % 10 >= 2 &&
        e % 10 <= 4 &&
        (e % 100 < 12 || e % 100 > 14)
      ? 1
      : e % 1 == 0 &&
        (e % 10 == 0 ||
          (e % 10 >= 5 && e % 10 <= 9) ||
          (e % 100 >= 11 && e % 100 <= 14))
      ? 2
      : 3;
  };
})(window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}));
