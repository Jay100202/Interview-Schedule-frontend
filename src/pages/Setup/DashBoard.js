import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Card,
  CardBody,
  Container
} from 'reactstrap';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const InterviewScheduler = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: null,
    end: null
  });

  // Get JWT token from localStorage
  const token = localStorage.getItem('token');

  // Configure axios headers
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL_INTERVIEW,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  useEffect(() => {
    fetchTimeslots();
  }, []);

  const fetchTimeslots = async () => {
    try {
      const response = await api.get('/api/timeslots');
      const formattedEvents = response.data.map(event => ({
        id: event._id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        description: event.description
      }));
      setEvents(formattedEvents);
    } catch (err) {
      setError('Failed to fetch timeslots');
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setFormData({
      title: '',
      description: '',
      start,
      end
    });
    setModalOpen(true);
    setEditMode(false);
  };

  const handleSelectEvent = event => {
    setFormData({
      id: event.id,
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end
    });
    setEditMode(true);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const timeslotData = {
        title: formData.title,
        description: formData.description,
        start: formData.start,
        end: formData.end
      };

      if (editMode) {
        await api.put(`/api/timeslots/${formData.id}`, timeslotData);
      } else {
        await api.post('/api/timeslots', timeslotData);
      }

      fetchTimeslots();
      setModalOpen(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/timeslots/${formData.id}`);
      fetchTimeslots();
      setModalOpen(false);
    } catch (err) {
      setError('Failed to delete timeslot');
    }
  };

  return (
    <Container fluid style={{ padding: '20px' }}>
      <Card className="mt-4" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <CardBody>
          <div style={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              style={{ borderRadius: '8px', padding: '15px', backgroundColor: '#f8f9fa' }}
            />
          </div>

          <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} centered>
            <ModalHeader toggle={() => setModalOpen(false)}>
              {editMode ? 'Edit Interview Slot' : 'Create Interview Slot'}
            </ModalHeader>
            <ModalBody>
              {error && <Alert color="danger">{error}</Alert>}
              <Form>
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{ borderRadius: '5px' }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Description</Label>
                  <Input
                    type="textarea"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    style={{ borderRadius: '5px' }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Start Time</Label>
                  <Input
                    type="datetime-local"
                    value={moment(formData.start).format('YYYY-MM-DDTHH:mm')}
                    onChange={e => setFormData({ ...formData, start: new Date(e.target.value) })}
                    style={{ borderRadius: '5px' }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>End Time</Label>
                  <Input
                    type="datetime-local"
                    value={moment(formData.end).format('YYYY-MM-DDTHH:mm')}
                    onChange={e => setFormData({ ...formData, end: new Date(e.target.value) })}
                    style={{ borderRadius: '5px' }}
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              {editMode && (
                <Button color="danger" onClick={handleDelete} className="mr-auto">
                  Delete
                </Button>
              )}
              <Button color="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleSubmit}>
                {editMode ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </Modal>
        </CardBody>
      </Card>
    </Container>
  );
};

export default InterviewScheduler;