import * as React from 'react';
import { Searchbar } from 'react-native-paper';

const MyComponent = ({placeholder , onChangeSearch , searchQuery}) => {
  

  return (
    <Searchbar 
      placeholder={placeholder}
      onChangeText={onChangeSearch}
      value={searchQuery}
      onStartShouldSetResponder={()=>setClicked(false)}
    />
  );
};

export default MyComponent;
