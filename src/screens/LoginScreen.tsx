import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button, GlowCard } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, borderRadius, typography } from '../theme';
import { registerForPushNotifications, savePushToken } from '../services/notifications';

export const LoginScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      
      // Register for push notifications
      const token = await registerForPushNotifications();
      if (token) {
        // Token will be saved after user is authenticated
        console.log('Push token registered:', token);
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, fullName);
      Alert.alert('Success', 'Account created! Please check your email to verify.');
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="pricetags" size={48} color={colors.accent.pink} />
            </View>
            <Text variant="h1" style={styles.title}>BestDeal</Text>
            <Text variant="bodyLarge" color={colors.text.secondary} style={styles.subtitle}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </Text>
          </View>

          {/* Form */}
          <GlowCard variant="primary" glow style={styles.card}>
            {isSignUp && (
              <>
                <Text variant="bodyMedium" style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor={colors.text.tertiary}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </>
            )}

            <Text variant="bodyMedium" style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={colors.text.tertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <Text variant="bodyMedium" style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="••••••••"
                placeholderTextColor={colors.text.tertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={24} 
                  color={colors.text.secondary} 
                />
              </TouchableOpacity>
            </View>

            <Button
              title={isSignUp ? 'Create Account' : 'Sign In'}
              variant="primary"
              fullWidth
              loading={loading}
              onPress={isSignUp ? handleSignUp : handleLogin}
              style={styles.button}
            />

            <TouchableOpacity 
              onPress={() => setIsSignUp(!isSignUp)}
              style={styles.switchButton}
            >
              <Text variant="body" color={colors.text.secondary}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              </Text>
              <Text variant="bodyBold" color={colors.accent.pink}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </GlowCard>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <Ionicons name="flash" size={24} color={colors.accent.purple} />
              <Text variant="bodySmall" color={colors.text.secondary}>
                Compare prices instantly
              </Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="notifications" size={24} color={colors.accent.blue} />
              <Text variant="bodySmall" color={colors.text.secondary}>
                Get price drop alerts
              </Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="shield-checkmark" size={24} color={colors.status.success} />
              <Text variant="bodySmall" color={colors.text.secondary}>
                Verify deals authenticity
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.base,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
  },
  card: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.ui.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.base,
    ...typography.variants.body,
    color: colors.text.primary,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },
  button: {
    marginTop: spacing.base,
  },
  switchButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  features: {
    gap: spacing.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.base,
  },
});
