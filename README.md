# Fancy Action Sheet for React Native

[![npm version](https://img.shields.io/npm/v/react-native-fancy-action-sheet)](https://www.npmjs.com/package/react-native-fancy-action-sheet)
[![npm downloads](https://img.shields.io/npm/dm/react-native-fancy-action-sheet)](https://www.npmjs.com/package/react-native-fancy-action-sheet)
[![license](https://img.shields.io/npm/l/react-native-fancy-action-sheet)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/kelvingraddick/react-native-fancy-action-sheet)](https://github.com/kelvingraddick/react-native-fancy-action-sheet/issues)
[![GitHub stars](https://img.shields.io/github/stars/kelvingraddick/react-native-fancy-action-sheet?style=social)](https://github.com/kelvingraddick/react-native-fancy-action-sheet/stargazers)

## Introduction

**Fancy Action Sheet** is a customizable and flexible action sheet component for React Native. This component is easy to integrate, highly customizable, and comes with support for both standard and destructive actions.

## Installation

Install the package via **NPM**:

```bash
npm install fancy-action-sheet
```
..or via **Yarn**:
```bash
yarn add fancy-action-sheet
```

## Dependencies

### React Native
This package was created to be used exclusively with a [React Native](https://reactnative.dev) app project.

Specifically, this package requires the following **peer dependencies** to be installed in your project:

`React: >=17.0.0`<br />
`React Native: >=0.68.0`

Since this package is used within a React Native project these depencencies should already be installed.<br />
⚠️ Only install them manually **if they are NOT already installed** for some reason:

```bash
npm install react react-native
```

## Usage

Wrap your app in the `FancyActionSheetProvider` and use the `useFancyActionSheet` hook to control the action sheet.

### Basic Example

```JavaScript
import React from 'react';
import { Button } from 'react-native';
import { FancyActionSheetProvider, useFancyActionSheet } from 'fancy-action-sheet';

const App = () => (
  <FancyActionSheetProvider>
    <HomeScreen />
  </FancyActionSheetProvider>
);

const HomeScreen = () => {
  const { showFancyActionSheet } = useFancyActionSheet();

  const handleShowActionSheet = () => {
    showFancyActionSheet({
      title: 'Choose an Option',
      message: 'Please select one of the options below:',
      options: [
        { id: '1', name: 'Option 1' },
        { id: '2', name: 'Option 2' },
        { id: '3', name: 'Delete' },
      ],
      destructiveOptionId: '3',
      onOptionPress: (option) => console.log(`Selected: ${option.name}`),
    });
  };

  return <Button title="Show Action Sheet" onPress={handleShowActionSheet} />;
};

export default App;
```

## Features

- Fully customizable styles for action sheet, buttons, and overlays.
- Support for both standard and destructive action buttons.
- Easy integration using React Context.
- Works seamlessly with React Native's modal system.

## Reference links

- [React Native](https://reactnative.dev)

## Contributing

Contributions are welcome! 🎉

- **Submit Pull Requests**: If you’ve improved the code or added new features, feel free to submit a pull request.
- **Report Issues**: Found a bug or want to suggest a feature? Open an issue on the [GitHub Issues](https://github.com/kelvingraddick/react-native-fancy-action-sheet/issues) page.

## About the author

Hi. I'm Kelvin Graddick also known as KG.codes. I'm a software developer / programmer, app + website developer, and content creator. I'm all about digital creation. Learn more about me on my website: [KG.codes](https://www.kg.codes).

### Support my work

Let’s connect! You can simply support my work by connecting on these platforms:

[![Twitter](https://img.shields.io/twitter/follow/KGcodes?style=social)](https://twitter.com/KGcodes)<br />
[![Instagram](https://img.shields.io/badge/Instagram-%40kg.codes-rose)](https://www.instagram.com/kg.codes/)<br />
[![Threads](https://img.shields.io/badge/Threads-%40kg.codes-black)](https://threads.net/kg.codes)<br />
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Kelvin%20Graddick-blue)](https://linkedin.com/in/kelvingraddick)<br />
[![TikTok](https://img.shields.io/badge/TikTok-%40kg.codes-black)](https://tiktok.com/@kg.codes)<br />
[![Twitch](https://img.shields.io/badge/Twitch-kgcodes-purple)](https://twitch.tv/kgcodes)

..or if you'd like to support monetarily:

[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsor%20Me-red?logo=github&logoColor=white)](https://github.com/sponsors/kgcodes)<br />
[![PayPal](https://img.shields.io/badge/PayPal-Donate-blue?logo=paypal&logoColor=white)](https://paypal.me/kgcodes)<br />
[![Cash App](https://img.shields.io/badge/Cash%20App-%24kgcodes-brightgreen?logo=cashapp&logoColor=white)](https://cash.app/$kgcodes)<br />
[![Venmo](https://img.shields.io/badge/Venmo-%40kgcodes-007aff?logo=venmo&logoColor=white)](https://venmo.com/kgcodes)<br />
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Buy%20Me%20a%20Coffee-orange?logo=kofi&logoColor=white)](https://ko-fi.com/kgcodes)

Your support helps me dedicate more time to building useful open-source tools like this one. ❤️

## License

This project is licensed under the MIT License.
