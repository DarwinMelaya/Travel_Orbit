import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const UserLandingPage = () => {
  const navigate = useNavigate();

  // Background slider state
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const [showingA, setShowingA] = useState(true);
  const bgLayerARef = useRef(null);
  const bgLayerBRef = useRef(null);

  // Form state
  const [fromPort, setFromPort] = useState("");
  const [toPort, setToPort] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  // Calendar state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);
  const dateInputRef = useRef(null);
  const dateBtnRef = useRef(null);

  const GW_SEARCH_KEY = "gw_search_v1";

  const IMAGES = [
    "/images/ferry_1.jpg",
    "/images/ferry_2.jpg",
    "/images/ferry_4.jpg",
    "/images/ferry_3.jpg",
  ];

  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Background slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % IMAGES.length);
      setShowingA((prev) => !prev);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  // Restore saved search from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(GW_SEARCH_KEY) || "null");
      if (saved && typeof saved === "object") {
        if (saved.from) setFromPort(saved.from);
        if (saved.to) setToPort(saved.to);
        if (saved.date) setDepartureDate(saved.date);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Port validation: prevent same From/To selection
  useEffect(() => {
    if (fromPort && toPort && fromPort === toPort) {
      setToPort("");
    }
  }, [fromPort, toPort]);

  // Calendar utilities
  const pad2 = (n) => String(n).padStart(2, "0");
  const formatMmDdYyyy = (d) =>
    `${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}/${d.getFullYear()}`;
  const parseMmDdYyyy = (value) => {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value || "");
    if (!m) return null;
    const mm = Number(m[1]);
    const dd = Number(m[2]);
    const yy = Number(m[3]);
    if (yy < 1900 || yy > 2100) return null;
    if (mm < 1 || mm > 12) return null;
    const d = new Date(yy, mm - 1, dd);
    if (d.getFullYear() !== yy || d.getMonth() !== mm - 1 || d.getDate() !== dd)
      return null;
    return d;
  };
  const isSameDay = (a, b) => {
    return (
      a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const getMinDate = () => startOfDay(new Date());

  // Calendar positioning
  useEffect(() => {
    if (!isCalendarOpen || !calendarRef.current || !dateInputRef.current)
      return;

    const positionCalendar = () => {
      const inputRect = dateInputRef.current.getBoundingClientRect();
      const cal = calendarRef.current;
      const calWidth = 320;
      const calHeight = 360;
      const MARGIN = 10;

      const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
      let left = clamp(
        inputRect.left,
        MARGIN,
        window.innerWidth - calWidth - MARGIN,
      );
      let top = inputRect.bottom + 10;
      if (top + calHeight > window.innerHeight - MARGIN) {
        top = inputRect.top - calHeight - 10;
      }
      top = clamp(top, MARGIN, window.innerHeight - calHeight - MARGIN);

      cal.style.left = `${Math.round(left)}px`;
      cal.style.top = `${Math.round(top)}px`;
    };

    positionCalendar();
    window.addEventListener("resize", positionCalendar);
    window.addEventListener("scroll", positionCalendar, true);

    return () => {
      window.removeEventListener("resize", positionCalendar);
      window.removeEventListener("scroll", positionCalendar, true);
    };
  }, [isCalendarOpen]);

  // Close calendar on outside click
  useEffect(() => {
    if (!isCalendarOpen) return;

    const handleClickOutside = (e) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        dateInputRef.current &&
        !dateInputRef.current.contains(e.target) &&
        dateBtnRef.current &&
        !dateBtnRef.current.contains(e.target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setIsCalendarOpen(false);
    };

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isCalendarOpen]);

  const openCalendar = () => {
    const parsed = parseMmDdYyyy(departureDate);
    if (parsed) {
      setSelectedDate(startOfDay(parsed));
      setViewDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    } else {
      const now = new Date();
      setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
      setSelectedDate(null);
    }
    setIsCalendarOpen(true);
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  const shiftMonth = (delta) => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1),
    );
  };

  const selectDate = (date) => {
    setSelectedDate(date);
    setDepartureDate(formatMmDdYyyy(date));
    closeCalendar();
  };

  const selectToday = () => {
    const today = startOfDay(new Date());
    setSelectedDate(today);
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setDepartureDate(formatMmDdYyyy(today));
  };

  const renderCalendar = () => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const first = new Date(y, m, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const daysInPrev = new Date(y, m, 0).getDate();
    const today = startOfDay(new Date());
    const minDate = getMinDate();

    const days = [];
    for (let i = 0; i < 42; i++) {
      let dayNum, cellDate;
      if (i < startDay) {
        dayNum = daysInPrev - (startDay - 1 - i);
        cellDate = new Date(y, m - 1, dayNum);
      } else if (i >= startDay + daysInMonth) {
        dayNum = i - (startDay + daysInMonth) + 1;
        cellDate = new Date(y, m + 1, dayNum);
      } else {
        dayNum = i - startDay + 1;
        cellDate = new Date(y, m, dayNum);
      }
      cellDate = startOfDay(cellDate);
      days.push({ dayNum, cellDate });
    }

    return days;
  };

  const handleDateInput = (e) => {
    let v = e.target.value.replace(/[^\d]/g, "").slice(0, 8);
    if (v.length >= 5) v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    else if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    setDepartureDate(v);
  };

  const handleDateBlur = () => {
    if (!departureDate) return;
    const d = parseMmDdYyyy(departureDate);
    if (d) setDepartureDate(formatMmDdYyyy(d));
  };

  const handleFeaturedRoute = (route) => {
    const [from, to] = route.split("-").map((x) => x.trim());
    if (!from || !to || from === to) return;
    setFromPort(from);
    setToPort(to);
  };

  const handleSearch = () => {
    const from = fromPort.trim();
    const to = toPort.trim();
    const date = departureDate.trim();

    if (!from || !to) {
      alert("Please select both From and Destination.");
      return;
    }
    if (from === to) {
      alert("From and Destination cannot be the same.");
      return;
    }

    try {
      localStorage.setItem(GW_SEARCH_KEY, JSON.stringify({ from, to, date }));
    } catch (e) {
      // ignore
    }

    const params = new URLSearchParams({ from, to, date });
    navigate(`/results?${params.toString()}`);
  };

  const calendarDays = renderCalendar();
  const today = startOfDay(new Date());
  const minDate = getMinDate();

  return (
    <div className="min-h-screen font-questrial text-white relative">
      {/* Background slider */}
      <div
        className="fixed inset-0 z-0 overflow-hidden bg-[#060a12]"
        aria-hidden="true"
      >
        <div
          ref={bgLayerARef}
          className="absolute inset-0 bg-cover bg-center scale-[1.08] transition-opacity duration-[550ms] ease-in-out"
          style={{
            backgroundImage: `url("${IMAGES[bgImageIndex]}")`,
            filter: "saturate(1.08) contrast(1.06) brightness(1.08)",
            opacity: showingA ? 1 : 0,
          }}
        />
        <div
          ref={bgLayerBRef}
          className="absolute inset-0 bg-cover bg-center scale-[1.08] transition-opacity duration-[550ms] ease-in-out"
          style={{
            backgroundImage: `url("${IMAGES[(bgImageIndex + 1) % IMAGES.length]}")`,
            filter: "saturate(1.08) contrast(1.06) brightness(1.08)",
            opacity: showingA ? 0 : 1,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(1200px 700px at 22% 28%, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.34) 70%),
              linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.22) 45%, rgba(0, 0, 0, 0.16) 100%),
              linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.3) 100%)
            `,
          }}
        />
        <div
          className="absolute left-[-220px] top-[52%] w-[720px] h-[720px] rounded-full blur-4 opacity-95"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.28), transparent 62%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/15">
              <img
                src="/images/logo.png"
                alt="Travel Orbit Logo"
                className="h-9 w-9 object-contain"
                loading="eager"
              />
            </div>
            <div className="leading-tight">
              <p className="font-poppins text-sm font-semibold tracking-wide">
                TRAVEL ORBIT
              </p>
              <p className="-mt-1 text-xs text-white/70">
                Ferry Booking System
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
            <a
              className="transition-colors duration-140 ease-in-out hover:text-white"
              href="#"
            >
              Home
            </a>
            <a
              className="transition-colors duration-140 ease-in-out hover:text-white"
              href="#"
            >
              My Ticket
            </a>
            <a
              className="transition-colors duration-140 ease-in-out hover:text-white"
              href="#"
            >
              About
            </a>
            <a
              className="transition-colors duration-140 ease-in-out hover:text-white"
              href="#"
            >
              Support
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="hidden border border-white/18 bg-white/6 px-[14px] py-[10px] rounded-[14px] backdrop-blur-[14px] text-white/88 md:inline-flex items-center"
              type="button"
            >
              <span className="mr-2 inline-flex opacity-90">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16.5 16.5 21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              Search
            </button>

            <button
              className="border border-white/18 bg-white/6 p-[10px] rounded-[14px] backdrop-blur-[14px] text-white/88"
              type="button"
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="mx-auto w-full max-w-6xl px-5 pb-12 pt-10 md:pb-18 md:pt-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start">
            {/* Left content */}
            <div className="md:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full px-[14px] py-[10px] border border-white/16 bg-white/6 backdrop-blur-[14px] text-white/85 text-xs">
                  <span className="h-2 w-2 rounded-full bg-[rgba(16,185,129,0.95)] shadow-[0_0_0_6px_rgba(16,185,129,0.16)]"></span>
                  Fast booking
                </span>
                <span className="inline-flex items-center gap-2 rounded-full px-[14px] py-[10px] border border-white/16 bg-white/6 backdrop-blur-[14px] text-white/85 text-xs">
                  Real-time sailing status
                </span>
                <span className="inline-flex items-center gap-2 rounded-full px-[14px] py-[10px] border border-white/16 bg-white/6 backdrop-blur-[14px] text-white/85 text-xs">
                  Green routes
                </span>
              </div>

              <h1 className="mt-7 font-poppins text-5xl font-extrabold leading-[0.98] md:text-7xl">
                BUILT FOR SPEED. <br />
                POWERED BY
                <br />
                <span className="text-[rgba(16,185,129,0.96)]">
                  INNOVATION.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
                Book your ferry trip in seconds. Select a departure date, and
                sail with comfort powered by a clean, modern experience.
              </p>

              {/* Booking bar */}
              <div className="mt-10">
                <div className="rounded-[24px] border border-white/16 bg-white/6 backdrop-blur-[18px] shadow-[0_22px_80px_rgba(0,0,0,0.45)]">
                  <div className="grid grid-cols-1 gap-[14px] p-[18px] md:grid-cols-[1.25fr_1.25fr_1fr_0.65fr]">
                    {/* FROM */}
                    <div className="rounded-[18px] border border-white/14 bg-white/6 p-[12px_19px_14px] min-h-[70px]">
                      <p className="font-poppins text-[11px] tracking-[0.03em] text-white/72 mb-[10px]">
                        From
                      </p>
                      <div className="relative flex items-center">
                        <select
                          className="w-full outline-none border-none bg-transparent text-white/92 text-sm appearance-none pr-9 cursor-pointer custom-dropdown"
                          value={fromPort}
                          onChange={(e) => setFromPort(e.target.value)}
                          aria-label="Departure port"
                        >
                          <option className="text-black" value="">
                            Select departure
                          </option>
                          <option className="text-black" value="Lucena">
                            Lucena
                          </option>
                          <option className="text-black" value="Marinduque">
                            Marinduque
                          </option>
                        </select>
                        <span
                          className="absolute right-[10px] text-white/75 pointer-events-none"
                          aria-hidden="true"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M6 9l6 6 6-6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* TO */}
                    <div className="rounded-[18px] border border-white/14 bg-white/6 p-[12px_19px_14px] min-h-[70px]">
                      <p className="font-poppins text-[11px] tracking-[0.03em] text-white/72 mb-[10px]">
                        Where?
                      </p>
                      <div className="relative flex items-center">
                        <select
                          className="w-full outline-none border-none bg-transparent text-white/92 text-sm appearance-none pr-9 cursor-pointer custom-dropdown"
                          value={toPort}
                          onChange={(e) => setToPort(e.target.value)}
                          aria-label="Destination"
                        >
                          <option className="text-black" value="">
                            Select destination
                          </option>
                          <option
                            className="text-black"
                            value="Lucena"
                            disabled={fromPort === "Lucena"}
                          >
                            Lucena
                          </option>
                          <option
                            className="text-black"
                            value="Marinduque"
                            disabled={fromPort === "Marinduque"}
                          >
                            Marinduque
                          </option>
                        </select>
                        <span
                          className="absolute right-[10px] text-white/75 pointer-events-none"
                          aria-hidden="true"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M6 9l6 6 6-6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* DATE */}
                    <div className="rounded-[18px] border border-white/14 bg-white/6 p-[12px_19px_14px] min-h-[70px]">
                      <p className="font-poppins text-[11px] tracking-[0.03em] text-white/72 mb-[10px]">
                        Date of Departure
                      </p>
                      <div className="relative flex items-center">
                        <input
                          ref={dateInputRef}
                          className="w-full outline-none border-none bg-transparent text-white/92 text-sm placeholder:text-white/50"
                          type="text"
                          inputMode="numeric"
                          placeholder="mm/dd/yyyy"
                          maxLength="10"
                          autoComplete="off"
                          aria-label="Departure date"
                          value={departureDate}
                          onChange={handleDateInput}
                          onBlur={handleDateBlur}
                          onFocus={openCalendar}
                        />
                        <button
                          ref={dateBtnRef}
                          className="absolute right-[-9px] h-[38px] w-[38px] rounded-[12px] border border-white/14 bg-white/6 grid place-items-center text-white/75"
                          type="button"
                          onClick={openCalendar}
                          aria-label="Open calendar"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M8 3v3M16 3v3"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M4 9h16"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      className="rounded-[18px] border border-white/14 bg-[rgba(16,185,129,0.95)] text-white flex items-center justify-center gap-[10px] min-h-[70px] px-[18px] font-poppins font-extrabold"
                      type="button"
                      onClick={handleSearch}
                      aria-label="Search trips"
                    >
                      <span>Search</span>
                      <span aria-hidden="true">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 12h12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M13 6l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-xs text-white/60">
                  Tip: Choose Lucena ↔ Marinduque. You can add more ports
                  anytime.
                </p>
              </div>

              {/* Featured routes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h2 className="font-poppins text-sm font-semibold tracking-wide text-white/85">
                    FEATURED ROUTES
                  </h2>
                  <a
                    href="#"
                    className="text-xs text-white/65 hover:text-white"
                  >
                    View all
                  </a>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <a
                    className="flex gap-3 items-center rounded-[22px] border border-white/14 bg-white/6 backdrop-blur-[16px] p-[10px] cursor-pointer hover:bg-white/8 transition-colors"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFeaturedRoute("Lucena-Marinduque");
                    }}
                  >
                    <div className="w-[86px] h-[60px] rounded-[16px] overflow-hidden">
                      <img
                        src="/images/port1.jpg"
                        alt="Lucena Port"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-poppins font-extrabold text-sm">
                        Lucena to Marinduque
                      </div>
                      <div className="mt-1 text-xs text-white/62">
                        Fast morning sailings • Modern vessels
                      </div>
                    </div>
                  </a>

                  <a
                    className="flex gap-3 items-center rounded-[22px] border border-white/14 bg-white/6 backdrop-blur-[16px] p-[10px] cursor-pointer hover:bg-white/8 transition-colors"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFeaturedRoute("Marinduque-Lucena");
                    }}
                  >
                    <div className="w-[86px] h-[60px] rounded-[16px] overflow-hidden">
                      <img
                        src="/images/port2.jpg"
                        alt="Marinduque Port"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-poppins font-extrabold text-sm">
                        Marinduque to Lucena
                      </div>
                      <div className="mt-1 text-xs text-white/62">
                        Flexible schedules • Easy booking
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Right decoration */}
            <div className="hidden md:col-span-4 md:block">
              <div className="pt-[52px]">
                <div className="rounded-[26px] border border-white/14 bg-white/6 backdrop-blur-[18px] shadow-[0_22px_80px_rgba(0,0,0,0.4)] p-4">
                  {/* Advisory container */}
                  <aside
                    className="rounded-[22px] border border-white/14 bg-[rgba(12,18,28,0.55)] backdrop-blur-[18px] p-[14px]"
                    aria-label="Travel Advisory"
                  >
                    <div className="flex items-center justify-between gap-[10px]">
                      <div className="inline-flex items-center gap-[10px] px-[10px] py-2 rounded-full border border-white/14 bg-white/6 text-[11px] tracking-[0.08em] font-poppins font-extrabold">
                        <span
                          className="w-[10px] h-[10px] rounded-full bg-[rgba(16,185,129,0.95)]"
                          aria-hidden="true"
                        ></span>
                        <span>TRAVEL ADVISORY</span>
                      </div>
                      <div className="inline-flex gap-2 items-center">
                        <span className="text-[11px] px-[10px] py-2 rounded-full border border-white/12 bg-white/5">
                          {new Date().toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-3 font-poppins font-black text-base">
                      Weather & Sea Condition Update
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-white/68">
                      Some sailings may operate within adjusted departure
                      windows to ensure the safety and comfort of all
                      passengers, as sea conditions, weather patterns, and port
                      operations can change without prior notice. For this
                      reason, travelers are strongly advised to arrive at the
                      terminal well ahead of the scheduled boarding time to
                      allow sufficient time for check-in, security procedures,
                      and any unforeseen adjustments. Keeping your contact
                      details—such as your mobile number and email
                      address—accurate and up to date is also essential so that
                      you can promptly receive important SMS or email advisories
                      regarding schedule updates, gate changes, delays, or other
                      travel-related announcements. Staying informed and
                      arriving early will help ensure a smoother, safer, and
                      more convenient journey for everyone on board.
                    </p>
                  </aside>

                  {/* Partner strip */}
                  <div className="mt-3" aria-label="Partners and Sponsors">
                    <div className="font-poppins text-[11px] font-extrabold tracking-[0.14em] text-white/72 my-[10px_8px] text-center select-none">
                      IN PARTNERSHIP WITH
                    </div>

                    <div className="grid grid-cols-5 gap-[10px_14px] items-center justify-items-center px-1">
                      {Array.from({ length: 15 }, (_, i) => i + 1).map(
                        (num) => (
                          <div
                            key={num}
                            className="w-full flex items-center justify-center min-h-[32px]"
                          >
                            <img
                              className="w-full max-w-[82px] h-[26px] object-contain opacity-90 saturate-[0.95] contrast-[1.05] transition-all duration-160 ease-in-out hover:translate-y-[-1px] hover:scale-105 hover:opacity-100 hover:saturate-[1.08] hover:contrast-[1.08] pointer-events-none"
                              src={`/images/${num}.png`}
                              alt={`Partner logo ${num}`}
                              loading="lazy"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Calendar Portal */}
      {isCalendarOpen && (
        <div
          ref={calendarRef}
          className="fixed w-[320px] rounded-[18px] border border-white/14 bg-[rgba(12,18,28,0.92)] backdrop-blur-[18px] shadow-[0_30px_90px_rgba(0,0,0,0.55)] p-3 translate-y-2 opacity-0 pointer-events-none transition-all duration-160 ease-in-out z-[99999]"
          style={{
            opacity: isCalendarOpen ? 1 : 0,
            transform: isCalendarOpen ? "translateY(0)" : "translateY(8px)",
            pointerEvents: isCalendarOpen ? "auto" : "none",
          }}
          aria-hidden={!isCalendarOpen}
        >
          <div className="grid grid-cols-[40px_1fr_40px] items-center gap-2">
            <button
              className="h-[38px] w-[38px] rounded-[12px] border border-white/12 bg-white/6 text-white/85 grid place-items-center cursor-pointer hover:bg-white/10 transition-colors"
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="text-center font-poppins font-black text-[13px] text-white/90">
              {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
            </div>
            <button
              className="h-[38px] w-[38px] rounded-[12px] border border-white/12 bg-white/6 text-white/85 grid place-items-center cursor-pointer hover:bg-white/10 transition-colors"
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="mt-[10px] grid grid-cols-7 gap-1.5 text-white/55 text-[11px] text-center font-poppins font-bold">
            {DOW.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="mt-[10px] grid grid-cols-7 gap-1.5">
            {calendarDays.map(({ dayNum, cellDate }, idx) => {
              const isMuted = cellDate.getMonth() !== viewDate.getMonth();
              const isToday = isSameDay(cellDate, today);
              const isSelected =
                selectedDate && isSameDay(cellDate, selectedDate);
              const isDisabled = cellDate < minDate;

              return (
                <button
                  key={idx}
                  type="button"
                  className={`h-[38px] rounded-[12px] border border-white/10 bg-white/5 text-white/86 font-poppins font-extrabold text-xs cursor-pointer transition-all duration-120 ease-in-out hover:translate-y-[-1px] hover:bg-white/8 hover:border-[rgba(16,185,129,0.26)] ${
                    isMuted ? "text-white/40" : ""
                  } ${isDisabled ? "opacity-35 cursor-not-allowed" : ""} ${
                    isToday ? "border-[rgba(16,185,129,0.35)]" : ""
                  } ${isSelected ? "bg-[rgba(16,185,129,0.92)] border-[rgba(16,185,129,0.95)] text-white" : ""}`}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && selectDate(cellDate)}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between gap-[10px]">
            <button
              className="rounded-[12px] px-3 py-[10px] border border-white/12 bg-white/6 text-white/86 font-poppins font-black text-xs cursor-pointer hover:brightness-110 transition-all"
              type="button"
              onClick={selectToday}
            >
              Today
            </button>
            <button
              className="rounded-[12px] px-3 py-[10px] border border-[rgba(16,185,129,0.95)] bg-[rgba(16,185,129,0.95)] text-white font-poppins font-black text-xs cursor-pointer hover:brightness-110 transition-all"
              type="button"
              onClick={closeCalendar}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLandingPage;
