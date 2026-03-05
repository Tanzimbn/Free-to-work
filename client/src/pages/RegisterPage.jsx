import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { divisions, districts, thanas } from '../utils/locationData';

function RegisterPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(1);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    nid: '',
    gender: '',
    phone: '',
    email: '',
    division: '',
    district: '',
    station: '',
    password: '',
    confirmpassword: '',
    tc: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDivisionChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      division: e.target.value,
      district: '',
      station: '',
    }));
  };

  const handleDistrictChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      district: e.target.value,
      station: '',
    }));
  };

  const handleNextStage1 = async () => {
    try {
      const { fname, nid } = formData;
      if (!fname || !nid) {
        toast.error('First name and NID are required');
        return;
      }

      const response = await api.post('/register/form1', { fname, nid });
      const data = response.data;

      if (data.message === 'Valid') {
        setStage(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleNextStage2 = async () => {
    try {
      const { email, station, phone } = formData;
      if (!email || !station || !phone) {
        toast.error('Email, Phone and Police Station are required');
        return;
      }

      const response = await api.post('/register/form2', {
        email,
        Station: station,
        phone,
      });
      const data = response.data;

      if (data.message === 'Valid') {
        setStage(3);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmpassword, tc } = formData;

    if (password !== confirmpassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (!tc) {
      toast.error('You have to agree to the terms and conditions.');
      return;
    }

    try {
      const payload = {
        fname: formData.fname,
        lname: formData.lname,
        nid: formData.nid,
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        division: formData.division,
        district: formData.district,
        station: formData.station,
      };

      const response = await api.post('/register', payload);
      const data = response.data;

      if (data.message === 'Successfull') {
        toast.success('Registration successful! Please confirm your email.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#d11f0c]/22 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/26 blur-3xl" />
      </div>
      <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/85 shadow-2xl shadow-black/60 md:flex-row">
        <div className="flex w-full flex-col justify-between border-b border-slate-800/70 bg-slate-950/70 px-6 py-6 md:w-1/3 md:border-b-0 md:border-r md:px-7 md:py-8">
          <div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cursor-pointer text-left text-lg font-semibold text-slate-50"
            >
              FreeToWork
            </button>
            <p className="mt-10 text-sm font-semibold text-slate-50">Already a member?</p>
            <p className="mt-2 text-xs text-slate-300">
              To keep track of your dashboard, login with your account details.
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col items-center px-6 py-8 md:w-2/3 md:px-9">
          <p className="w-full text-left text-xl font-semibold text-slate-50">Create account</p>

          <div className="mt-6 mb-8 flex w-full max-w-md items-center justify-center">
            <div className="flex flex-1 flex-col items-center">
              <p className="mb-2 text-[11px] font-semibold text-slate-200">Personal info</p>
              <p
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  stage > 1 ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-200'
                }`}
              >
                {stage > 1 ? '✓' : '1'}
              </p>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <p className="mb-2 text-[11px] font-semibold text-slate-200">Contact info</p>
              <p
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  stage > 2 ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-200'
                }`}
              >
                {stage > 2 ? '✓' : '2'}
              </p>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <p className="mb-2 text-[11px] font-semibold text-slate-200">Final submit</p>
              <p
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  stage === 3 ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-200'
                }`}
              >
                3
              </p>
            </div>
          </div>

          <div className="w-full">
            {stage === 1 && (
              <div className="w-full">
                <div className="mt-4 flex w-full flex-col items-center gap-4 sm:flex-row">
                  <div className="flex w-full items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                    <input
                      type="text"
                      name="fname"
                      placeholder="First name"
                      value={formData.fname}
                      onChange={handleChange}
                      className="ml-1 w-full border-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                    />
                  </div>
                  <div className="flex w-full items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                    <input
                      type="text"
                      name="lname"
                      placeholder="Last name"
                      value={formData.lname}
                      onChange={handleChange}
                      className="ml-1 w-full border-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>
                <div className="mt-4 flex w-full flex-col items-center gap-4 sm:flex-row">
                  <div className="flex w-full items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                    <input
                      type="tel"
                      name="nid"
                      placeholder="NID number"
                      value={formData.nid}
                      onChange={handleChange}
                      required
                      className="ml-1 w-full border-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                    />
                  </div>
                  <div className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-200 sm:text-xs">
                    <span className="mr-2">Gender</span>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={handleChange}
                        className="accent-emerald-400"
                      />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={handleChange}
                        className="accent-emerald-400"
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex w-full justify-center">
                  <button
                    type="button"
                    className="w-full rounded-full bg-[#d11f0c] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#b91a09]"
                    onClick={handleNextStage1}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {stage === 2 && (
              <div className="w-full">
                <div className="mt-4 flex w-full flex-col items-center gap-4 sm:flex-row">
                  <div className="flex w-full items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="ml-1 w-full border-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                    />
                  </div>
                  <div className="flex w-full items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      className="ml-1 w-full border-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>
                <div className="mt-4 flex w-full flex-col items-center gap-4 sm:flex-row">
                  <div className="flex w-full items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                    <select
                      name="division"
                      value={formData.division}
                      onChange={handleDivisionChange}
                      className="w-full border-none bg-transparent text-sm text-slate-100 outline-none"
                    >
                      <option value="" disabled>
                        Select division
                      </option>
                      {divisions.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex w-full items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleDistrictChange}
                      disabled={!formData.division}
                      className="w-full border-none bg-transparent text-sm text-slate-100 outline-none disabled:text-slate-500"
                    >
                      <option value="" disabled>
                        {formData.division ? 'Select district' : 'Select division first'}
                      </option>
                      {formData.division &&
                        districts[formData.division]?.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex w-full flex-col items-center gap-4 sm:flex-row">
                  <div className="flex w-full items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                    <select
                      name="station"
                      value={formData.station}
                      onChange={handleChange}
                      disabled={!formData.district}
                      className="w-full border-none bg-transparent text-sm text-slate-100 outline-none disabled:text-slate-500"
                    >
                      <option value="" disabled>
                        {formData.district ? 'Select police station' : 'Select district first'}
                      </option>
                      {formData.district &&
                        thanas[formData.district]?.map((thana) => (
                          <option key={thana} value={thana}>
                            {thana}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex w-full justify-between gap-4">
                  <button
                    type="button"
                    className="w-1/2 rounded-full bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-700"
                    onClick={() => setStage(1)}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="w-1/2 rounded-full bg-[#d11f0c] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#b91a09]"
                    onClick={handleNextStage2}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {stage === 3 && (
              <div className="w-full">
                <form onSubmit={handleSubmit} className="flex w-full flex-col items-center">
                  <div className="mt-4 flex w-full flex-col items-center gap-4 sm:flex-row">
                    <div className="flex w-full items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="ml-1 w-full border-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        className="text-[11px] font-medium text-slate-400 hover:text-slate-100"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="flex w-full items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                      <input
                        type="password"
                        name="confirmpassword"
                        placeholder="Confirm password"
                        value={formData.confirmpassword}
                        onChange={handleChange}
                        required
                        className="ml-1 w-full border-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4 w-full text-[11px] text-slate-200 sm:text-xs">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        name="tc"
                        checked={formData.tc}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                      <span>
                        By submitting your details, you agree to the{' '}
                        <a
                          href="https://www.termsandconditionsgenerator.com/live.php?token=zdVLylWQhNopnkTOQSCjmuucF6ocSoJk"
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-300 underline"
                        >
                          terms and conditions
                        </a>
                        .
                      </span>
                    </label>
                  </div>
                  <div className="mt-6 flex w-full justify-between gap-4">
                    <button
                      type="button"
                      className="w-1/2 rounded-full bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-700"
                      onClick={() => setStage(2)}
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 rounded-full bg-[#d11f0c] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#b91a09]"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

