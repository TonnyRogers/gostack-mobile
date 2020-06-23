import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';

import api from '../../../services/api';
import Background from '../../../components/Background';
import { Container, Avatar, Name, Time, SubmitButton } from './styles';

const Confirm = ({ route }) => {
  const navigation = useNavigation();

  const { provider } = route.params;
  const { time } = route.params;

  const dateFormatted = useMemo(
    () =>
      formatRelative(parseISO(time), new Date(), {
        locale: pt,
      }),
    [time]
  );

  navigation.setOptions({
    title: 'Confirme Agendamento',
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

  async function handleAddPointment() {
    await api.post('appointments', {
      provider_id: provider.id,
      date: time,
    });

    navigation.navigate('Dashboard');
  }

  return (
    <Background>
      <Container>
        <Avatar
          source={{
            uri: provider.avatar
              ? provider.avatar.url
              : `https://api.adorable.io/avatar/50/${provider.name}.png`,
          }}
        />
        <Name>{provider.name}</Name>
        <Time>{dateFormatted}</Time>
        <SubmitButton onPress={handleAddPointment}>Confirmar</SubmitButton>
      </Container>
    </Background>
  );
};

export default Confirm;
