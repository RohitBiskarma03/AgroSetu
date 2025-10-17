import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { ThemedText } from "../../components/ui/themed-text";
import { ThemedView } from "../../components/ui/themed-view";
import useThemeColor from "../../hooks/use-theme-color";
import { spacing, fontSizes, lightColors } from "../../constants/theme";
import { AuthContext } from "../../context/AuthContext";
import { HelloWave } from "../../components/ui/hello-wave";

type FormData = {
  phoneNumber: string;
  role: "Admin" | "Dealer" | "Farmer" | "";
};

const OTP_LENGTH = 6;

export function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: { phoneNumber: "", role: "" },
  });
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const primaryColor = useThemeColor("primary");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const { login } = useContext(AuthContext);

  const phoneNumber = watch("phoneNumber");
  const role = watch("role");

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [otpCountdown]);

  function onSubmit(data: FormData) {
    if (!data.role) {
      Alert.alert("Validation Error", "Please select a user role.");
      return;
    }
    if (!data.phoneNumber.match(/^\d{10}$/)) {
      Alert.alert("Validation Error", "Phone number must be 10 digits.");
      return;
    }
    sendOtp(data.phoneNumber, data.role);
  }

  async function sendOtp(phoneNumber: string, role: FormData["role"]) {
    setIsSendingOTP(true);
    try {
      // Call API to send OTP here, mock delay for demo:
      await new Promise((res) => setTimeout(res, 1500));
      setOtpSent(true);
      setOtpCountdown(60);
      Alert.alert("OTP Sent", `An OTP has been sent to ${phoneNumber}`);
    } catch {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  }

  async function verifyOtp() {
    if (enteredOTP.length !== OTP_LENGTH) {
      Alert.alert("Validation Error", `OTP must be ${OTP_LENGTH} digits.`);
      return;
    }
    setIsVerifyingOTP(true);
    try {
      // Call OTP verification API here, mock success:
      await new Promise((res) => setTimeout(res, 1500));
      await login(role);
    } catch {
      Alert.alert("Error", "OTP verification failed. Please try again.");
    } finally {
      setIsVerifyingOTP(false);
    }
  }

  function resendOtp() {
    if (otpCountdown > 0) {
      Alert.alert("Please wait", `You can resend OTP in ${otpCountdown} seconds.`);
      return;
    }
    if (!phoneNumber || !role) {
      Alert.alert("Validation Error", "Please enter phone number and select role.");
      return;
    }
    sendOtp(phoneNumber, role);
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.innerContainer}
      >
        <ThemedText style={[styles.title, { color: textColor }]}>
          Welcome to AgroSetuFarmFix <HelloWave size={32} />
        </ThemedText>

        {!otpSent && (
          <>
            <ThemedText style={[styles.label, { color: textColor }]}>Select Role</ThemedText>
            <View style={styles.roleContainer}>
              {(["Admin", "Dealer", "Farmer"] as FormData["role"][]).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.roleButton,
                    role === r && { backgroundColor: primaryColor },
                    { borderColor: primaryColor },
                  ]}
                  onPress={() => control.setValue("role", r)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: role === r }}
                >
                  <ThemedText style={role === r ? styles.roleSelectedText : styles.roleText}>{r}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            {errors.role && <ThemedText style={styles.errorText}>{errors.role.message}</ThemedText>}

            <ThemedText style={[styles.label, { color: textColor }]}>Phone Number</ThemedText>
            <Controller
              control={control}
              name="phoneNumber"
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone number must be 10 digits",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { borderColor: primaryColor, color: textColor }]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                  placeholderTextColor={lightColors.secondary}
                  accessibilityLabel="Phone number input"
                />
              )}
            />
            {errors.phoneNumber && <ThemedText style={styles.errorText}>{errors.phoneNumber.message}</ThemedText>}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: primaryColor }]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSendingOTP}
              accessibilityRole="button"
              accessibilityLabel="Send OTP"
            >
              {isSendingOTP ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Send OTP</ThemedText>
              )}
            </TouchableOpacity>
          </>
        )}

        {otpSent && (
          <>
            <ThemedText style={[styles.label, { color: textColor }]}>Enter OTP</ThemedText>
            <TextInput
              style={[styles.input, { borderColor: primaryColor, color: textColor }]}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              value={enteredOTP}
              onChangeText={setEnteredOTP}
              placeholder="Enter OTP"
              placeholderTextColor={lightColors.secondary}
              accessibilityLabel="OTP input"
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: primaryColor }]}
              onPress={verifyOtp}
              disabled={isVerifyingOTP}
              accessibilityRole="button"
              accessibilityLabel="Verify OTP"
            >
              {isVerifyingOTP ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Verify OTP</ThemedText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={resendOtp}
              disabled={otpCountdown > 0}
              accessibilityRole="button"
              accessibilityLabel="Resend OTP"
              style={styles.resendContainer}
            >
              <ThemedText style={{ color: primaryColor }}>
                {otpCountdown > 0 ? `Resend OTP in ${otpCountdown}s` : "Resend OTP"}
              </ThemedText>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flex: 1,
    padding: spacing.md,
    justifyContent: "center",
  },
  title: {
    fontSize: fontSizes.xlarge,
    fontWeight: "700",
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  label: {
    fontSize: fontSizes.medium,
    marginBottom: spacing.xs,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.md,
  },
  roleButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleText: {
    fontSize: fontSizes.medium,
    color: "#555",
  },
  roleSelectedText: {
    fontSize: fontSizes.medium,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: fontSizes.medium,
    marginBottom: spacing.md,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: fontSizes.medium,
  },
  resendContainer: {
    alignItems: "center",
    marginTop: spacing.sm,
  },
  errorText: {
    color: "#E63946",
    marginBottom: spacing.sm,
  },
});
