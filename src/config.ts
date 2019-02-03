import { eventNames } from "cluster";

const CONFIG = {
  develop: {
    cloundFuncEnv: "draw-test-33ca5e",
  },
  product: {
    cloundFuncEnv: "draw-9d1e6d",
  },
};
export const getConfig = CONFIG[env.MODE];
