
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 375;
const SCALE = SCREEN_WIDTH / DESIGN_WIDTH;
const scale = (size: number) => size * SCALE;

interface SearchBarProps {
  placeholder?: string;
}

export const SearchBarComponent = ({ 
  placeholder = "Search recipes, places, family..." 
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#828282"
        value={searchValue}
        onChangeText={setSearchValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: scale(32),
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(44),
  },
  searchIcon: {
    fontSize: scale(18),
    marginRight: scale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: scale(14),
    color: '#000',
    padding: 0,
  },
});