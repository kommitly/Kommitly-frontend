const getLocationAndTimezone = () => {
  const options = {
    maximumAge: 0,
    enableHighAccuracy: false,
    timeout: 15000,
  };

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token not found in localStorage");
    return null;
  }   
  return token;
};


  const success = async (position) => {
    const { latitude, longitude } = position.coords;
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);

    try {
      const token = getToken();
      const response = await fetch('https://kommitly-backend.onrender.com/api/users/get-timezone/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      const data = await response.json();
      
      localStorage.setItem("Timezone",data.timezone)
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