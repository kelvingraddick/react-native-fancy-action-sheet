# Changelog

## 2.0.0

- Require `react-native-safe-area-context` 4.10.0 or later. Install a version compatible with your React Native app and rebuild its native dependencies.
- Respect each modal's live safe-area insets, including asymmetric iPhone Duo system regions.
- Support all four interface orientations and changing window sizes while a menu is open.
- Scroll long menus independently of the close control, with compact options and a separated, nonshrinking 44-point close button.
- Handle Android Back through the same dismissal callback as Close and the backdrop.
- Correct the existing `FancyActionSheet` component export.
- Build the distributable before packing or installing from GitHub, and run behavioral tests before publishing.
- Publish from GitHub Actions through npm Trusted Publishing with OIDC instead of a stored npm token.
