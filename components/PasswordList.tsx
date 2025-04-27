import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Clipboard, ActivityIndicator } from 'react-native';
import { usePasswordContext } from '../contexts/PasswordContext';
import { EditPasswordModal } from './EditPasswordModal';
import { Password } from '../services/DatabaseService';
import { AddPasswordButton } from './AddPasswordButton';
import { ImportModal } from './ImportModal';
import { ExportPasswordsModal } from './ExportPasswordsModal';
import { AddPasswordModal } from './AddPasswordModal';

export function PasswordList() {
  const { filteredPasswords, isLoading, deletePassword, refreshPasswords, addPassword } = usePasswordContext();
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    refreshPasswords();
  }, [refreshPasswords]);

  const handleEdit = (password: Password) => {
    setSelectedPassword(password);
    setIsEditModalVisible(true);
  };

  const handleDelete = (password: Password) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${password.name}"? `,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePassword(password.id);
              Alert.alert('Successful', 'Password deleted');
            } catch (error) {
              Alert.alert('Error', 'Password Delete Failed');
            }
          }
        }
      ]
    );
  };

  const handleLongPress = (password: Password) => {
    Alert.alert(
      'Copy Options',
      `Select the content to copy: ${password.name}`,
      [
        {
          text: 'Copy account',
          onPress: async () => {
            await Clipboard.setString(password.username);
            Alert.alert('Success', 'Account has been copied to clipboard');
          }
        },
        {
          text: 'Copy password',
          onPress: async () => {
            await Clipboard.setString(password.password);
            Alert.alert('Success', 'Password copied to clipboard');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Password }) => (
    <TouchableOpacity
      style={styles.passwordItem}
      onLongPress={() => handleLongPress(item)}
      delayLongPress={500}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>account:</Text>
            <Text style={styles.value}>{item.username}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>password:</Text>
            <Text style={styles.value}>{item.password}</Text>
          </View>
          {item.email ? (
            <View style={styles.detailRow}>
              <Text style={styles.label}>email:</Text>
              <Text style={styles.value}>{item.email}</Text>
            </View>
          ) : null}

          {item.note ? (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Remark:</Text>
              <Text style={styles.value} numberOfLines={2}>{item.note}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.buttonText}>edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.buttonText}>delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No password record yet</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPasswords}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
        onRefresh={refreshPasswords}
        refreshing={isLoading}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
      />
      <AddPasswordButton
        onImportPress={() => setIsImportModalVisible(true)}
        onExportPress={() => setIsExportModalVisible(true)}
        onAddPress={() => setIsAddModalVisible(true)}
      />
      <EditPasswordModal
        visible={isEditModalVisible}
        password={selectedPassword}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedPassword(null);
        }}
        onUpdate={refreshPasswords}
      />
      <ImportModal
        isVisible={isImportModalVisible}
        onClose={() => setIsImportModalVisible(false)}
        onImport={async (data) => {
          try {
            for (const item of data) {
              await addPassword({
                name: item.title,
                username: item.username,
                password: item.password,
                email: item.email || '',
                note: item.notes || '',
                url: item.url || ''
              });
            }
            Alert.alert('Successful', 'Password import successfully');
            refreshPasswords();
          } catch (error) {
            Alert.alert('Error', 'Error occurred while importing password');
          }
        }}
      />
      <ExportPasswordsModal
        visible={isExportModalVisible}
        onClose={() => setIsExportModalVisible(false)}
        passwords={filteredPasswords}
      />
      <AddPasswordModal
        visible={isAddModalVisible}
        onDismiss={() => setIsAddModalVisible(false)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    flex: 1
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 80
  },
  passwordItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  contentContainer: {
    flex: 1,
    marginRight: 8
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  detailsContainer: {
    flex: 1
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start'
  },
  label: {
    width: 45,
    fontSize: 14,
    color: '#666',
    marginRight: 8
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#333'
  },
  buttonContainer: {
    justifyContent: 'center'
  },
  button: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    minWidth: 60,
    alignItems: 'center'
  },
  editButton: {
    backgroundColor: '#2196F3'
  },
  deleteButton: {
    backgroundColor: '#ff4444'
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    color: '#666'
  },
});