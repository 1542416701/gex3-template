const AppV8 = Vue.createApp({
  data() {
    return {
      in_name: '',
      in_dob: '',
      in_sex: '',
      in_total: '',
      in_kids: '',
      in_hotel: '',
      in_cc_name: '',
      in_cc_num: '',
      in_cc_exp: '',
      in_cc_cvc: '',
      in_parks: [],

      errs: {},
      err_global: '',
      
      parks: [],
      loading: false,
      err_fetch: '',
      show_res: false,

      hotel_opts: [
        'No accommodation needed',
        'Forest View Hotel',
        'Totoro Family Inn',
        'Witch Valley Guesthouse',
        'Luxury Ghibli Resort'
      ]
    };
  },
  mounted() {
    this.initXHR();
  },
  methods: {
    initXHR() {
      this.loading = true;
      this.err_fetch = '';
      
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'ghibli_park.json', true);
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            this.parks = JSON.parse(xhr.responseText);
          } catch (e) {
            this.err_fetch = 'Failed to load places. Please try again later.';
          }
        } else {
          this.err_fetch = 'Failed to load places. Please try again later.';
        }
        this.loading = false;
      };
      
      xhr.onerror = () => {
        this.err_fetch = 'Failed to load places. Please try again later.';
        this.loading = false;
      };
      
      xhr.send();
    },

    hasPark(pid) {
      for (let i = 0; i < this.in_parks.length; i++) {
        if (this.in_parks[i].id === pid) return true;
      }
      return false;
    },

    togglePark(pObj) {
      if (this.hasPark(pObj.id)) {
        const newArr = [];
        for (let i = 0; i < this.in_parks.length; i++) {
          if (this.in_parks[i].id !== pObj.id) {
            newArr.push(this.in_parks[i]);
          }
        }
        this.in_parks = newArr;
      } else {
        this.in_parks.push(pObj);
      }
    },

    runCheck() {
      let isPass = true;
      const tErr = {};

      if (!this.in_name.trim()) { tErr.in_name = 'Full name is required.'; isPass = false; }
      if (!this.in_dob) { tErr.in_dob = 'Date of birth is required.'; isPass = false; }
      if (!this.in_sex) { tErr.in_sex = 'Gender is required.'; isPass = false; }

      if (this.in_parks.length === 0) {
        tErr.in_parks = 'Please select at least one Ghibli Park place.';
        isPass = false;
      }

      if (!this.in_total || this.in_total < 1) {
        tErr.in_total = 'Total visitors must be at least 1.';
        isPass = false;
      }
      if (this.in_kids === '' || this.in_kids < 0) {
        tErr.in_kids = 'Number of children cannot be negative.';
        isPass = false;
      }
      if (parseInt(this.in_kids, 10) > parseInt(this.in_total, 10)) {
        tErr.in_kids = 'Children cannot exceed total visitors.';
        isPass = false;
      }

      if (!this.in_hotel) { tErr.in_hotel = 'Accommodation selection is required.'; isPass = false; }
      if (!this.in_cc_name.trim()) { tErr.in_cc_name = 'Name on card is required.'; isPass = false; }
      if (!this.in_cc_num.trim()) { tErr.in_cc_num = 'Card number is required.'; isPass = false; }
      if (!this.in_cc_exp) { tErr.in_cc_exp = 'Expiration date is required.'; isPass = false; }
      if (!this.in_cc_cvc.trim()) { tErr.in_cc_cvc = 'CVC is required.'; isPass = false; }

      this.errs = tErr;
      return isPass;
    },

    executeBuild() {
      this.errs = {};
      this.err_global = '';
      this.show_res = false;

      if (!this.runCheck()) {
        this.err_global = 'There are mandatory items pending to be filled. Please complete the required fields.';
      } else {
        this.show_res = true;
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 100);
      }
    }
  }
});

AppV8.mount('#v-app-8');