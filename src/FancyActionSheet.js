import React, { createContext, useState, useContext } from 'react';
import { Image, Modal, Pressable, ScrollView, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const FancyActionSheet = ({ isVisible, settings, hide, clearSettings }) => {
  const {
    title = '',
    message = '',
    overlayStyle = {},
    sheetStyle = {},
    titleTextStyle = {},
    messageTextStyle = {},
    closeButtonStyle = {},
    closeButtonIconStyle = {},
    optionButtonStyle = {},
    optionButtonTextStyle = {},
    destructiveOptionButtonStyle = {},
    destructiveOptionButtonTextStyle = {},
    options = [],
    destructiveOptionId = null,
    onOptionPress = () => {},
  } = settings;
  const onClosePress = async () => { hide(); await onOptionPress({}); clearSettings(); };
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      supportedOrientations={['portrait', 'portrait-upside-down', 'landscape-left', 'landscape-right']}
      onRequestClose={onClosePress}
    >
      <SafeAreaProvider style={styles.modal}>
        <View style={[styles.overlay, { ...overlayStyle }]}>
          <TouchableWithoutFeedback onPress={onClosePress}><View style={{ flex: 1, }} /></TouchableWithoutFeedback>
          <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={[styles.sheetView, { ...sheetStyle }, styles.sheetBounds]}>
            <ScrollView style={styles.optionsScroll} keyboardShouldPersistTaps="handled">
              { title && <Text style={[styles.titleText, { ...titleTextStyle }]}>{title}</Text> }
              { message && <Text style={[styles.messageText, { ...messageTextStyle }]}>{message}</Text> }
              <View style={[styles.optionButtonsView]}>
                {options.map((option) => {
                  const isDestructiveOption = destructiveOptionId == option.id;
                  return (
                    <Pressable key={option.id} style={[styles.optionButton, { ...(isDestructiveOption ? destructiveOptionButtonStyle : optionButtonStyle) }]} onPress={async () => { hide(); await onOptionPress(option); clearSettings(); }} accessibilityLabel={option.name}>
                      <Text style={[(isDestructiveOption ? styles.destructiveButtonText : styles.optionButtonText), { ...(isDestructiveOption ? destructiveOptionButtonTextStyle : optionButtonTextStyle) }]}>{option.name}</Text>
                    </Pressable>);
                })}
              </View>
            </ScrollView>
            <TouchableOpacity style={[styles.closeButton, { ...closeButtonStyle }]} onPress={onClosePress} accessibilityLabel='Close action menu'>
              <Image source={require('../assets/images/x.png')} style={[styles.closeButtonIcon, { ...closeButtonIconStyle }]} tintColor={closeButtonIconStyle?.color ?? '#353535'} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetView: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
  },
  sheetBounds: {
    flexShrink: 1,
    maxHeight: '100%',
  },
  optionsScroll: {
    flexGrow: 0,
    flexShrink: 1,
    marginBottom: 16,
  },
  titleText: {
    marginTop: 5,
    marginBottom: 7.5,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'#353535',
  },
  messageText: {
    marginBottom: 7.5,
    fontSize: 15,
    textAlign: 'center',
    color:'#353535',
  },
  optionButtonsView: {
    marginTop: 20,
    marginBottom: 15,
  },
  optionButton: {
    borderRadius: 10,
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#dfdfdf',
  },
  optionButtonText: {
    alignSelf: 'center',
    color: '#007AFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  destructiveButtonText: {
    alignSelf: 'center',
    color: '#FF3A2D',
    fontSize: 17,
  },
  closeButton: {
    height: 44,
    width: 44,
    flexShrink: 0,
    borderRadius: 22,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#dfdfdf',
  },
  closeButtonIcon: {
    height: 15,
    width: 15,
    alignSelf: 'center',
  },
});

/**
 * @typedef {Object} FancyActionSheetSettings
 * @property {string} title - The title of the action sheet.
 * @property {string} [message] - The message of the action sheet.
 * @property {Array<FancyActionSheetOption>} options - List of options (buttons) to display.
 * @property {function(Object):void} onOptionPress - Function to call on option press, passing the option object.
 * @property {string|number} [destructiveOptionId] - ID of option to be displayed as a destructive option/button
 * @property {Object} [overlayStyle] - Style object for overlay.
 * @property {Object} [sheetStyle] - Style object for sheet.
 * @property {Object} [titleTextStyle] - Style object for title text.
 * @property {Object} [messageTextStyle] - Style object for message text.
 * @property {Object} [closeButtonStyle] - Style object for close button.
 * @property {Object} [closeButtonIconStyle] - Style object for close button icon.
 * @property {Object} [optionButtonStyle] - Style object for option button.
 * @property {Object} [optionButtonTextStyle] - Style object for option button text.
 * @property {Object} [destructiveOptionButtonStyle] - Style object for destructive option button.
 * @property {Object} [destructiveOptionButtonTextStyle] - Style object for destructive option button text.
 */

/**
 * @typedef {Object} FancyActionSheetOption
 * @property {string} id - The ID of the option.
 * @property {string} name - The name/label of the option.
 */

/**
 * @typedef {Object} FancyActionSheetContext
 * @property {function(FancyActionSheetSettings):void} showFancyActionSheet - Function to show the action sheet.
 */

/** @type {React.Context<FancyActionSheetContext>} */
const FancyActionSheetContext = createContext();

export const FancyActionSheetProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState({});

  const showFancyActionSheet = (settings) => {
    setSettings(settings);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  const clearSettings = () => {
    setSettings({});
  };

  return (
    <FancyActionSheetContext.Provider value={{ showFancyActionSheet }}>
      {children}
      <FancyActionSheet isVisible={isVisible} settings={settings} hide={hide} clearSettings={clearSettings}  />
    </FancyActionSheetContext.Provider>
  );
};

export const useFancyActionSheet = () => {
  /**
   * @type {FancyActionSheetContext}
   */
  const context = useContext(FancyActionSheetContext);
  if (!context) {
    throw new Error('useFancyActionSheet must be used within a FancyActionSheetProvider');
  }
  return context;
};

export default FancyActionSheet;
