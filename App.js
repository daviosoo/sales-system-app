import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SellersScreen from './screens/SellersScreen';
import SalesScreen from './screens/SalesScreen';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FlashMessage from "react-native-flash-message";


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarStyle: {paddingVertical: 10, marginBottom:10}
      }}>
        <Tab.Screen name="Sellers" component={SellersScreen} options={{
          tabBarLabel: 'Sellers',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}/>
        <Tab.Screen name="Sales" component={SalesScreen} options={{
          tabBarLabel: 'Sales',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cash-fast" color={color} size={size} />
          ),
        }}/>
      </Tab.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
