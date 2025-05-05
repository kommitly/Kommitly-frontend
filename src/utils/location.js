const getLocationAndTimezone = () => {
  const options = {
    maximumAge: 0,
    enableHighAccuracy: false,
    timeout: 15000,
  };

  const success = async (position) => {
    const { latitude, longitude } = position.coords;
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);

    try {
      const response = await fetch('/api/get-timezone/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      const data = await response.json();
      console.log('Timezone:', data.timezone);

      // Optionally store timezone in localStorage, Redux, or send to backend
    } catch (err) {
      console.error('Failed to fetch timezone from backend:', err);
    }
  };

  const error = (err) => {
    console.error('Error getting location:', err);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
};

export default getLocationAndTimezone;