import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface ExportPasswordsModalProps {
  visible: boolean;
  onClose: () => void;
  passwords: any[];
}

export function ExportPasswordsModal({ visible, onClose, passwords }: ExportPasswordsModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const resetState = () => {
    setPassword('');
    setError('');
    setIsExporting(false);
    setIsPasswordVerified(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const verifyPassword = async () => {
    if (!password.trim()) {
      setError('Please enter the access password');
      return;
    }

    try {
      const storedPassword = await AsyncStorage.getItem('accessPassword');
      const defaultPassword = 'admin';

      if (password === (storedPassword || defaultPassword)) {
        setIsPasswordVerified(true);
        setError('');
        exportPasswords();
      } else {
        setError('Error password');
      }
    } catch (error) {
      console.error('Password verification failed:', error);
      setError('Verification failed, please try again');
    }
  };

  const exportPasswords = async () => {
    setIsExporting(true);

    try {
      // Android
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage permissions required',
            message: 'Exporting passwords requires access to your file storage',
            buttonNeutral: 'Ask me later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert('Permission denied', 'Cannot export password because the app does not have permission to access the storage');
          setIsExporting(false);
          return;
        }
      }

      //  CSV 
      let csvContent = 'name, account, password, email, note\n';

      passwords.forEach(pwd => {
        const escapedName = pwd.name ? `"${pwd.name.replace(/"/g, '""')}"` : '';
        const escapedUsername = pwd.username ? `"${pwd.username.replace(/"/g, '""')}"` : '';
        const escapedPassword = pwd.password ? `"${pwd.password.replace(/"/g, '""')}"` : '';
        const escapedEmail = pwd.email ? `"${pwd.email.replace(/"/g, '""')}"` : '';
        const escapedNote = pwd.note ? `"${pwd.note.replace(/"/g, '""')}"` : '';

        csvContent += `${escapedName},${escapedUsername},${escapedPassword},${escapedEmail},${escapedNote}\n`;
      });

      const timestamp = new Date().getTime();
      const fileName = `Password backup${timestamp}.csv`;

      //  Expo FileSystem 
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });

      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        //Expo Sharing
        await Sharing.shareAsync(fileUri);
        Alert.alert('Exported successfully', `Password has been exported to file: ${fileName}`);
      } else {
        Alert.alert('Error', 'File sharing is not supported on this device');
      }
    } catch (error) {
      console.error('Export password failed:', error);
      Alert.alert('Export failed', 'An error occurred while exporting the password, please try again');
    } finally {
      setIsExporting(false);
      handleClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {isExporting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={styles.loadingText}>正在导出密码...</Text>
            </View>
          ) : !isPasswordVerified ? (
            <>
              <Text style={styles.title}>Export password</Text>
              <Text style={styles.subtitle}>
                Please enter the access password to export all your password data to the CSV file
              </Text>

              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                placeholder="Please enter access password"
                placeholderTextColor="#999"
                secureTextEntry
                autoFocus
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                >
                  <Text style={styles.buttonText}>取消</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.exportButton]}
                  onPress={verifyPassword}
                >
                  <Text style={styles.buttonText}>导出</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.exportNote}>
                The exported file will be saved in CSV format and can be opened by Excel and other software.
              </Text>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10
  },
  input: {
    height: 55,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9'
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 3
  },
  cancelButton: {
    backgroundColor: '#ff4444'
  },
  exportButton: {
    backgroundColor: '#4CAF50'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  exportNote: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333'
  }
}); 