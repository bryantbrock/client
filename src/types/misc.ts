export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type WithRequired<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
  Required<T, K>;

export type ErrorResponse = { error: string };
