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
import Icon from 'react-native-vector-icons/Ionicons';
import { UserContext } from '../context/UserContext';

const ChangePasswordScreen = ({ navigation }) => {
    const { changePassword } = useContext(UserContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

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
        if (!currentPassword) {
            setError('Please enter your current password');
            return false;
        }

        const strengthCheck = checkPasswordStrength(newPassword);
        setPasswordStrength(strengthCheck.message);

        if (strengthCheck.strength === 'weak') {
            setError(strengthCheck.message);
            return false;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return false;
        }

        if (currentPassword === newPassword) {
            setError('New password must be different from current password');
            return false;
        }

        return true;
    };

    const handleChangePassword = async () => {
        if (!validatePassword()) return;

        try {
            setLoading(true);
            setError('');
            
            await changePassword(currentPassword, newPassword);

            Alert.alert(
                'Success',
                'Password changed successfully!',
                [{
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }]
            );
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to change password';
            setError(errorMessage);
            
            if (error.response?.status === 401) {
                setError('Current password is incorrect');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderPasswordInput = (
        value,
        setValue,
        placeholder,
        showValue,
        setShowValue,
        isNewPassword = false
    ) => (
        <Input
            placeholder={placeholder}
            value={value}
            onChangeText={(text) => {
                setValue(text);
                if (isNewPassword) {
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
            errorStyle={{ 
                color: isNewPassword && passwordStrength.includes('Strong') 
                    ? '#4CAF50' 
                    : '#ff6b6b' 
            }}
            errorMessage={isNewPassword ? passwordStrength : ''}
        />
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <RNText style={styles.title}>Change Password</RNText>
            <View style={styles.placeholder} />
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.container}>
                {renderHeader()}
                
                {error && <RNText style={styles.error}>{error}</RNText>}

                <View style={styles.formContainer}>
                    {renderPasswordInput(
                        currentPassword,
                        setCurrentPassword,
                        'Current Password',
                        showCurrentPassword,
                        setShowCurrentPassword
                    )}
                    {renderPasswordInput(
                        newPassword,
                        setNewPassword,
                        'New Password',
                        showNewPassword,
                        setShowNewPassword,
                        true
                    )}
                    {renderPasswordInput(
                        confirmPassword,
                        setConfirmPassword,
                        'Confirm New Password',
                        showConfirmPassword,
                        setShowConfirmPassword
                    )}
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <Button
                    title="Change Password"
                    onPress={handleChangePassword}
                    loading={loading}
                    containerStyle={styles.buttonContainer}
                    buttonStyle={styles.button}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
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
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    buttonContainer: {
        marginTop: 10,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
    },
});

export default ChangePasswordScreen;