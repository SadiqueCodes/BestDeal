import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { typography, colors } from '../theme';

type TypographyVariant = keyof typeof typography.variants;

interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = colors.text.primary,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const variantStyle = typography.variants[variant];

  const textStyle: TextStyle = {
    ...variantStyle,
    color,
    textAlign: align,
  };

  return (
    <RNText style={[textStyle, style]} {...props}>
      {children}
    </RNText>
  );
};
