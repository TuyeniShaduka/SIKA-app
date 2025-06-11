import React, { useState, useContext } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function SignUpScreen() {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "freelancer", // Default role
	});
	const [isLoading, setIsLoading] = useState(false);

	const { signup } = useContext(AuthContext);
	const navigation = useNavigation();

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};


	const validateEmail = (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

const handleSignUp = async () => {
  if (!formData.fullName.trim()) {
    Alert.alert("Error", "Please enter your first and last name");
    return;
  }

  if (!validateEmail(formData.email)) {
    Alert.alert("Error", "Please enter a valid email address");
    return;
  }

  if (formData.password.length < 6) {
    Alert.alert("Error", "Your password should be at least 6 characters");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    Alert.alert("Error", "Passwords do not match");
    return;
  }

  setIsLoading(true);
  try {
    const { email, password, role, fullName } = formData;
    const userCredential = await signup(email, password, role, fullName);
    const user = userCredential.user;

    if (role === "employer") {
      // Create employer document
      await addDoc(collection(db, "employers"), {
        email: email,
        userName: fullName,
        userId: user.uid,
      });
    }
  } catch (error) {
    Alert.alert(
      "Signup Error",
      error.message || "An error occurred during signup"
    );
  } finally {
    setIsLoading(false);
  }
};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardAvoidingView}
			>
				<View style={styles.form}>
					<TextInput
						style={styles.input}
						placeholder="Full Name"
						value={formData.fullName}
						onChangeText={(value) => handleInputChange("fullName", value)}
						accessibilityLabel="Full Name Input"
					/>

					<TextInput
						style={styles.input}
						placeholder="Email"
						value={formData.email}
						onChangeText={(value) => handleInputChange("email", value)}
						keyboardType="email-address"
						autoCapitalize="none"
						accessibilityLabel="Email Input"
					/>

					<TextInput
						style={styles.input}
						placeholder="Password"
						value={formData.password}
						onChangeText={(value) => handleInputChange("password", value)}
						secureTextEntry
						accessibilityLabel="Password Input"
					/>

					<TextInput
						style={styles.input}
						placeholder="Confirm Password"
						value={formData.confirmPassword}
						onChangeText={(value) => handleInputChange("confirmPassword", value)}
						secureTextEntry
						accessibilityLabel="Confirm Password Input"
					/>

					<View style={styles.roleContainer}>
						<TouchableOpacity
							style={[
								styles.roleButton,
								formData.role === "freelancer" && styles.selectedRole,
							]}
							onPress={() => handleInputChange("role", "freelancer")}
							accessibilityLabel="Select Freelancer Role"
							accessibilityRole="button"
						>
							<Text
								style={[
									styles.roleText,
									formData.role === "freelancer" && styles.selectedRoleText,
								]}
							>
								Freelancer
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.roleButton,
								formData.role === "employer" && styles.selectedRole,
							]}
							onPress={() => handleInputChange("role", "employer")}
							accessibilityLabel="Select Employer Role"
							accessibilityRole="button"
						>
							<Text
								style={[
									styles.roleText,
									formData.role === "employer" && styles.selectedRoleText,
								]}
							>
								Employer
							</Text>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						style={styles.signUpButton}
						onPress={handleSignUp}
						disabled={isLoading}
						accessibilityLabel="Create Account Button"
					>
						{isLoading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={styles.signUpButtonText}>Create Account</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => navigation.navigate("Login")}
						style={{ marginTop: 20, alignItems: "center" }}
						accessibilityLabel="Already have an account? Sign In"
					>
						<Text style={{ color: "#007AFF" }}>
							Already have an account? Sign In
						</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FCFFEE",
		justifyContent: "center",
	},
	keyboardAvoidingView: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	form: {
		backgroundColor: "#fff",
		padding: 30,
		borderRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
	input: {
		fontSize: 16,
		color: "#333",
		marginBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
		paddingBottom: 8,
	},
	signUpButton: {
		backgroundColor: "#007AFF",
		borderRadius: 25,
		paddingVertical: 15,
		alignItems: "center",
		opacity: 1,
	},
	signUpButtonDisabled: {
		opacity: 0.5,
	},
	signUpButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	roleContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 20,
	},
	roleButton: {
		backgroundColor: "#ddd",
		padding: 10,
		borderRadius: 5,
		width: "40%",
		alignItems: "center",
	},
	selectedRole: {
		backgroundColor: "#007AFF",
	},
	roleText: {
		color: "#333",
		fontSize: 16,
	},
	selectedRoleText: {
		color: "#fff",
	},
});
