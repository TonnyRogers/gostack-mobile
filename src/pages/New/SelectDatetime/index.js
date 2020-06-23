import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import api from '../../../services/api';

import { Container, HourList, Hour, Title } from './styles';
import Background from '../../../components/Background';
import DateInput from '../../../components/DateInput';

export default function SelectDatetime({ route }) {
  const navigation = useNavigation();

  navigation.setOptions({
    title: 'Selecione o horário',
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name="chevron-left" size={35} color="#FFF" />
      </TouchableOpacity>
    ),
  });

  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState([]);
  const { provider } = route.params;

  useEffect(() => {
    async function loadAvailable() {
      const response = await api.get(`providers/${provider.id}/available`, {
        params: {
          date: date.getTime(),
        },
      });

      setHours(response.data);
    }

    loadAvailable();
  }, [date, provider.id]);

  function handleHour(time) {
    navigation.navigate('Confirm', {
      provider,
      time,
    });
  }

  return (
    <Background>
      <Container>
        <DateInput date={date} onChange={setDate} />

        <HourList
          data={hours}
          keyExtractor={(item) => String(item.time)}
          renderItem={({ item }) => (
            <Hour
              enabled={item.available}
              onPress={() => handleHour(item.value)}
            >
              <Title>{item.time}</Title>
            </Hour>
          )}
        />
      </Container>
    </Background>
  );
}
