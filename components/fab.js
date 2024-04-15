import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

const MyFAB = ({onPress}) => (
  <FAB
    icon="delete"
    size='small'
    color='white'
    style={styles.fab}
    onPress={onPress}
  />
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    marginEnd: 16,
    marginTop: 10,
    backgroundColor:'red',
    right: 0,
    top:0,
  },
})

export default MyFAB;