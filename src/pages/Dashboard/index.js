import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigationFocus } from '@react-navigation/compat';
import { Container, Title, List } from './styles';

import api from '../../services/api';
import Background from '../../components/Background';
import Appointment from '../../components/Appointment';

const data = [1, 2, 3, 4, 5, 6, 7];

function Dashboard({ isFocused }) {
  const [appointments, setAppointments] = useState([]);
  const navigation = useNavigation();

  navigation.setOptions({
    title: 'Agendamentos',
    tabBarIcon: ({ color }) => <Icon name="event" size={20} color={color} />,
  });

  async function getAppointments() {
    const response = await api.get('appointments');

    setAppointments(response.data);
  }

  useEffect(() => {
    if (isFocused) {
      getAppointments();
    }
  }, [isFocused]);

  async function handleCancel(id) {
    const response = await api.delete(`appointments/${id}`);

    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, canceled_at: response.data.canceled_at }
          : appointment
      )
    );
  }

  return (
    <Background>
      <Container>
        <Title>Agendamentos</Title>

        <List
          data={appointments}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Appointment onCancel={() => handleCancel(item.id)} data={item} />
          )}
        />
      </Container>
    </Background>
  );
}

export default withNavigationFocus(Dashboard);
