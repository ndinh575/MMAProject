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
import CustomDatePicker from './CustomDatePicker';

const RegisterScreen = ({ navigation }) => {
  const { createUser, sendOTP, verifyOTP } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    gender: 'male',
    dob: new Date(),
    address: {
      formattedAddress: '',
      subregion: '',
      region: '', 
      country: '',
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phoneNumber) {
      setError('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!formData.email.match(/.+@.+\..+/)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
      setError('Please enter a valid phone number');
      return false;
    }
    const age = calculateAge(formData.dob);
    if (age < 16) {
      setError('You must be at least 16 years old to register');
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    try {
      if (!validateForm()) return;
      
      setLoading(true);
      setError('');
      await sendOTP(formData.email);
      setOtpSent(true);
      setShowOTPInput(true);
      setOtpTimer(300); // 5 minutes in seconds
      
      // Start OTP timer
      const timer = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      Alert.alert('Success', 'OTP sent to your email!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (!otp || otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }

      setLoading(true);
      setError('');
      await verifyOTP(formData.email, otp);
      await handleRegister();
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');

      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        dob: formData.dob,
        address: formData.address
      };

      await createUser(userData);
      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('Login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateConfirm = (date) => {
    setFormData(prev => ({
      ...prev,
      dob: date
    }));
    setShowDatePicker(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <RNText style={[styles.title, { fontSize: 24 }]}>Create Account</RNText>
      <View style={styles.placeholder} />
    </View>
  );

  const renderGenderButton = (value, icon) => (
    <TouchableOpacity
      style={[
        styles.genderButton,
        formData.gender === value && styles.genderButtonActive
      ]}
      onPress={() => handleInputChange('gender', value)}
    >
      <Icon
        name={icon}
        size={20}
        color={formData.gender === value ? '#fff' : '#007bff'}
      />
      <RNText style={[
        styles.genderButtonText,
        formData.gender === value && styles.genderButtonTextActive
      ]}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </RNText>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      
      {error ? <RNText style={styles.error}>{error}</RNText> : null}

      <Input
        placeholder="Full Name"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        leftIcon={{ type: 'ionicon', name: 'person-outline' }}
        containerStyle={styles.inputContainer}
      />

      <Input
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
        leftIcon={{ type: 'ionicon', name: 'mail-outline' }}
        containerStyle={styles.inputContainer}
      />

      <Input
        placeholder="Password"
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry
        leftIcon={{ type: 'ionicon', name: 'lock-closed-outline' }}
        containerStyle={styles.inputContainer}
      />

      <Input
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        secureTextEntry
        leftIcon={{ type: 'ionicon', name: 'lock-closed-outline' }}
        containerStyle={styles.inputContainer}
      />

      <Input
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChangeText={(value) => handleInputChange('phoneNumber', value)}
        keyboardType="phone-pad"
        leftIcon={{ type: 'ionicon', name: 'call-outline' }}
        containerStyle={styles.inputContainer}
      />

      <View style={styles.dateContainer}>
        <RNText style={styles.label}>Date of Birth</RNText>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon name="calendar-outline" size={20} color="#007bff" style={styles.dateIcon} />
          <RNText style={styles.dateButtonText}>{formatDate(formData.dob)}</RNText>
        </TouchableOpacity>
      </View>

      <CustomDatePicker
        isVisible={showDatePicker}
        date={formData.dob}
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
      />

      <View style={styles.genderContainer}>
        <RNText style={styles.label}>Gender</RNText>
        <View style={styles.genderButtons}>
          {renderGenderButton('male', 'male')}
          {renderGenderButton('female', 'female')}
          {renderGenderButton('other', 'person')}
        </View>
      </View>

      {showOTPInput && (
        <View style={styles.otpContainer}>
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
          <Button
            title="Verify OTP"
            onPress={handleVerifyOTP}
            loading={loading}
            containerStyle={styles.otpButtonContainer}
            buttonStyle={styles.otpButton}
          />
        </View>
      )}

      {!showOTPInput ? (
        <Button
          title="Send OTP"
          onPress={handleSendOTP}
          loading={loading}
          containerStyle={styles.registerButtonContainer}
          buttonStyle={styles.registerButton}
        />
      ) : null}

      <Button
        title="Already have an account? Login"
        type="clear"
        onPress={() => navigation.navigate('Login')}
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
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  error: {
    color: '#ff3333',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  genderContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#86939e',
    marginBottom: 10,
    fontWeight: '500',
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff',
    backgroundColor: 'transparent',
  },
  genderButtonActive: {
    backgroundColor: '#007bff',
  },
  genderButtonText: {
    marginLeft: 5,
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  registerButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
  },
  loginButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#007bff',
  },
  dateContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  otpContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  timer: {
    textAlign: 'center',
    color: '#ff6b6b',
    marginVertical: 10,
    fontSize: 14,
  },
  otpButtonContainer: {
    marginTop: 10,
  },
  otpButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
  },
});

export default RegisterScreen;