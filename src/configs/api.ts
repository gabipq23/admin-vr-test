import axios from "axios";

export const apiPurchase = axios.create({
  baseURL: "https://evolution.bigdates.com.br:3620",
  headers: {
    "Content-Type": "application/json",
  },
});

// Backoffice
export const api = axios.create({
  baseURL: "https://webscrap.bigdates.com.br:3620",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiProducts = axios.create({
  baseURL: "https://webscrap.bigdates.com.br:3660",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tools
export const apiBase2b = axios.create({
  baseURL: "https://base2b.online:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiCheckOperadora = axios.create({
  baseURL: "https://zapchecker.bigdates.com.br/api/public",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "sMVD95wfLe3WDLP5b3DQfBNjzdb8dZ",
  },
});

// Chat
export const apiUberich = axios.create({
  baseURL: "https://evolution.bigdates.com.br:3300",
  headers: {
    "Content-Type": "application/json",
    "x-flowise-token":
      "ff52c550a19a84ce0de929b75874ef8bbd503eeffdaeb324cdb7da0c7f4cd819cfb760c07b0e2578197fc3934c13df24",
  },
});

export const apiEvolution = axios.create({
  baseURL: "https://evolution.bigdates.com.br:3000/evolution/relay",
  headers: {
    "Content-Type": "application/json",
    "x-flowise-token":
      "ff52c550a19a84ce0de929b75874ef8bbd503eeffdaeb324cdb7da0c7f4cd819cfb760c07b0e2578197fc3934c13df24",
  },
});
