import { createSlice } from '@reduxjs/toolkit';

//Se inicializa id=0 para seleccionar y update.
export const initialTermForm = {
  id: 0,
  version: '',
  content: '',
  effectiveDate: '',
};

const initialErrors = {
  version: '',
  content: '',
  effectiveDate: '',
};

export const termsSlice = createSlice({
  name: 'terms',
  initialState: {
    terms: [],
    termSelected: initialTermForm,
    visibleForm: false,
    errors: initialErrors,

    latestTerm: null,             //último término
    latestTermError: null,
    userTermsStatus: null,         //status del término
    isLoading: true,
  },
  reducers: {
    addTerm: (state, action) => {
      // state.terms = [
      //   ...state.terms,
      //   {
      //     ...action.payload,
      //   }
      // ];
      const newTerm = action.payload;
      state.terms.unshift(newTerm);
      state.latestTerm = newTerm;          // Actualizar latestTerm

      state.termSelected= initialTermForm;
      state.visibleForm= false;
    },
    removeTerm: (state, action) => {
      state.terms = state.terms.filter(term => term.id !== action.payload);
    },
    updateTerm: (state, action) => {
      // state.terms = state.terms.map(term => {
      //   if (term.id === action.payload.id) {
      //     return {
      //       ...action.payload,
      //     };
      //   } 
      //   return term;
      // });
      const updatedTerm = action.payload;
      state.terms = state.terms.map(term => 
        term.id === updatedTerm.id ? updatedTerm : term
      );
      if (state.latestTerm && state.latestTerm.id === updatedTerm.id) {
        state.latestTerm = updatedTerm; // Actualizar latestTerm si es necesario
      }
      
      state.termSelected= initialTermForm;
      state.visibleForm= false;
    },
    loadingTerms: (state, action) => {
      state.terms = action.payload;
      state.isLoading = false;
    },
    onSelectedTermForm: (state, action) => {
      state.termSelected = action.payload;
      state.visibleForm = true;
    },
    onOpenForm: (state) => {
      state.visibleForm = true;
    },
    onCloseForm: (state) => {
      state.visibleForm =false;
      state.termSelected= initialTermForm;
    },

    fetchLatestTermStart(state) {
      state.isLoading = true;
      state.latestTermError = null;
    },
    fetchLatestTermSuccess(state, action) {
      const newLatestTerm = action.payload;
      state.latestTerm = newLatestTerm;
      
      // Sincronizar con el array de términos
      const existingTermIndex = state.terms.findIndex(term => term.id === newLatestTerm.id);
      if (existingTermIndex !== -1) {
        // Actualizar el término existente
        state.terms[existingTermIndex] = newLatestTerm;
      } else {
        // Agregar el nuevo término al principio del array
        state.terms.unshift(newLatestTerm);
      }
      
      state.isLoading = false;

      //old
      //state.latestTerm = action.payload;
      //state.isLoading = false;
    },
    fetchLatestTermError(state, action) {
      state.latestTermError = action.payload;
      state.isLoading = false;
    },

    setUserTermsStatus(state, action) {
      state.userTermsStatus = action.payload;
    },

    loadingError: (state, action) => {
      state.errors = action.payload;
      //state.isLoading = false;
    }
  },
});

export const { 
  addTerm,
  removeTerm,
  updateTerm,
  loadingTerms,
  onSelectedTermForm,
  onOpenForm,
  onCloseForm,

  fetchLatestTermStart,
  fetchLatestTermSuccess,
  fetchLatestTermError,
  setUserTermsStatus,
  loadingError,
} = termsSlice.actions;
