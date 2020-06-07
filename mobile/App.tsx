import React from 'react';
import { AppLoading } from 'expo'
import { StatusBar } from 'react-native';

// Fonts
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu'
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto'

//Rotas- paginas
import Routes from './src/routes'

export default function App() {

  // Instalando fonts
  const [fontsLoaded] = useFonts({
      Roboto_400Regular,
      Roboto_500Medium,
      Ubuntu_700Bold,
  })
  // Enquanto a fonte nao eh carregada
  if(!fontsLoaded){
    return <AppLoading/>
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      <Routes/>
    </>
  );
}