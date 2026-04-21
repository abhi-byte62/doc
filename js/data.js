const SPECIALTIES = [
    { id: 'cardiology', icon: '🫀', name: 'Cardiology' },
    { id: 'neurology', icon: '🧠', name: 'Neurology' },
    { id: 'dermatology', icon: '✨', name: 'Dermatology' },
    { id: 'orthopedics', icon: '🦴', name: 'Orthopedics' },
    { id: 'pediatrics', icon: '👶', name: 'Pediatrics' },
    { id: 'ophthalmology', icon: '👁️', name: 'Ophthalmology' },
    { id: 'psychiatry', icon: '🧘', name: 'Psychiatry' },
    { id: 'gynecology', icon: '🤰', name: 'Gynecology' },
    { id: 'gastroenterology', icon: '🔬', name: 'Gastroenterology' },
    { id: 'general', icon: '🩺', name: 'General' }
];

const DOCTORS = [
    { id: 'd1', name: 'Dr. Meera Nair', specialty: 'Cardiology', experience: '12 Yrs', rating: 4.9, reviews: 124, location: 'Bangalore', fee: '₹1200', available: true, initials: 'MN', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', slots: ['9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'] },
    { id: 'd2', name: 'Dr. Arjun Sharma', specialty: 'Neurology', experience: '15 Yrs', rating: 4.8, reviews: 98, location: 'Mumbai', fee: '₹1500', available: true, initials: 'AS', gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', slots: ['10:30 AM', '1:00 PM', '5:00 PM'] },
    { id: 'd3', name: 'Dr. Priya Iyer', specialty: 'Dermatology', experience: '8 Yrs', rating: 4.7, reviews: 156, location: 'Chennai', fee: '₹800', available: false, initials: 'PI', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', slots: ['11:00 AM', '3:00 PM'] },
    { id: 'd4', name: 'Dr. Rohit Verma', specialty: 'Orthopedics', experience: '20 Yrs', rating: 4.9, reviews: 210, location: 'Delhi', fee: '₹1000', available: true, initials: 'RV', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', slots: ['9:30 AM', '12:00 PM', '4:30 PM'] },
    { id: 'd5', name: 'Dr. Kavya Reddy', specialty: 'Pediatrics', experience: '10 Yrs', rating: 4.9, reviews: 180, location: 'Hyderabad', fee: '₹900', available: true, initials: 'KR', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', slots: ['8:00 AM', '9:00 AM', '6:00 PM'] },
    { id: 'd6', name: 'Dr. Suresh Menon', specialty: 'Psychiatry', experience: '18 Yrs', rating: 4.6, reviews: 85, location: 'Bangalore', fee: '₹1500', available: true, initials: 'SM', gradient: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)', slots: ['11:00 AM', '2:30 PM', '4:00 PM'] },
    { id: 'd7', name: 'Dr. Anita Kulkarni', specialty: 'Gynecology', experience: '14 Yrs', rating: 4.8, reviews: 142, location: 'Pune', fee: '₹1100', available: true, initials: 'AK', gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', slots: ['10:00 AM', '1:00 PM', '3:30 PM'] },
    { id: 'd8', name: 'Dr. Vivek Pillai', specialty: 'Gastroenterology', experience: '16 Yrs', rating: 4.7, reviews: 115, location: 'Mumbai', fee: '₹1300', available: true, initials: 'VP', gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', slots: ['9:00 AM', '11:30 AM', '5:00 PM'] }
];

const Storage = {
    getAppointments() {
        try {
            const data = localStorage.getItem('mb_appointments');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error(e);
            return [];
        }
    },
    saveAppointment(appt) {
        try {
            const appts = this.getAppointments();
            appt.id = 'appt_' + Date.now();
            appt.status = 'Confirmed';
            appts.push(appt);
            localStorage.setItem('mb_appointments', JSON.stringify(appts));
            return appt;
        } catch (e) {
            console.error(e);
        }
    },
    updateAppointmentStatus(id, status) {
        try {
            const appts = this.getAppointments();
            const index = appts.findIndex(a => a.id === id);
            if (index !== -1) {
                appts[index].status = status;
                localStorage.setItem('mb_appointments', JSON.stringify(appts));
            }
        } catch(e) {
            console.error(e);
        }
    },
    getUser() {
        try {
            const data = localStorage.getItem('mb_user');
            return data ? JSON.parse(data) : null;
        } catch(e) {
            console.error(e);
            return null;
        }
    },
    saveUser(user) {
        try {
            localStorage.setItem('mb_user', JSON.stringify(user));
        } catch(e) {
            console.error(e);
        }
    },
    logout() {
        try {
            localStorage.removeItem('mb_user');
        } catch(e) {
            console.error(e);
        }
    }
};
