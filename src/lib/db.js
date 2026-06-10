import GatewayClient from "https://gate.warungds.com/sdk/js/index.js";

const db = new GatewayClient(
  import.meta.env.VITE_API_URL,
  import.meta.env.VITE_API_KEY,
);

export default db;
