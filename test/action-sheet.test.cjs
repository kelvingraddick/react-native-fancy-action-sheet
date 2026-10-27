const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const test = require('node:test');
const React = require('react');
const renderer = require('react-test-renderer');

const { act } = renderer;
const packageRoot = path.resolve(__dirname, '..');
const packageJson = require('../package.json');

function flattenStyle(style) {
  return Array.isArray(style)
    ? Object.assign({}, ...style.map(flattenStyle))
    : style || {};
}

// Exercise the built package entry with real React state and event handlers.
// Only native host views and image loading are mocked. These tests cannot
// establish rendered geometry; device testing covers folding and short windows.
function loadBuiltPackage() {
  const native = Object.fromEntries([
    'Image', 'Modal', 'Pressable', 'View', 'Text', 'TouchableOpacity',
    'TouchableWithoutFeedback', 'ScrollView',
  ].map(name => [name, name]));
  native.StyleSheet = { create: styles => styles, flatten: flattenStyle };
  const safeArea = {
    SafeAreaProvider: 'SafeAreaProvider',
    SafeAreaView: 'SafeAreaView',
  };
  const modules = new Map();
  const context = vm.createContext({ console });

  function load(filename) {
    if (modules.has(filename)) {
      return modules.get(filename).exports;
    }
    const module = { exports: {} };
    modules.set(filename, module);
    const localRequire = createRequire(filename);
    const mockedRequire = request => {
      if (request === 'react-native') return native;
      if (request === 'react-native-safe-area-context') return safeArea;
      if (request.endsWith('.png')) return { uri: request };
      if (request.startsWith('.')) return load(localRequire.resolve(request));
      return localRequire(request);
    };
    const code = fs.readFileSync(filename, 'utf8');
    const evaluate = new vm.Script(
      `(function (exports, require, module, __filename, __dirname) {\n${code}\n})`,
      { filename },
    ).runInContext(context);
    evaluate(module.exports, mockedRequire, module, filename, path.dirname(filename));
    return module.exports;
  }

  return load(path.resolve(packageRoot, packageJson.main));
}

const library = loadBuiltPackage();

function mountProvider(t) {
  let api;
  let tree;
  function Consumer() {
    api = library.useFancyActionSheet();
    return React.createElement('Consumer');
  }
  act(() => {
    tree = renderer.create(React.createElement(
      library.FancyActionSheetProvider,
      null,
      React.createElement(Consumer),
    ));
  });
  t.after(() => act(() => tree.unmount()));
  return {
    tree,
    show(settings) { act(() => api.showFancyActionSheet(settings)); },
    modal() { return tree.root.findByType('Modal'); },
    close() {
      return tree.root.findByProps({ accessibilityLabel: 'Close action menu' });
    },
  };
}

function fixtureSettings(onOptionPress = () => {}) {
  return {
    title: 'Snippet actions',
    message: 'Choose what to do with this snippet.',
    options: Array.from({ length: 8 }, (_, index) => ({
      id: `action-${index}`,
      name: index === 7 ? 'Delete snippet' : `Action ${index + 1}`,
    })),
    destructiveOptionId: 'action-7',
    sheetStyle: { backgroundColor: '#112233' },
    titleTextStyle: { color: '#ddeeff' },
    optionButtonStyle: { backgroundColor: '#334455' },
    optionButtonTextStyle: { color: '#ffffff' },
    destructiveOptionButtonStyle: { backgroundColor: '#aa0000' },
    destructiveOptionButtonTextStyle: { color: '#ffcccc' },
    closeButtonStyle: { backgroundColor: '#556677' },
    closeButtonIconStyle: { color: '#abcdef' },
    onOptionPress,
  };
}

test('the built package entry exports usable component, provider, and hook', () => {
  for (const name of ['FancyActionSheet', 'FancyActionSheetProvider', 'useFancyActionSheet']) {
    assert.equal(typeof library[name], 'function', `${name} must be exported`);
  }
});

test('using the hook outside its provider reports the required provider', () => {
  function UnprovidedConsumer() {
    library.useFancyActionSheet();
    return null;
  }
  // React reports the intentionally thrown render error to the console too.
  const originalError = console.error;
  console.error = () => {};
  try {
    assert.throws(
      () => act(() => renderer.create(React.createElement(UnprovidedConsumer))),
      /useFancyActionSheet must be used within a FancyActionSheetProvider/,
    );
  } finally {
    console.error = originalError;
  }
});

test('show displays eight labeled actions with destructive and custom styles', t => {
  const harness = mountProvider(t);
  assert.equal(harness.modal().props.visible, false);
  const settings = fixtureSettings();
  harness.show(settings);
  assert.equal(harness.modal().props.visible, true);
  const actions = harness.tree.root.findAllByType('Pressable');
  assert.equal(actions.length, 8);
  assert.deepEqual(actions.map(action => action.props.accessibilityLabel), settings.options.map(option => option.name));
  const title = harness.tree.root.findAllByType('Text').find(node => node.props.children === settings.title);
  assert.ok(title, 'the title remains visible');
  assert.equal(flattenStyle(title.props.style).color, '#ddeeff');
  assert.ok(harness.tree.root.findAllByType('Text').some(node => node.props.children === settings.message));
  assert.equal(flattenStyle(actions[0].props.style).backgroundColor, '#334455');
  assert.equal(flattenStyle(actions[0].findByType('Text').props.style).color, '#ffffff');
  assert.equal(flattenStyle(actions[7].props.style).backgroundColor, '#aa0000');
  assert.equal(flattenStyle(actions[7].findByType('Text').props.style).color, '#ffcccc');
  const sheet = harness.tree.root.findByType('SafeAreaView');
  assert.equal(flattenStyle(sheet.props.style).backgroundColor, '#112233');
  assert.equal(flattenStyle(harness.close().props.style).backgroundColor, '#556677');
  assert.equal(harness.close().findByType('Image').props.tintColor, '#abcdef');
});

test('selection closes immediately, calls once with the exact option, then clears settings', async t => {
  const harness = mountProvider(t);
  const received = [];
  let finishCallback;
  const callbackFinished = new Promise(resolve => { finishCallback = resolve; });
  const settings = fixtureSettings(option => {
    received.push(option);
    return callbackFinished;
  });
  harness.show(settings);
  let selectionFinished;
  await act(async () => {
    selectionFinished = harness.tree.root.findAllByType('Pressable')[7].props.onPress();
  });
  assert.equal(harness.modal().props.visible, false);
  assert.equal(received.length, 1);
  assert.equal(received[0], settings.options[7]);
  finishCallback();
  await act(async () => { await selectionFinished; });
  assert.equal(harness.tree.root.findAllByType('Pressable').length, 0);
});

test('Close, Android back, and backdrop retain the empty-option cancellation contract', async t => {
  for (const trigger of ['close', 'back', 'backdrop']) {
    await t.test(trigger, async subtest => {
      const harness = mountProvider(subtest);
      const received = [];
      harness.show(fixtureSettings(option => { received.push(option); }));
      const closeHandler = harness.close().props.onPress;
      const backHandler = harness.modal().props.onRequestClose;
      const backdropHandler = harness.tree.root.findByType('TouchableWithoutFeedback').props.onPress;
      assert.equal(backHandler, closeHandler);
      assert.equal(backdropHandler, closeHandler);
      const handler = { close: closeHandler, back: backHandler, backdrop: backdropHandler }[trigger];
      await act(async () => { await handler(); });
      assert.equal(harness.modal().props.visible, false);
      assert.equal(received.length, 1);
      assert.equal(typeof received[0], 'object');
      assert.deepEqual(Object.keys(received[0]), []);
      assert.equal(harness.tree.root.findAllByType('Pressable').length, 0);
    });
  }
});

test('resizable modal uses local safe areas and keeps Close outside the scrolling options', t => {
  const harness = mountProvider(t);
  harness.show(fixtureSettings());
  const modal = harness.modal();
  assert.deepEqual(new Set(modal.props.supportedOrientations), new Set([
    'portrait', 'portrait-upside-down', 'landscape-left', 'landscape-right',
  ]));
  const localProvider = modal.findByType('SafeAreaProvider');
  const sheet = localProvider.findByType('SafeAreaView');
  assert.deepEqual(new Set(sheet.props.edges), new Set(['top', 'left', 'right', 'bottom']));
  assert.equal(flattenStyle(sheet.props.style).maxHeight, '100%');
  const scroll = sheet.findByType('ScrollView');
  assert.equal(scroll.findAllByType('Pressable').length, 8);
  assert.equal(scroll.findAllByProps({ accessibilityLabel: 'Close action menu' }).length, 0);
  assert.equal(flattenStyle(scroll.props.style).flexShrink, 1);
  assert.ok(flattenStyle(scroll.props.style).marginBottom > 0, 'a gap separates options from Close');
  const close = sheet.findByProps({ accessibilityLabel: 'Close action menu' });
  const closeStyle = flattenStyle(close.props.style);
  assert.equal(closeStyle.flexShrink, 0);
  assert.ok(closeStyle.height >= 44 && closeStyle.width >= 44, 'Close retains a usable touch target');
});
