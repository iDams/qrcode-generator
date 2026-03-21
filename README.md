<h1 align="center">
React Native QRCode Skia 🎨
</h1>

A customizable QR code toolkit for web and mobile with gradients, shape controls, logo support, SVG/PNG export, and ready-to-use code snippets. Powered by React Native Skia.

Generate your **QR Code** in less than 30 seconds using [qrcode.imarcodev.com](https://qrcode.imarcodev.com).

## What It Does

- Generate QR codes with custom shapes, eye patterns, gaps, gradients, and centered logos.
- Export high-resolution PNG and SVG files.
- Copy reusable snippets for SVG, HTML embed, and React Native / Skia.
- Use the package as a lightweight QR component in React Native apps.
- Explore and customize everything visually in the web editor.

## Installation

Before installing the package, make sure you have installed [RN Skia](https://shopify.github.io/react-native-skia/). 

```sh
bun add @shopify/react-native-skia
```

Then, you can install the package:

```sh
bun add react-native-qrcode-skia
```

## Usage

If you only need a simple QRCode component in your app, you can start with the basic props:

```tsx
import QRCode from 'react-native-qrcode-skia';

const App = () => {
  return (
    <QRCode
      value="https://qrcode.imarcodev.com"
      size={200}
    />
  );
};

export default App;
```

Under the hood, the QRCode is a Skia Path, so you can customize it through the `children` prop:

```tsx
import QRCode from 'react-native-qrcode-skia';
import { View, Text } from 'react-native';
import { RadialGradient } from '@shopify/react-native-skia';

const App = () => {
  return (
    <QRCode
      value="https://qrcode.imarcodev.com"
      size={200}
      shapeOptions={{
        shape: "circle",
        eyePatternShape: "rounded",
        eyePatternGap: 0,
        gap: 0
      }}
      logoAreaSize={70}
      logo={
        <View style={{
          height: 50,
          aspectRatio: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 38 }}>🦊</Text>
        </View>
      }
    >
      <RadialGradient c={{ x: 100, y: 100 }} r={100} colors={["#eeca3b","#ee3b83"]} />
    </QRCode>
  );
};

export default App;
```

## Playground

The repository also includes a visual editor where you can:

- tweak colors, gradients, shapes, eye patterns, gaps, and logos,
- export QR codes as PNG or SVG,
- copy snippets for HTML embed, SVG, and React Native / Skia.

Try it at [qrcode.imarcodev.com](https://qrcode.imarcodev.com).

## Props

- `value` (string) - The value encoded in the QRCode.

- `style` (StyleProp<ViewStyle>, optional) - The style applied to the QRCode container.

- `errorCorrectionLevel` (ErrorCorrectionLevelType, optional) - The error correction level for the QRCode. Level L: 7%, level M: 15%, level Q: 25%, level H: 30%. Default value is 'H'.

- `color` (string, optional) - The color of the QRCode base path. Default value is '#000000'.

- `strokeWidth` (number, optional) - The stroke width in pixels when pathStyle is 'stroke'. Default value is 1.

- `children` (React.ReactNode, optional) - The children components rendered within the QRCode container.

- `pathStyle` ('fill' | 'stroke', optional) - The style of the QRCode path: 'fill' or 'stroke'. Default value is 'fill'.

- `padding` (number, optional) - The padding applied around the QRCode. Default value is 0.

- `size` (number) - The size of the QRCode.

- `shapeOptions` (ShapeOptions, optional) - The shape options for the QRCode path.
  `shape` controls the main cells.
  `eyePatternShape` controls the eye patterns.
  `gap` controls spacing between cells.
  `eyePatternGap` controls spacing in the eye patterns.
  Supported shapes are `square`, `circle`, `rounded`, `diamond`, `triangle`, and `star`.

- `logoAreaSize` (number, optional) - The size of the area cleared for the logo in the center of the QR code. Default is 70 when logo is provided, 0 otherwise.

- `logoAreaBorderRadius` (number, optional) - The border radius of the logo area. Default is 0.

- `logo` (React.ReactNode, optional) - A React node to render as the logo in the center of the QR code. When provided, a square area is cleared in the center to make room for the logo.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Credits

This project was originally created by [Enzo Manuel Mangano](https://github.com/enzomanuelmangano).

## License

MIT

This library continues to be released under the MIT License, respecting the original open-source foundations.
