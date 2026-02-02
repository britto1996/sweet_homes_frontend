"use client";

import { useFormik, type FormikConfig, type FormikHelpers, type FormikValues } from "formik";

/**
 * Small wrapper around Formik's useFormik to standardize defaults across the app.
 * Keeps the API identical to Formik while allowing shared defaults in one place.
 */
export function useReusableFormik<Values extends FormikValues>(
  config: FormikConfig<Values>
) {
  return useFormik<Values>({
    validateOnBlur: true,
    validateOnChange: false,
    ...config,
  });
}

export type { FormikHelpers };
