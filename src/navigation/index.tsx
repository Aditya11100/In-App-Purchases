import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/home';

const StackNavigator = createStackNavigator();

const Navigation = () => {
  return (
    <StackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackNavigator.Screen component={Home} name={'Home'} />
    </StackNavigator.Navigator>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
