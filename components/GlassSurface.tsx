import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

type GlassSurfaceProps = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  radius?: number;
};

/**
 * Native glass treatment for Android. Other platforms keep their existing
 * surface rendering so this visual pass does not change the iOS experience.
 */
export function GlassSurface({
  children,
  style,
  intensity = 32,
  radius = 20,
}: GlassSurfaceProps) {
  if (Platform.OS !== 'android') {
    return <View style={style}>{children}</View>;
  }

  return (
    <View style={[styles.container, { borderRadius: radius }, style]}>
      <BlurView
        intensity={intensity}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={[StyleSheet.absoluteFillObject, { borderRadius: radius }]}
      />
      <View style={styles.tint}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'rgba(13, 25, 48, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(160, 205, 255, 0.16)',
  },
  tint: {
    backgroundColor: 'rgba(10, 20, 40, 0.22)',
  },
});
