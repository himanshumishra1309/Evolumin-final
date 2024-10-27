'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaTimes } from 'react-icons/fa'

// Custom hook for getting user's location
const useGeoLocation = () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        setError('Unable to retrieve your location')
      }
    )
  }, [])

  return { location, error }
}

// Custom component to update map view when location changes
function ChangeView({ center }) {
  const map = useMap()
  map.setView(center, map.getZoom())
  return null
}

// Custom ambulance icon
const ambulanceIcon = new L.Icon({
  iconUrl: '/placeholder.svg?height=40&width=40',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})

export default function TrackAmb({ isVisible, onClose, onCancel }) {
  const { location, error } = useGeoLocation()
  const [ambulanceLocation, setAmbulanceLocation] = useState(null)
  const [route, setRoute] = useState(null)
  const [estimatedTime, setEstimatedTime] = useState(null)
  const [isArrived, setIsArrived] = useState(false)
  const animationRef = useRef(null)

  useEffect(() => {
    if (location) {
      // Generate random nearby ambulance location
      const randomLat = location.lat + (Math.random() - 0.5) * 0.01
      const randomLng = location.lng + (Math.random() - 0.5) * 0.01
      setAmbulanceLocation({ lat: randomLat, lng: randomLng })

      // Simulate route calculation
      const fakeRoute = [
        [location.lat, location.lng],
        [(location.lat + randomLat) / 2, (location.lng + randomLng) / 2],
        [randomLat, randomLng],
      ]
      setRoute(fakeRoute)

      // Set estimated time (3-10 minutes)
      setEstimatedTime(Math.floor(Math.random() * 8) + 3)
    }
  }, [location])

  useEffect(() => {
    if (route) {
      let step = 0
      const totalSteps = 100

      const animate = () => {
        if (step < totalSteps) {
          const progress = step / totalSteps
          const currentPosition = L.latLng(
            route[0][0] + (route[2][0] - route[0][0]) * progress,
            route[0][1] + (route[2][1] - route[0][1]) * progress
          )
          setAmbulanceLocation(currentPosition)
          step++
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setIsArrived(true)
        }
      }

      animationRef.current = requestAnimationFrame(animate)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [route])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-lg p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-gray-600 z-10"
        >
          <FaTimes size={24} />
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {location && (
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <ChangeView center={[location.lat, location.lng]} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[location.lat, location.lng]}>
              <Popup>Your location</Popup>
            </Marker>
            {ambulanceLocation && (
              <Marker position={[ambulanceLocation.lat, ambulanceLocation.lng]} icon={ambulanceIcon}>
                <Popup>Ambulance</Popup>
              </Marker>
            )}
            {route && <Polyline positions={route} color="blue" />}
          </MapContainer>
        )}

        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-md">
          {isArrived ? (
            <p className="text-xl font-bold text-green-600">Ambulance has arrived!</p>
          ) : (
            <>
              <p className="text-lg font-semibold">
                Estimated arrival time: {estimatedTime} minutes
              </p>
              <button
                onClick={onCancel}
                className="mt-2 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
              >
                Cancel Ambulance
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}