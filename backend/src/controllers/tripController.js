import { randomUUID } from 'node:crypto';
import { createTrip, listTripsForUser } from '../services/storageService.js';

const isValidLocation = location => {
  const { latitude, longitude } = location?.coordinates || {};
  return typeof location?.name === 'string' && location.name.trim().length > 0 &&
    Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
    Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
};

export const listUserTrips = (req, res) => {
  return res.status(200).json({
    status: 'success',
    data: { trips: listTripsForUser(req.user.id) }
  });
};

export const saveUserTrip = (req, res) => {
  const trip = req.body || {};
  const numericFields = [trip.durationMinutes, trip.distanceKm, trip.aqi];
  if (
    !isValidLocation(trip.origin) || !isValidLocation(trip.destination) ||
    typeof trip.routeId !== 'string' || trip.routeId.length > 80 ||
    !numericFields.every(Number.isFinite) || trip.durationMinutes <= 0 ||
    trip.distanceKm <= 0 || trip.aqi < 0 || trip.aqi > 500 ||
    (trip.pm25UgM3 !== undefined && (!Number.isFinite(trip.pm25UgM3) || trip.pm25UgM3 < 0)) ||
    (trip.exposureReductionPercent !== undefined &&
      (!Number.isFinite(trip.exposureReductionPercent) || trip.exposureReductionPercent < 0 || trip.exposureReductionPercent > 100))
  ) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_TRIP',
      message: 'Data perjalanan tidak valid.'
    });
  }

  const completedAt = trip.completedAt && Number.isFinite(Date.parse(trip.completedAt))
    ? new Date(trip.completedAt).toISOString()
    : new Date().toISOString();
  const startedAt = trip.startedAt && Number.isFinite(Date.parse(trip.startedAt))
    ? new Date(trip.startedAt).toISOString()
    : completedAt;

  const savedTrip = createTrip({
    ...trip,
    id: randomUUID(),
    userId: req.user.id,
    startedAt,
    completedAt,
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({ status: 'success', data: { trip: savedTrip } });
};