(function (e) {
  const r = (e['pt'] = e['pt'] || {});
  r.dictionary = Object.assign(r.dictionary || {}, {
    '%0 of %1': '%0 de %1',
    Accept: 'Aceitar',
    Aquamarine: 'Verde-azulado',
    Black: 'Preto',
    Blue: 'Azul',
    Cancel: 'Cancelar',
    Clear: 'Limpar',
    'Click to edit block': 'Clique para editar o bloco',
    'Dim grey': 'Cinzento-escuro',
    'Drag to move': 'Arraste para mover',
    'Dropdown toolbar': 'Barra de ferramentas do dropdown',
    'Edit block': 'Editar bloco',
    'Editor block content toolbar':
      'Barra de ferramentas de edição do conteúdo de blocos',
    'Editor contextual toolbar': 'Barra de ferramentas contextual de edição',
    'Editor editing area: %0': 'Área de edição do editor: %0',
    'Editor toolbar': 'Barra de ferramentas do editor',
    Green: 'Verde',
    Grey: 'Cinzento',
    HEX: 'HEX',
    'Insert paragraph after block': 'Inserir parágrafo após o bloco',
    'Insert paragraph before block': 'Inserir parágrafo antes do bloco',
    'Light blue': 'Azul-claro',
    'Light green': 'Verde-claro',
    'Light grey': 'Cinzento-claro',
    Next: 'Seguinte',
    'No results found': 'Nenhum resultado encontrado',
    'No searchable items': 'Nenhum item pesquisável',
    Orange: 'Laranja',
    'Press Enter to type after or press Shift + Enter to type before the widget':
      'Prima Enter para escrever depois ou Shift + Enter para escrever antes do widget',
    Previous: 'Anterior',
    Purple: 'Roxo',
    Red: 'Vermelho',
    Redo: 'Refazer',
    'Rich Text Editor': 'Editor de texto avançado',
    'Select all': 'Selecionar todos',
    'Show more items': 'Mostrar mais itens',
    Turquoise: 'Turquesa',
    Undo: 'Desfazer',
    White: 'Branco',
    'Widget toolbar': 'Barra de ferramentas do widget',
    Yellow: 'Amarelo',
  });
  r.getPluralForm = function (e) {
    return e == 0 || e == 1 ? 0 : e != 0 && e % 1e6 == 0 ? 1 : 2;
  };
})(window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}));
