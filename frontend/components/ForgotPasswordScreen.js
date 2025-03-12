import React, { useState, useContext } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Text as RNText,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { UserContext } from '../context/UserContext';
import Icon from 'react-native-vector-icons/Ionicons';

const ForgotPasswordScreen = ({ navigation }) => {
    const { sendOTP, resetPassword } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const [otpTimer, setOtpTimer] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const checkPasswordStrength = (password) => {
        if (password.length < 8) {
            return { strength: 'weak', message: 'Password must be at least 8 characters' };
        }
        
        let score = 0;
        if (password.match(/[a-z]+/)) score++;
        if (password.match(/[A-Z]+/)) score++;
        if (password.match(/[0-9]+/)) score++;
        if (password.match(/[!@#$%^&*(),.?":{}|<>]+/)) score++;

        if (score === 4) return { strength: 'strong', message: 'Strong password' };
        if (score === 3) return { strength: 'medium', message: 'Medium strength - add more variety' };
        return { strength: 'weak', message: 'Weak password - mix uppercase, lowercase, numbers, and symbols' };
    };

    const validatePassword = () => {
        const strengthCheck = checkPasswordStrength(newPassword);
        setPasswordStrength(strengthCheck.message);

        if (strengthCheck.strength === 'weak') {
            setError(strengthCheck.message);
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const startOTPTimer = () => {
        const timer = setInterval(() => {
            setOtpTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const resetForm = () => {
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setOtpTimer(0);
    };

    const handleSendOTP = async () => {
        if (!validateEmail()) return;

        try {
            setLoading(true);
            setError('');
            await sendOTP(email);
            
            setStep(2);
            setOtpTimer(300);
            startOTPTimer();

            Alert.alert(
                'OTP Sent',
                'A verification code has been sent to your email. Please check your inbox and spam folder.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send OTP';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!validatePassword()) return;
        
        if (!email || !otp || !newPassword) {
            setError('Missing required information');
            return;
        }

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        if (otpTimer === 0) {
            setError('OTP has expired. Please request a new one');
            setStep(1);
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            await resetPassword(email, otp, newPassword);

            Alert.alert(
                'Success',
                'Password reset successfully!',
                [{
                    text: 'OK',
                    onPress: () => {
                        resetForm();
                        navigation.navigate('Login');
                    }
                }]
            );

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            const status = error.response?.status;

            if (!error.response) {
                setError('Network error. Please check your internet connection');
            } else if (errorMessage.includes('OTP')) {
                setError('OTP is invalid or expired. Please request a new one');
                setStep(1);
                setOtpTimer(0);
            } else {
                setError(errorMessage);
                if (status === 401 || status === 400) {
                    setStep(1);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const formatTimer = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <RNText style={styles.title}>Reset Password</RNText>
            <View style={styles.placeholder} />
        </View>
    );

    const renderEmailStep = () => (
        <View style={styles.formContainer}>
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                leftIcon={{ type: 'ionicon', name: 'mail-outline' }}
                containerStyle={styles.inputContainer}
            />
            <Button
                title="Send OTP"
                onPress={handleSendOTP}
                loading={loading}
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.button}
            />
        </View>
    );

    const renderPasswordInput = (value, setValue, placeholder, showValue, setShowValue) => (
        <Input
            placeholder={placeholder}
            value={value}
            onChangeText={(text) => {
                setValue(text);
                if (placeholder.includes('New')) {
                    const strength = checkPasswordStrength(text);
                    setPasswordStrength(strength.message);
                }
            }}
            secureTextEntry={!showValue}
            leftIcon={{ type: 'ionicon', name: 'lock-closed-outline' }}
            rightIcon={
                <TouchableOpacity onPress={() => setShowValue(!showValue)}>
                    <Icon
                        name={showValue ? 'eye-outline' : 'eye-off-outline'}
                        size={24}
                        color="#666"
                    />
                </TouchableOpacity>
            }
            containerStyle={styles.inputContainer}
            errorStyle={{ color: passwordStrength.includes('Strong') ? '#4CAF50' : '#ff6b6b' }}
            errorMessage={placeholder.includes('New') ? passwordStrength : ''}
        />
    );

    const renderPasswordAndOTPStep = () => (
        <View style={styles.formContainer}>
            <Input
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                leftIcon={{ type: 'ionicon', name: 'key-outline' }}
                containerStyle={styles.inputContainer}
            />
            {otpTimer > 0 && (
                <RNText style={styles.timer}>Time remaining: {formatTimer(otpTimer)}</RNText>
            )}
            {otpTimer === 0 && (
                <Button
                    title="Resend OTP"
                    type="clear"
                    onPress={handleSendOTP}
                    loading={loading}
                    containerStyle={styles.resendButtonContainer}
                />
            )}
            {renderPasswordInput(
                newPassword,
                setNewPassword,
                'New Password',
                showPassword,
                setShowPassword
            )}
            {renderPasswordInput(
                confirmPassword,
                setConfirmPassword,
                'Confirm New Password',
                showConfirmPassword,
                setShowConfirmPassword
            )}
            <Button
                title="Reset Password"
                onPress={handleResetPassword}
                loading={loading}
                containerStyle={styles.buttonContainer}
                buttonStyle={[styles.button, { opacity: loading || otpTimer === 0 ? 0.7 : 1 }]}
                disabled={loading || otpTimer === 0}
            />
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {renderHeader()}
            {error && <RNText style={styles.error}>{error}</RNText>}
            {step === 1 && renderEmailStep()}
            {step === 2 && renderPasswordAndOTPStep()}
            <Button
                title="Back to Login"
                type="clear"
                onPress={() => navigation.goBack()}
                containerStyle={styles.loginButtonContainer}
                titleStyle={styles.loginButtonText}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 5,
    },
    placeholder: {
        width: 34,
    },
    title: {
        fontSize: 24,
        color: '#333',
        fontWeight: 'bold',
    },
    error: {
        color: '#ff3333',
        textAlign: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    buttonContainer: {
        marginTop: 10,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
    },
    loginButtonContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    loginButtonText: {
        color: '#007bff',
    },
    timer: {
        textAlign: 'center',
        color: '#ff6b6b',
        marginVertical: 10,
        fontSize: 14,
    },
    resendButtonContainer: {
        marginVertical: 10,
    },
    passwordStrength: {
        marginTop: 5,
        fontSize: 12,
    },
    passwordStrengthWeak: {
        color: '#ff6b6b',
    },
    passwordStrengthMedium: {
        color: '#ffd93d',
    },
    passwordStrengthStrong: {
        color: '#4CAF50',
    },
});

export default ForgotPasswordScreen;