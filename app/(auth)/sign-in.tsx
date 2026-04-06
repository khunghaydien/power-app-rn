import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TextInput, Text, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { AppInput } from "@/components/ui/AppInput";
import { authService } from "@/services/authService";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);
    const trimmed = email.trim();
    if (!trimmed || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      await authService.signIn({ email: trimmed, password });
      router.replace("/(tabs)");
    } catch(error) {
      console.error(error);
      setError("Sign in failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-100" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow justify-center px-4 py-8"
        >
          <AppCard containerClassName="w-full max-w-md self-center">
            <Card.Content className="gap-4 pt-2">
              <Text variant="headlineSmall" className="mb-1">
                Sign in
              </Text>
              <Text variant="bodyMedium" className="mb-2 text-neutral-600">
                Enter your email and password to continue
              </Text>

              <AppInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                left={
                  <TextInput.Icon icon="email-outline" pointerEvents="none" />
                }
                containerClassName="bg-white"
              />

              <AppInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
                autoComplete="password"
                left={
                  <TextInput.Icon icon="lock-outline" pointerEvents="none" />
                }
                right={
                  <TextInput.Icon
                    icon={secure ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setSecure((s) => !s)}
                    forceTextInputFocus={false}
                  />
                }
                containerClassName="bg-white"
              />

              {error ? (
                <Text variant="bodySmall" className="text-neutral-700">
                  {error}
                </Text>
              ) : null}

              <AppButton
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                containerClassName="mt-2"
              >
                Log in
              </AppButton>
            </Card.Content>
          </AppCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
