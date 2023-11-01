import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { cities } from "./cities";
import PrayerCard from "./PrayerCard";
import fajr from "../assets/fajr-prayer.png";
import dhhr from "../assets/dhhr-prayer-mosque.png";
import asr from "../assets/asr-prayer-mosque.png";
import mograp from "../assets/sunset-prayer-mosque.png";
import isha from "../assets/night-prayer-mosque.png";
import axios from "axios";
import Alert from "@mui/material/Alert";
import moment from "moment";
import Swal from "sweetalert2";
import { Howl, Howler } from "howler";
import Aladhan from "../assets/adhan.mp3";
import "moment/dist/locale/ar-dz";
moment.locale("ar");

const MainContent = () => {
  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];

  const audio = new Audio(Aladhan);
  const playAdhan = () => {
    audio.play();
    Swal.fire({
      title: "!وقت الصلاة",
      text: ".حان وقت الصلاة",
      icon: "info",
      showConfirmButton: true,
      showCloseButton: false,
      position: "top",
      confirmButtonText: "إيقاف الأذان",
    }).then((result) => {
      if (result.isConfirmed) {
        stopAdhan();
      }
    });
  };

  const stopAdhan = () => {
    if (audio) {
      audio.pause();
    }
  };

  const [timings, setTimings] = useState();
  const [selectedCity, setSelectedCity] = useState({
    iso: "Al Buḩayrah",
    displayName: "البحيرة",
  });
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const [rTime, setRTime] = useState("");

  const baseUrl = `https://api.aladhan.com/v1/timingsByCity/:date?country=EG&city=${selectedCity.iso}`;

  const getTimings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl);
      console.log(response.data.data);
      const timings = response.data.data.timings;
      setTimings(timings);
    } catch (error) {
      <Alert severity="error">{error}</Alert>;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTimings();
  }, [selectedCity]);

  const setCountDownTimer = () => {
    const dateNow = moment();
    let nextPrayer = 2;
    if (
      dateNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      dateNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      nextPrayer = 1;
      // playAdhan();
    } else if (
      dateNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      dateNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      nextPrayer = 2;
      // playAdhan();
    } else if (
      dateNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      dateNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      nextPrayer = 3;
      // playAdhan();
    } else if (
      dateNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      dateNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      nextPrayer = 4;
      // playAdhan();
    } else {
      nextPrayer = 0;
      // playAdhan();
    }
    setNextPrayerIndex(nextPrayer);
    const nextPrayerObject = prayersArray[nextPrayer];
    const nextPrayerTiming = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTiming, "hh:mm");
    console.log(nextPrayerTimeMoment);
    let reimaingTime = moment(nextPrayerTiming, "hh:mm").diff(dateNow);
    if (reimaingTime < 0) {
      const midNightDiff = moment("23:59:59", "hh:mm:ss").diff(dateNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );
      const totalDiffernce = midNightDiff + fajrToMidnightDiff;
      reimaingTime = totalDiffernce;
    }
    console.log(reimaingTime);
    const duration = moment.duration(reimaingTime);
    setRTime(
      `${duration.hours() > 9 ? duration.hours() : `0${duration.hours()}`}:${
        duration.minutes() > 9 ? duration.minutes() : `0${duration.minutes()}`
      }:${
        duration.seconds() > 9 ? duration.seconds() : `0${duration.seconds()}`
      }`
    );
  };

  const updateTime = () => {
    setCountDownTimer();
    const currentTime = moment().format("MMMM Do YYYY | h:mm:ss a");
    setCurrentDate(currentTime);
  };

  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const formatTime = (time24) => {
    const date = new Date(`1/1/2000 ${time24}`);
    return date.toLocaleString("ar-EG", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const handleChange = (event) => {
    const selectedIso = event.target.value;
    console.log(selectedIso);
    const selectedCityObject = cities.find((city) => city.iso === selectedIso);
    if (selectedCityObject) {
      setSelectedCity(selectedCityObject);
    }
  };

  const displayMessageHandler = () => {
    Swal.fire({
      position: "top",
      icon: "info",
      title: "صلي علي سيدنا محمد ﷺ",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <>
      <Grid container>
        <Grid className="custom-class" item xs={6}>
          <h2>{currentDate}</h2>
          <h2>{selectedCity.displayName}</h2>
        </Grid>
        <Grid className="custom-class" item xs={6}>
          <h2>متبقي حتي صلاه {prayersArray[nextPrayerIndex].displayName}</h2>
          <h2>{rTime}</h2>
        </Grid>
      </Grid>
      <Divider style={{ borderColor: "#ccc", opacity: "0.1" }} />
      <Stack
        direction="row"
        style={{
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "40px",
          justifyContent: "center",
        }}
      >
        <PrayerCard
          image={fajr}
          title="الفجر"
          time={formatTime(timings?.Fajr)}
        />
        <PrayerCard
          image={dhhr}
          title="الظهر"
          time={formatTime(timings?.Dhuhr)}
        />
        <PrayerCard image={asr} title="العصر" time={formatTime(timings?.Asr)} />
        <PrayerCard
          image={mograp}
          title="المغرب"
          time={formatTime(timings?.Maghrib)}
        />
        <PrayerCard
          image={isha}
          title="العشاء"
          time={formatTime(timings?.Isha)}
        />
      </Stack>

      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ marginTop: "40px" }}
      >
        <FormControl className="select-holder" style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white" }}>المدينة</span>
          </InputLabel>
          <Select
            style={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedCity.iso}
            label="المدينة"
            onChange={handleChange}
          >
            {cities.map((city, index) => {
              return (
                <MenuItem value={city.iso} key={index}>
                  {city.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
      {loading && (
        <div className="loader-holder">
          <span className="loader"></span>
        </div>
      )}
    </>
  );
};

export default MainContent;
