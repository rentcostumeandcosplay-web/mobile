import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Đăng nhập</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Nhập số điện thoại</Text>
          <Text style={styles.subtitle}>
            Dùng số điện thoại để đăng nhập hoặc đăng ký tài khoản tại OneHousing Pro
          </Text>

          {/* Input Field */}
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại của bạn"
            placeholderTextColor="#C7C7CD"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            autoFocus={true}
          />
        </View>

        {/* Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.button, 
              { backgroundColor: phoneNumber.length > 9 ? '#000' : '#E8E8E8' }
            ]}
            disabled={phoneNumber.length <= 9}
          >
            <Text style={[
              styles.buttonText, 
              { color: phoneNumber.length > 9 ? '#FFF' : '#AFAFAF' }
            ]}>
              Tiếp tục
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
    backgroundColor: '#FFF',
  },
  inner: {
    flex: 1,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 30,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingVertical: 10,
    color: '#000',
  },
  footer: {
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  button: {
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
