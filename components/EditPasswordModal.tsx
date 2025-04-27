import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { databaseService, Password } from '../services/DatabaseService';

interface EditPasswordModalProps {
  visible: boolean;
  password: Password | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditPasswordModal({ visible, password, onClose, onUpdate }: EditPasswordModalProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (password) {
      setName(password.name);
      setUsername(password.username);
      setPasswordValue(password.password);
      setEmail(password.email);
      setNote(password.note);
    }
  }, [password]);

  const handleUpdate = async () => {
    if (!password) return;
    
    if (!name.trim() || !username.trim() || !passwordValue.trim()) {
      Alert.alert('Error', 'Name, account and password cannot be empty');
      return;
    }

    try {
      await databaseService.updatePassword(password.id, {
        name,
        username,
        password: passwordValue,
        email,
        note
      });
      onUpdate();
      onClose();
      Alert.alert('Successful', 'Password updated');
    } catch (error) {
      Alert.alert('Error', 'Password update failed');    
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Edit Password</Text>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Please enter a Name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>账号 *</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Please enter your account number"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>密码 *</Text>
              <TextInput
                style={styles.input}
                value={passwordValue}
                onChangeText={setPasswordValue}
                placeholder="Please enter your password"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMail</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Please enter your email address"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Remark</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={note}
                onChangeText={setNote}
                placeholder="Please enter a note"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.buttonUpdate]}
              onPress={handleUpdate}
            >
              <Text style={styles.buttonText}>renew</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  scrollView: {
    marginBottom: 20
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  multilineInput: {
    height: 80,
    paddingTop: 8
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    elevation: 2
  },
  buttonCancel: {
    backgroundColor: '#ff4444'
  },
  buttonUpdate: {
    backgroundColor: '#4CAF50'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500'
  }
}); 