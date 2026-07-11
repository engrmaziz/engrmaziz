/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { envClient } from './env.client';

// We safely expose a combined config but strictly separate the validation 
// mechanisms to prevent server keys leaking into the client bundle.
export const env = {
  ...envClient,
  // We cannot spread server environment directly here because this file
  // might be imported into client components (though it shouldn't).
  // A safer pattern is to rely on envServer exclusively for backend code.
};
