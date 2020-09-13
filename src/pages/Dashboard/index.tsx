import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FiPower, FiClock } from 'react-icons/fi';
import { isToday, format, getHours, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { useAuth } from '../../hooks/auth';

import logo from '../../assets/go-barber-logo.svg';
import noImage from '../../assets/no-image.png';
import api from '../../services/api';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Schedule,
  Content,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

interface MonthAvailability {
  day: number;
  availability: boolean;
}

interface Appointment {
  id: string;
  date: string;
  formattedHour: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailability[]
  >([]);

  useEffect(() => {
    api
      .get(`providers/${user.id}/monthavailability`, {
        params: {
          month: selectedMonth.getMonth() + 1,
          year: selectedMonth.getFullYear(),
        },
      })
      .then(response => setMonthAvailability(response.data));
  }, [user.id, selectedMonth]);

  useEffect(() => {
    api
      .get<Appointment[]>(`appointments/me`, {
        params: {
          day: selectedDate.getDate(),
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
      })
      .then(response => {
        const formatedAppointment = response.data.map(appointment => ({
          ...appointment,
          formattedHour: format(parseISO(appointment.date), 'HH:mm'),
        }));
        setAppointments(formatedAppointment);
      });
  }, [selectedDate]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (!modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback(dateOfMonth => {
    setSelectedMonth(dateOfMonth);
  }, []);

  const unavailableDays = useMemo(() => {
    return monthAvailability
      .filter(day => !day.availability)
      .map(
        unavailableDay =>
          new Date(
            selectedMonth.getFullYear(),
            selectedMonth.getMonth(),
            unavailableDay.day,
          ),
      );
  }, [selectedMonth, monthAvailability]);

  const monthAsString = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR });
  }, [selectedDate]);

  const weekDayAsString = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBR });
  }, [selectedDate]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(
      appointment => getHours(parseISO(appointment.date)) < 12,
    );
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(
      appointment => getHours(parseISO(appointment.date)) >= 12,
    );
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logo} alt="GoBarber" />
          <Profile>
            <img src={user.avatarUrl ?? noImage} alt={user.name} />

            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>
          <button type="submit" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{monthAsString}</span>
            <span>{weekDayAsString}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Atendimento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatarUrl ?? noImage}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.formattedHour}
                </span>
              </div>
            </NextAppointment>
          )}
          <Section>
            <strong>Manhã</strong>
            {morningAppointments.map(morningAppointment => (
              <Appointment key={morningAppointment.id}>
                <span>
                  <FiClock />
                  {morningAppointment.formattedHour}
                </span>
                <div>
                  <img
                    src={morningAppointment.user.avatarUrl ?? noImage}
                    alt={morningAppointment.user.name}
                  />
                  <strong>{morningAppointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
            <strong>Tarde</strong>
            {afternoonAppointments.map(afternoonAppointment => (
              <Appointment key={afternoonAppointment.id}>
                <span>
                  <FiClock />
                  {afternoonAppointment.formattedHour}
                </span>
                <div>
                  <img
                    src={afternoonAppointment.user.avatarUrl ?? noImage}
                    alt={afternoonAppointment.user.name}
                  />
                  <strong>{afternoonAppointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...unavailableDays]}
            modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5] } }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
