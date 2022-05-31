import axios from "../config/axios";
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { restructureResponse } from "../helpers/apiResponseStructure";

const initialState = {
  results: [],
  categories: [],
  isLoading: false,
  tags: {
    Classics: false,
    Fantasy: false,
    Adventure: false,
    Mystery: false,
    Horror: false,
    Science: false,
    Art: false,
    "Self-Discovery": false,
    Health: false,
    History: false,
    Family: false,
    Humor: false,
    Love: false,
  },
};

const titlesApiUrl = "/resources/titles/?start=0&max=50&expandLevel=1&theme=";

export const getBooksByTheme = createAsyncThunk(
  "suggestionsByTheme/query",
  async (theme) => {
    const res = await axios.get(titlesApiUrl + theme);
    return res.data;
  }
);

const filterOutCategory = (results, category) => {
  return results.filter((result) => {
    let regex = new RegExp(`${category.toLowerCase()}`);
    let newThemes = result.themes.map((theme) =>
      regex.test(theme) ? category.toLowerCase() : theme
    );

    return !newThemes.includes(category.toLowerCase());
  });
};

export const recommendationsSlice = createSlice({
  name: "suggestionsByTheme",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.results = [];
      state.categories = {};
    },
    removeCategory: (state, action) => {
      state.results = filterOutCategory(current(state.results), action.payload);
      state.categories = current(state.categories).filter(
        (category) => !category === action.payload
      );
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    toggleTag: (state, action) => {
      state.tags[action.payload] = !state.tags[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBooksByTheme.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getBooksByTheme.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = [
          ...state.results,
          ...restructureResponse(action.payload.title),
        ];
      });
  },
});

export const { reset, removeCategory, addCategory, toggleTag } =
  recommendationsSlice.actions;
